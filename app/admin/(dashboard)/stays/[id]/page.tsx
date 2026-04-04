'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import StayForm from '@/components/admin/StayForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Stay, StayImage } from '@/lib/types'

export default function EditStayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [stay, setStay] = useState<(Stay & { images: StayImage[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStay = async () => {
      try {
        const { data, error } = await supabase
          .from('stays')
          .select('*, images:stay_images(*)')
          .eq('id', id)
          .order('display_order', { referencedTable: 'stay_images', ascending: true })
          .single()

        if (error) throw error
        setStay(data)
      } catch {
        toast.error('Stay not found')
        router.push('/admin/stays')
      } finally {
        setLoading(false)
      }
    }

    fetchStay()
  }, [id, supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading stay..." />
      </div>
    )
  }

  if (!stay) return null

  return <StayForm stay={stay} mode="edit" />
}
