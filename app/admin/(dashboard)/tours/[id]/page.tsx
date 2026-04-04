'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import TourForm from '@/components/admin/TourForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Tour, TourImage } from '@/lib/types'

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [tour, setTour] = useState<(Tour & { images: TourImage[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data, error } = await supabase
          .from('tours')
          .select('*, images:tour_images(*)')
          .eq('id', id)
          .order('display_order', { referencedTable: 'tour_images', ascending: true })
          .single()

        if (error) throw error
        setTour(data)
      } catch {
        toast.error('Tour not found')
        router.push('/admin/tours')
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [id, supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading tour..." />
      </div>
    )
  }

  if (!tour) return null

  return <TourForm tour={tour} mode="edit" />
}
