'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ImageUploader from '@/components/admin/ImageUploader'
import { GALLERY_CATEGORIES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Upload, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import type { GalleryImage } from '@/lib/types'

export default function GalleryPage() {
  const supabase = createClient()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editImage, setEditImage] = useState<GalleryImage | null>(null)
  const [deleteId, setDeleteId] = useState<{ id: string; path: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [uploadCategory, setUploadCategory] = useState('')
  const [uploadCaption, setUploadCaption] = useState('')
  const [pendingUploads, setPendingUploads] = useState<{ url: string; path: string }[]>([])

  const fetchImages = async () => {
    try {
      let query = supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true })

      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory)
      }

      const { data, error } = await query
      if (error) throw error
      setImages(data || [])
    } catch {
      toast.error('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [activeCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUploadComplete = (uploaded: { url: string; path: string }[]) => {
    setPendingUploads(uploaded)
  }

  const handleSaveUploads = async () => {
    if (!uploadCategory) {
      toast.error('Please select a category')
      return
    }

    try {
      for (const upload of pendingUploads) {
        const { error } = await supabase.from('gallery').insert({
          image_url: upload.url,
          image_path: upload.path,
          category: uploadCategory,
          caption: uploadCaption || null,
        })
        if (error) throw error
      }

      toast.success(`${pendingUploads.length} photo${pendingUploads.length > 1 ? 's' : ''} added to gallery`)
      setUploadOpen(false)
      setPendingUploads([])
      setUploadCategory('')
      setUploadCaption('')
      fetchImages()
    } catch {
      toast.error('Failed to save photos')
    }
  }

  const handleUpdateImage = async () => {
    if (!editImage) return

    try {
      const { error } = await supabase
        .from('gallery')
        .update({
          category: editImage.category,
          caption: editImage.caption,
        })
        .eq('id', editImage.id)

      if (error) throw error

      setImages(prev => prev.map(img =>
        img.id === editImage.id ? editImage : img
      ))
      toast.success('Photo updated')
      setEditImage(null)
    } catch {
      toast.error('Failed to update photo')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      await supabase.storage.from('gallery-images').remove([deleteId.path])
      const { error } = await supabase.from('gallery').delete().eq('id', deleteId.id)
      if (error) throw error

      setImages(prev => prev.filter(img => img.id !== deleteId.id))
      toast.success('Photo deleted')
    } catch {
      toast.error('Failed to delete photo')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const categories = ['all', ...GALLERY_CATEGORIES.map(c => c.value)]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading gallery..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="w-4 h-4" />
          Upload Photos
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-bg-card rounded-lg p-1 w-fit flex-wrap">
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

      {/* Gallery grid */}
      {images.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group break-inside-avoid rounded-lg overflow-hidden border border-border-default"
            >
              <img
                src={image.image_url}
                alt={image.caption || ''}
                className="w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                <Badge variant="orange" size="sm" className="mb-2">
                  {image.category}
                </Badge>
                {image.caption && (
                  <p className="text-sm text-white text-center px-4 mb-3">{image.caption}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditImage(image)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setDeleteId({ id: image.id, path: image.image_path })}
                    className="p-2 bg-white/20 rounded-lg hover:bg-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ImageIcon className="w-8 h-8 text-text-muted" />}
          title={activeCategory === 'all' ? 'No photos yet' : `No photos in ${activeCategory}`}
          description="Upload some photos to build your gallery."
          action={{ label: 'Upload Photos', onClick: () => setUploadOpen(true) }}
        />
      )}

      {/* Upload modal */}
      <Modal
        isOpen={uploadOpen}
        onClose={() => { setUploadOpen(false); setPendingUploads([]) }}
        title="Upload Photos"
        size="lg"
      >
        <div className="space-y-4">
          <ImageUploader
            bucket="gallery-images"
            onUpload={handleUploadComplete}
            maxFiles={10}
            label="Select Photos"
          />
          {pendingUploads.length > 0 && (
            <>
              <Select
                label="Category"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                options={GALLERY_CATEGORIES}
                placeholder="Select category for uploaded photos"
              />
              <Input
                label="Caption (optional)"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Optional caption for these photos"
              />
              <Button onClick={handleSaveUploads} className="w-full">
                Save {pendingUploads.length} Photo{pendingUploads.length > 1 ? 's' : ''} to Gallery
              </Button>
            </>
          )}
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editImage}
        onClose={() => setEditImage(null)}
        title="Edit Photo"
        size="sm"
      >
        {editImage && (
          <div className="space-y-4">
            <img
              src={editImage.image_url}
              alt=""
              className="w-full rounded-lg"
            />
            <Select
              label="Category"
              value={editImage.category}
              onChange={(e) => setEditImage({ ...editImage, category: e.target.value as GalleryImage['category'] })}
              options={GALLERY_CATEGORIES}
            />
            <Input
              label="Caption"
              value={editImage.caption || ''}
              onChange={(e) => setEditImage({ ...editImage, caption: e.target.value })}
              placeholder="Photo caption..."
            />
            <Button onClick={handleUpdateImage} className="w-full">
              Save Changes
            </Button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Photo"
        message="Are you sure? This cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
