'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
import { Plus, Pencil, Trash2, Home } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Stay, StayImage } from '@/lib/types'

const typeColors: Record<string, 'orange' | 'green' | 'yellow' | 'blue'> = {
  camping: 'yellow',
  guesthouse: 'green',
  hotel: 'blue',
  homestay: 'orange',
}

export default function StaysPage() {
  const router = useRouter()
  const supabase = createClient()
  const [stays, setStays] = useState<(Stay & { images: StayImage[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchStays = async () => {
    try {
      let query = supabase
        .from('stays')
        .select('*, images:stay_images(*)')
        .order('display_order', { ascending: true })

      if (activeType !== 'all') {
        query = query.eq('type', activeType)
      }

      const { data, error } = await query
      if (error) throw error
      setStays(data || [])
    } catch {
      toast.error('Failed to load stays')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStays()
  }, [activeType]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async (id: string, field: string, value: boolean) => {
    setStays(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))

    const { error } = await supabase.from('stays').update({ [field]: value }).eq('id', id)
    if (error) {
      setStays(prev => prev.map(s => s.id === id ? { ...s, [field]: !value } : s))
      toast.error('Failed to update')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      const { data: images } = await supabase
        .from('stay_images')
        .select('image_path')
        .eq('stay_id', deleteId)

      if (images?.length) {
        await supabase.storage.from('stay-images').remove(images.map((i: any) => i.image_path))
      }

      const { error } = await supabase.from('stays').delete().eq('id', deleteId)
      if (error) throw error

      setStays(prev => prev.filter(s => s.id !== deleteId))
      toast.success('Stay deleted')
    } catch {
      toast.error('Failed to delete stay')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const types = ['all', 'camping', 'guesthouse', 'hotel', 'homestay']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading stays..." />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AdminHeader 
        action={
          <Link href="/admin/stays/new">
            <Button className="bg-accent-gold hover:bg-accent-gold-light text-[#0D0F0E] border-none font-black tracking-widest shadow-gold">
              <Plus className="w-4 h-4" />
              Add New Stay
            </Button>
          </Link>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 bg-bg-card rounded-lg p-1 w-fit mb-6">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium capitalize transition-all',
              activeType === type
                ? 'bg-accent-orange text-white'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {stays.length > 0 ? (
        <Card padding="none" className="overflow-hidden border border-border-default rounded-lg bg-[#1C2219]">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left text-xs text-text-muted font-medium p-3">Image</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Name</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Location</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Type</th>
                <th className="text-center text-xs text-text-muted font-medium p-3">Available</th>
                <th className="text-center text-xs text-text-muted font-medium p-3">Featured</th>
                <th className="text-right text-xs text-text-muted font-medium p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stays.map((stay) => {
                const heroImage = stay.images?.find(i => i.is_hero) || stay.images?.[0]
                return (
                  <tr
                    key={stay.id}
                    className="border-b border-border-default last:border-0 hover:bg-bg-elevated/50 transition-colors"
                  >
                    <td className="p-3">
                      {heroImage ? (
                        <Image 
                          src={heroImage.image_url} 
                          alt={stay.name} 
                          width={48} 
                          height={32} 
                          className="w-12 h-8 object-cover rounded" 
                        />
                      ) : (
                        <div className="w-12 h-8 bg-bg-elevated rounded flex items-center justify-center">
                          <Home className="w-4 h-4 text-text-muted" />
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <p className="text-sm font-medium text-text-primary">{stay.name}</p>
                    </td>
                    <td className="p-3 text-sm text-text-secondary">{stay.location}</td>
                    <td className="p-3">
                      <Badge variant={typeColors[stay.type]}>{stay.type}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={stay.is_available}
                          onChange={(v) => handleToggle(stay.id, 'is_available', v)}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={stay.is_featured}
                          onChange={(v) => handleToggle(stay.id, 'is_featured', v)}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/stays/${stay.id}`)}
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(stay.id)}
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
          icon={<Home className="w-8 h-8 text-text-muted" />}
          title="No stays yet"
          description="Add your first stay to get started."
          action={{ label: 'Add Stay', onClick: () => router.push('/admin/stays/new') }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Stay"
        message="Are you sure? This cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
