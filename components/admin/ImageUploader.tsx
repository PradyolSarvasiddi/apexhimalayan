'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface UploadedImage {
  url: string
  path: string
}

interface ImageUploaderProps {
  bucket: string
  folder?: string
  onUpload: (images: UploadedImage[]) => void
  maxFiles?: number
  label?: string
}

interface FileWithProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

export default function ImageUploader({
  bucket,
  folder = '',
  onUpload,
  maxFiles = 10,
  label = 'Upload Images',
}: ImageUploaderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and WebP files are accepted'
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `File too large. Max size is ${formatFileSize(MAX_IMAGE_SIZE)}`
    }
    return null
  }

  const uploadFile = useCallback(async (file: File, index: number): Promise<UploadedImage | null> => {
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const fileName = `${folder ? folder + '/' : ''}${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    setFiles(prev => prev.map((f, i) =>
      i === index ? { ...f, status: 'uploading' as const, progress: 30 } : f
    ))

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) {
      setFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, status: 'error' as const, error: error.message } : f
      ))
      return null
    }

    setFiles(prev => prev.map((f, i) =>
      i === index ? { ...f, status: 'done' as const, progress: 100 } : f
    ))

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      path: data.path,
    }
  }, [bucket, folder, supabase])

  const handleFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles).slice(0, maxFiles)
    const validFiles: FileWithProgress[] = []

    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        toast.error(`${file.name}: ${error}`)
      } else {
        validFiles.push({ file, progress: 0, status: 'pending' })
      }
    }

    if (validFiles.length === 0) return

    setFiles(validFiles)

    const results: UploadedImage[] = []
    for (let i = 0; i < validFiles.length; i++) {
      const result = await uploadFile(validFiles[i].file, i)
      if (result) results.push(result)
    }

    if (results.length > 0) {
      onUpload(results)
      toast.success(`${results.length} image${results.length > 1 ? 's' : ''} uploaded`)
    }

    setTimeout(() => setFiles([]), 2000)
  }, [maxFiles, onUpload, uploadFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-accent-orange bg-accent-orange/5'
            : 'border-border-strong hover:border-text-muted'
        )}
      >
        <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
        <p className="text-sm text-text-secondary mb-1">
          Drop images here or click to browse
        </p>
        <p className="text-xs text-text-muted">
          JPG, PNG, WebP — max {formatFileSize(MAX_IMAGE_SIZE)} per file
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{f.file.name}</p>
                <p className="text-xs text-text-muted">{formatFileSize(f.file.size)}</p>
              </div>
              {f.status === 'uploading' && (
                <div className="w-24 h-1.5 bg-border-default rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-orange rounded-full transition-all duration-300"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              )}
              {f.status === 'done' && (
                <span className="text-xs text-success font-medium">Done</span>
              )}
              {f.status === 'error' && (
                <span className="text-xs text-danger">{f.error}</span>
              )}
              {f.status === 'pending' && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                  className="p-1 text-text-muted hover:text-danger"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
