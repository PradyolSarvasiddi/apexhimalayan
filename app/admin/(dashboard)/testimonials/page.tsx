'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import ToggleSwitch from '@/components/admin/ToggleSwitch'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createClient } from '@/lib/supabase/client'
import { truncateText } from '@/lib/utils'
import { Plus, Pencil, Trash2, Star, MessageSquareQuote } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Testimonial, Tour } from '@/lib/types'

interface FormData {
  customer_name: string
  location: string
  review_text: string
  rating: number
  tour_id: string
  is_featured: boolean
}

const defaultForm: FormData = {
  customer_name: '',
  location: '',
  review_text: '',
  rating: 5,
  tour_id: '',
  is_featured: false,
}

export default function TestimonialsPage() {
  const supabase = createClient()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [tours, setTours] = useState<Pick<Tour, 'id' | 'title'>[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormData>(defaultForm)

  const fetchData = async () => {
    try {
      const [{ data: testimonialData }, { data: tourData }] = await Promise.all([
        supabase.from('testimonials').select('*').order('display_order', { ascending: true }),
        supabase.from('tours').select('id, title').order('title'),
      ])

      setTestimonials(testimonialData || [])
      setTours(tourData || [])
    } catch {
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setForm(defaultForm)
    setEditId(null)
    setModalOpen(true)
  }

  const openEdit = (testimonial: Testimonial) => {
    setForm({
      customer_name: testimonial.customer_name,
      location: testimonial.location || '',
      review_text: testimonial.review_text,
      rating: testimonial.rating,
      tour_id: testimonial.tour_id || '',
      is_featured: testimonial.is_featured,
    })
    setEditId(testimonial.id)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.customer_name.trim() || !form.review_text.trim()) {
      toast.error('Name and review text are required')
      return
    }

    setSaving(true)
    try {
      const data = {
        customer_name: form.customer_name.trim(),
        location: form.location.trim() || null,
        review_text: form.review_text.trim(),
        rating: form.rating,
        tour_id: form.tour_id || null,
        is_featured: form.is_featured,
      }

      if (editId) {
        const { error } = await supabase
          .from('testimonials')
          .update(data)
          .eq('id', editId)
        if (error) throw error
        toast.success('Testimonial updated')
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert(data)
        if (error) throw error
        toast.success('Testimonial added')
      }

      setModalOpen(false)
      fetchData()
    } catch {
      toast.error('Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    setTestimonials(prev => prev.map(t =>
      t.id === id ? { ...t, is_featured: featured } : t
    ))

    const { error } = await supabase
      .from('testimonials')
      .update({ is_featured: featured })
      .eq('id', id)

    if (error) {
      setTestimonials(prev => prev.map(t =>
        t.id === id ? { ...t, is_featured: !featured } : t
      ))
      toast.error('Failed to update')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', deleteId)
      if (error) throw error

      setTestimonials(prev => prev.filter(t => t.id !== deleteId))
      toast.success('Testimonial deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading testimonials..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.customer_name}</p>
                  {testimonial.location && (
                    <p className="text-xs text-text-muted">{testimonial.location}</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= testimonial.rating
                          ? 'text-accent-gold fill-accent-gold'
                          : 'text-border-strong'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-text-secondary flex-1 mb-3 leading-relaxed">
                &ldquo;{truncateText(testimonial.review_text, 150)}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border-default">
                <ToggleSwitch
                  checked={testimonial.is_featured}
                  onChange={(v) => handleToggleFeatured(testimonial.id, v)}
                  label="Featured"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(testimonial)}
                    className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(testimonial.id)}
                    className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<MessageSquareQuote className="w-8 h-8 text-text-muted" />}
          title="No testimonials yet"
          description="Add testimonials from happy customers."
          action={{ label: 'Add Testimonial', onClick: openCreate }}
        />
      )}

      {/* Add/Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Testimonial' : 'Add Testimonial'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Customer Name"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Delhi, India"
          />
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= form.rating
                        ? 'text-accent-gold fill-accent-gold'
                        : 'text-border-strong hover:text-accent-gold'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Review Text"
            value={form.review_text}
            onChange={(e) => setForm({ ...form, review_text: e.target.value })}
            placeholder="What did the customer say..."
          />
          <Select
            label="Link to Tour (optional)"
            value={form.tour_id}
            onChange={(e) => setForm({ ...form, tour_id: e.target.value })}
            options={tours.map(t => ({ value: t.id, label: t.title }))}
            placeholder="Select a tour..."
          />
          <ToggleSwitch
            checked={form.is_featured}
            onChange={(v) => setForm({ ...form, is_featured: v })}
            label="Featured"
            description="Show on homepage"
          />
          <Button
            onClick={handleSave}
            loading={saving}
            className="w-full"
          >
            {editId ? 'Update Testimonial' : 'Add Testimonial'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="Are you sure? This cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
