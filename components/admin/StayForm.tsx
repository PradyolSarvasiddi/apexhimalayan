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
import { STAY_TYPES } from '@/lib/constants'
import { slugify } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { X } from 'lucide-react'
import type { Stay, StayImage } from '@/lib/types'

interface StayFormProps {
  stay?: Stay & { images: StayImage[] }
  mode: 'create' | 'edit'
}

interface FormData {
  name: string
  slug: string
  location: string
  type: string
  short_description: string
  description: string
  amenities: string[]
  contact_info: string
  is_featured: boolean
  is_available: boolean
}

export default function StayForm({ stay, mode }: StayFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<StayImage[]>(stay?.images || [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [amenityInput, setAmenityInput] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  useUnsavedChanges(isDirty)

  const [form, setForm] = useState<FormData>({
    name: stay?.name || '',
    slug: stay?.slug || '',
    location: stay?.location || '',
    type: stay?.type || '',
    short_description: stay?.short_description || '',
    description: stay?.description || '',
    amenities: stay?.amenities || [],
    contact_info: stay?.contact_info || '',
    is_featured: stay?.is_featured || false,
    is_available: stay?.is_available ?? true,
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
    if (mode === 'create' && form.name) {
      updateField('slug', slugify(form.name))
    }
  }, [form.name, mode, updateField])

  const addAmenity = () => {
    const value = amenityInput.trim()
    if (value && !form.amenities.includes(value)) {
      updateField('amenities', [...form.amenities, value])
      setAmenityInput('')
    }
  }

  const removeAmenity = (index: number) => {
    updateField('amenities', form.amenities.filter((_, i) => i !== index))
  }

  const handleAmenityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addAmenity()
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.slug.trim()) newErrors.slug = 'Slug is required'
    if (!form.location.trim()) newErrors.location = 'Location is required'
    if (!form.type) newErrors.type = 'Type is required'
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
      const stayData = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        location: form.location.trim(),
        type: form.type,
        short_description: form.short_description.trim() || null,
        description: form.description || null,
        amenities: form.amenities,
        contact_info: form.contact_info.trim() || null,
        is_featured: form.is_featured,
        is_available: form.is_available,
      }

      if (mode === 'edit' && stay) {
        const { error } = await supabase
          .from('stays')
          .update(stayData)
          .eq('id', stay.id)

        if (error) throw error
        toast.success('Stay updated successfully')
      } else {
        const { data, error } = await supabase
          .from('stays')
          .insert(stayData)
          .select()
          .single()

        if (error) throw error

        if (images.length > 0 && data) {
          const imageRecords = images.map((img, i) => ({
            stay_id: data.id,
            image_url: img.image_url,
            image_path: img.image_path,
            is_hero: img.is_hero,
            display_order: i,
          }))

          const { error: imgError } = await supabase
            .from('stay_images')
            .insert(imageRecords)

          if (imgError) throw imgError
        }

        toast.success('Stay created successfully')
      }

      setIsDirty(false)
      router.push('/admin/stays')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save stay'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (uploaded: { url: string; path: string }[]) => {
    const newImages: StayImage[] = uploaded.map((img, i) => ({
      id: crypto.randomUUID(),
      stay_id: stay?.id || '',
      image_url: img.url,
      image_path: img.path,
      is_hero: images.length === 0 && i === 0,
      display_order: images.length + i,
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)

    if (mode === 'edit' && stay) {
      for (const img of newImages) {
        await supabase.from('stay_images').insert({
          stay_id: stay.id,
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

    if (mode === 'edit' && stay) {
      await supabase.from('stay_images').update({ is_hero: false }).eq('stay_id', stay.id)
      await supabase.from('stay_images').update({ is_hero: true }).eq('id', imageId)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    setImages(prev => prev.filter(img => img.id !== imageId))

    if (mode === 'edit') {
      await supabase.from('stay_images').delete().eq('id', imageId)
      await supabase.storage.from('stay-images').remove([image.image_path])
    }
  }

  const handleReorderImages = async (reordered: any[]) => {
    setImages(reordered)

    if (mode === 'edit' && stay) {
      for (const img of reordered) {
        await supabase.from('stay_images')
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
            label="Name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., Riverside Camping Manali"
            error={errors.name}
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => updateField('slug', slugify(e.target.value))}
            hint="Auto-generated from name."
            error={errors.slug}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g., Manali, Himachal Pradesh"
              error={errors.location}
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => updateField('type', e.target.value)}
              options={STAY_TYPES}
              placeholder="Select type"
              error={errors.type}
            />
          </div>
          <Textarea
            label="Short Description"
            value={form.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
            placeholder="Brief summary..."
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

      {/* Section 2: Amenities */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Amenities</h2>
        <div className="flex gap-2 mb-3">
          <Input
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={handleAmenityKeyDown}
            placeholder="Type amenity and press Enter (e.g., Hot Water, Wi-Fi)"
            className="flex-1"
          />
          <Button type="button" variant="secondary" onClick={addAmenity}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.amenities.map((amenity, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border-default rounded-full text-sm text-text-primary"
            >
              {amenity}
              <button
                type="button"
                onClick={() => removeAmenity(i)}
                className="text-text-muted hover:text-danger transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {form.amenities.length === 0 && (
            <p className="text-sm text-text-muted">No amenities added yet</p>
          )}
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
            description="Stay is visible and bookable"
          />
          <ToggleSwitch
            checked={form.is_featured}
            onChange={(v) => updateField('is_featured', v)}
            label="Featured on Homepage"
            description="Show on the homepage featured section"
          />
        </div>
      </Card>

      {/* Section 4: Images */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Images</h2>
        <ImageUploader
          bucket="stay-images"
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

      {/* Section 5: Contact */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Contact & Booking</h2>
        <Textarea
          label="Contact Information"
          value={form.contact_info}
          onChange={(e) => updateField('contact_info', e.target.value)}
          placeholder="For bookings and enquiries..."
          className="min-h-[80px]"
        />
      </Card>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-68 bg-bg-secondary/95 backdrop-blur-sm border-t border-border-default px-6 py-4 z-20">
        <div className="max-w-4xl flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/stays')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={saving}
          >
            {mode === 'edit' ? 'Update Stay' : 'Save & Publish'}
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}
