'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ToggleSwitch from '@/components/admin/ToggleSwitch'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUploader from '@/components/admin/ImageUploader'
import ImageReorder from '@/components/admin/ImageReorder'
import ItineraryBuilder from '@/components/admin/ItineraryBuilder'
import InclusionsBuilder from '@/components/admin/InclusionsBuilder'
import { TOUR_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/constants'
import { slugify, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import type { Tour, TourImage, ItineraryDay } from '@/lib/types'

interface TourFormProps {
  tour?: Tour & { images: TourImage[] }
  mode: 'create' | 'edit'
}

interface FormData {
  title: string
  slug: string
  category: string
  short_description: string
  description: string
  duration_days: string
  difficulty: string
  best_season: string
  group_size_min: string
  group_size_max: string
  is_featured: boolean
  is_available: boolean
  is_limited_spots: boolean
  is_popular: boolean
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  contact_info: string
}

export default function TourForm({ tour, mode }: TourFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<TourImage[]>(tour?.images || [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  useUnsavedChanges(isDirty)

  const [form, setForm] = useState<FormData>({
    title: tour?.title || '',
    slug: tour?.slug || '',
    category: tour?.category || '',
    short_description: tour?.short_description || '',
    description: tour?.description || '',
    duration_days: tour?.duration_days?.toString() || '',
    difficulty: tour?.difficulty || '',
    best_season: tour?.best_season || '',
    group_size_min: tour?.group_size_min?.toString() || '1',
    group_size_max: tour?.group_size_max?.toString() || '12',
    is_featured: tour?.is_featured || false,
    is_available: tour?.is_available ?? true,
    is_limited_spots: tour?.is_limited_spots || false,
    is_popular: tour?.is_popular || false,
    itinerary: tour?.itinerary || [],
    inclusions: tour?.inclusions || [],
    exclusions: tour?.exclusions || [],
    contact_info: tour?.contact_info || '',
  })

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }, [errors])

  useEffect(() => {
    if (mode === 'create' && form.title) {
      updateField('slug', slugify(form.title))
    }
  }, [form.title, mode, updateField])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.slug.trim()) newErrors.slug = 'Slug is required'
    if (!form.category) newErrors.category = 'Category is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Please fix the errors before saving')
      return
    }

    setSaving(true)
    try {
      if (form.is_popular) {
        // If it's popular, check if we're exceeding the limit of 10
        // We only care about other popular tours
        let query = supabase.from('tours').select('id', { count: 'exact' }).eq('is_popular', true)
        if (mode === 'edit' && tour) {
          query = query.neq('id', tour.id)
        }
        const { count } = await query
        if (count && count >= 10) {
          toast.error('Maximum 10 popular destinations allowed. Please remove one first.')
          setSaving(false)
          return
        }
      }
      const tourData = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category,
        short_description: form.short_description.trim() || null,
        description: form.description || null,
        duration_days: form.duration_days ? parseInt(form.duration_days) : null,
        difficulty: form.difficulty || null,
        best_season: form.best_season.trim() || null,
        group_size_min: parseInt(form.group_size_min) || 1,
        group_size_max: parseInt(form.group_size_max) || 12,
        is_featured: form.is_featured,
        is_available: form.is_available,
        is_limited_spots: form.is_limited_spots,
        is_popular: form.is_popular,
        itinerary: form.itinerary,
        inclusions: form.inclusions.filter(Boolean),
        exclusions: form.exclusions.filter(Boolean),
        contact_info: form.contact_info.trim() || null,
      }

      if (mode === 'edit' && tour) {
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', tour.id)

        if (error) throw error
        toast.success('Tour updated successfully')
      } else {
        const { data, error } = await supabase
          .from('tours')
          .insert(tourData)
          .select()
          .single()

        if (error) throw error

        // Save images with tour reference
        if (images.length > 0 && data) {
          const imageRecords = images.map((img, i) => ({
            tour_id: data.id,
            image_url: img.image_url,
            image_path: img.image_path,
            is_hero: img.is_hero,
            display_order: i,
          }))

          const { error: imgError } = await supabase
            .from('tour_images')
            .insert(imageRecords)

          if (imgError) throw imgError
        }

        toast.success('Tour created successfully')
      }

      setIsDirty(false)
      router.push('/admin/tours')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save tour'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (uploaded: { url: string; path: string }[]) => {
    const newImages: TourImage[] = uploaded.map((img, i) => ({
      id: crypto.randomUUID(),
      tour_id: tour?.id || '',
      image_url: img.url,
      image_path: img.path,
      is_hero: images.length === 0 && i === 0,
      display_order: images.length + i,
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)

    if (mode === 'edit' && tour) {
      for (const img of newImages) {
        await supabase.from('tour_images').insert({
          tour_id: tour.id,
          image_url: img.image_url,
          image_path: img.image_path,
          is_hero: img.is_hero,
          display_order: img.display_order,
        })
      }
    }
  }

  const handleSetHero = async (imageId: string) => {
    const updated = images.map(img => ({
      ...img,
      is_hero: img.id === imageId,
    }))
    setImages(updated)

    if (mode === 'edit' && tour) {
      await supabase.from('tour_images').update({ is_hero: false }).eq('tour_id', tour.id)
      await supabase.from('tour_images').update({ is_hero: true }).eq('id', imageId)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    setImages(prev => prev.filter(img => img.id !== imageId))

    if (mode === 'edit') {
      await supabase.from('tour_images').delete().eq('id', imageId)
      await supabase.storage.from('tour-images').remove([image.image_path])
    }
  }

  const handleReorderImages = async (reordered: any[]) => {
    setImages(reordered)

    if (mode === 'edit' && tour) {
      for (const img of reordered) {
        await supabase.from('tour_images')
          .update({ display_order: img.display_order })
          .eq('id', img.id)
      }
    }
  }

  return (
    <div className="max-w-4xl flex flex-col pb-24">
      <AdminHeader />
      <div className="space-y-6">
      {/* Section 1: Basic Information */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Basic Information</h2>
        <div className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., Spiti Valley Motorcycle Expedition"
            error={errors.title}
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => updateField('slug', slugify(e.target.value))}
            placeholder="spiti-valley-motorcycle-expedition"
            hint="Auto-generated from title. Used in the URL."
            error={errors.slug}
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            options={TOUR_CATEGORIES}
            placeholder="Select category"
            error={errors.category}
          />
          <Textarea
            label="Short Description"
            value={form.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
            placeholder="Brief summary for previews and listings..."
            charCount={{ current: form.short_description.length, max: 160 }}
            className="min-h-[80px]"
          />
          <RichTextEditor
            label="Full Description"
            content={form.description}
            onChange={(content) => updateField('description', content)}
          />
        </div>
      </Card>

      {/* Section 2: Trip Details */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Trip Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration"
              type="number"
              min="1"
              value={form.duration_days}
              onChange={(e) => updateField('duration_days', e.target.value)}
              placeholder="Number of days"
              hint="days"
            />
            <Input
              label="Best Season"
              value={form.best_season}
              onChange={(e) => updateField('best_season', e.target.value)}
              placeholder="e.g., June - September"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => updateField('difficulty', level.value)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    form.difficulty === level.value
                      ? 'border-accent-orange bg-accent-orange/10 text-text-primary'
                      : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong'
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Group Size"
              type="number"
              min="1"
              value={form.group_size_min}
              onChange={(e) => updateField('group_size_min', e.target.value)}
            />
            <Input
              label="Max Group Size"
              type="number"
              min="1"
              value={form.group_size_max}
              onChange={(e) => updateField('group_size_max', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Section 3: Status Toggles */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ToggleSwitch
            checked={form.is_available}
            onChange={(v) => updateField('is_available', v)}
            label="Available"
            description="Tour is visible and bookable"
          />
          <ToggleSwitch
            checked={form.is_featured}
            onChange={(v) => updateField('is_featured', v)}
            label="Featured on Homepage"
            description="Show on the homepage featured section"
          />
          <ToggleSwitch
            checked={form.is_limited_spots}
            onChange={(v) => updateField('is_limited_spots', v)}
            label="Limited Spots"
            description="Show limited availability badge"
          />
          <ToggleSwitch
            checked={form.is_popular}
            onChange={(v) => updateField('is_popular', v)}
            label="Popular Destination"
            description="Show in Popular Destinations section (Max 10)"
          />
        </div>
      </Card>

      {/* Section 4: Images */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Images</h2>
        <ImageUploader
          bucket="tour-images"
          folder={form.slug || 'unsorted'}
          onUpload={handleImageUpload}
        />
        {images.length > 0 && (
          <div className="mt-4">
            <ImageReorder
              images={images}
              onReorder={handleReorderImages}
              onSetHero={handleSetHero}
              onDelete={handleDeleteImage}
            />
          </div>
        )}
      </Card>

      {/* Section 5: Itinerary */}
      <Card>
        <ItineraryBuilder
          days={form.itinerary}
          onChange={(days) => updateField('itinerary', days)}
        />
      </Card>

      {/* Section 6: Inclusions & Exclusions */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Inclusions & Exclusions</h2>
        <InclusionsBuilder
          inclusions={form.inclusions}
          exclusions={form.exclusions}
          onInclusionsChange={(items) => updateField('inclusions', items)}
          onExclusionsChange={(items) => updateField('exclusions', items)}
        />
      </Card>

      {/* Section 7: Contact */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Contact & Booking</h2>
        <Textarea
          label="Contact Information"
          value={form.contact_info}
          onChange={(e) => updateField('contact_info', e.target.value)}
          placeholder="For bookings and enquiries, contact us at..."
          className="min-h-[80px]"
        />
        <p className="text-xs text-text-muted mt-2">
          No pricing shown — visitors will be directed to contact for bookings.
        </p>
      </Card>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-68 bg-bg-secondary/95 backdrop-blur-sm border-t border-border-default px-6 py-4 z-20">
        <div className="max-w-4xl flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/tours')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={saving}
          >
            {mode === 'edit' ? 'Update Tour' : 'Save & Publish'}
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}
