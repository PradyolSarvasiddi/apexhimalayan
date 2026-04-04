'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import ToggleSwitch from '@/components/admin/ToggleSwitch'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import AdminHeader from '@/components/admin/AdminHeader'
import { Plus, Pencil, Trash2, Map } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Tour, TourImage } from '@/lib/types'

const categoryColors: Record<string, 'orange' | 'green' | 'yellow'> = {
  motorcycle: 'orange',
  trekking: 'green',
  camping: 'yellow',
}

export default function ToursPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tours, setTours] = useState<(Tour & { images: TourImage[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [stats, setStats] = useState({ total: 0, available: 0, featured: 0, limited: 0 })

  const fetchTours = async () => {
    try {
      let query = supabase
        .from('tours')
        .select('*, images:tour_images(*)')
        .order('display_order', { ascending: true })

      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory)
      }

      const { data, error } = await query
      if (error) throw error
      setTours(data || [])

      // Fetch stats
      const [
        { count: total },
        { count: available },
        { count: featured },
        { count: limited },
      ] = await Promise.all([
        supabase.from('tours').select('*', { count: 'exact', head: true }),
        supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_available', true),
        supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_featured', true),
        supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_limited_spots', true),
      ])

      setStats({
        total: total || 0,
        available: available || 0,
        featured: featured || 0,
        limited: limited || 0,
      })
    } catch {
      toast.error('Failed to load tours')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, [activeCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async (id: string, field: string, value: boolean) => {
    if (field === 'is_popular' && value === true) {
      const popularCount = tours.filter(t => t.is_popular).length
      if (popularCount >= 10) {
        toast.error('Maximum 10 popular destinations allowed. Remove one first.')
        return
      }
    }

    // Optimistic update
    setTours(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))

    const { error } = await supabase.from('tours').update({ [field]: value }).eq('id', id)
    if (error) {
      setTours(prev => prev.map(t => t.id === id ? { ...t, [field]: !value } : t))
      toast.error('Failed to update')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      const { data: images } = await supabase
        .from('tour_images')
        .select('image_path')
        .eq('tour_id', deleteId)

      if (images?.length) {
        await supabase.storage.from('tour-images').remove(images.map((i: any) => i.image_path))
      }

      const { error } = await supabase.from('tours').delete().eq('id', deleteId)
      if (error) throw error

      setTours(prev => prev.filter(t => t.id !== deleteId))
      toast.success('Tour deleted')
    } catch {
      toast.error('Failed to delete tour')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const categories = ['all', 'motorcycle', 'trekking', 'camping']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading tours..." />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AdminHeader 
        action={
          <Link href="/admin/tours/new">
            <Button className="bg-accent-gold hover:bg-accent-gold-light text-[#0D0F0E] border-none font-black tracking-widest shadow-gold">
              <Plus className="w-4 h-4" />
              Add New Tour
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Tours', value: stats.total },
          { label: 'Available', value: stats.available },
          { label: 'Featured', value: stats.featured },
          { label: 'Limited Spots', value: stats.limited },
        ].map((s) => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-text-muted">{s.label}</p>
            <p className="text-xl font-bold text-text-primary">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-bg-card rounded-lg p-1 w-fit mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium capitalize transition-all',
              activeCategory === cat
                ? 'bg-accent-orange text-white'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tours table */}
      {tours.length > 0 ? (
        <Card padding="none" className="overflow-hidden border border-border-default rounded-lg bg-[#1C2219]">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left text-xs text-text-muted font-medium p-3">Image</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Title</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Category</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Duration</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Difficulty</th>
                <th className="text-center text-xs text-text-muted font-medium p-3">Available</th>
                <th className="text-center text-xs text-text-muted font-medium p-3">Featured</th>
                <th className="text-center text-xs text-text-muted font-medium p-3">Popular</th>
                <th className="text-right text-xs text-text-muted font-medium p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => {
                const heroImage = tour.images?.find(i => i.is_hero) || tour.images?.[0]
                return (
                  <tr
                    key={tour.id}
                    className="border-b border-border-default last:border-0 hover:bg-bg-elevated/50 transition-colors"
                  >
                    <td className="p-3">
                      {heroImage ? (
                        <img
                          src={heroImage.image_url}
                          alt=""
                          className="w-12 h-8 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-8 bg-bg-elevated rounded flex items-center justify-center">
                          <Map className="w-4 h-4 text-text-muted" />
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <p className="text-sm font-medium text-text-primary">{tour.title}</p>
                      <p className="text-xs text-text-muted">{tour.slug}</p>
                    </td>
                    <td className="p-3">
                      <Badge variant={categoryColors[tour.category]}>
                        {tour.category}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-text-secondary">
                      {tour.duration_days ? `${tour.duration_days} days` : '—'}
                    </td>
                    <td className="p-3">
                      {tour.difficulty ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                tour.difficulty === 'easy' ? '#4A7C4E' :
                                tour.difficulty === 'moderate' ? '#C8860A' : '#B5451B',
                            }}
                          />
                          <span className="text-sm text-text-secondary capitalize">
                            {tour.difficulty}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={tour.is_available}
                          onChange={(v) => handleToggle(tour.id, 'is_available', v)}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={tour.is_featured}
                          onChange={(v) => handleToggle(tour.id, 'is_featured', v)}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={tour.is_popular}
                          onChange={(v) => handleToggle(tour.id, 'is_popular', v)}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/tours/${tour.id}`)}
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(tour.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={<Map className="w-8 h-8 text-text-muted" />}
          title="No tours yet"
          description="Add your first tour to get started."
          action={{ label: 'Add Tour', onClick: () => router.push('/admin/tours/new') }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Tour"
        message="Are you sure? This cannot be undone. All images will also be deleted."
        loading={deleting}
      />
    </div>
  )
}
