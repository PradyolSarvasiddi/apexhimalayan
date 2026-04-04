'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import ToastProvider from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      setUnreadCount(count || 0)
    }

    fetchUnread()

    const channel = supabase
      .channel('enquiries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
        fetchUnread()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="min-h-screen bg-bg-primary">
      <ToastProvider />
      <AdminSidebar unreadCount={unreadCount} />
      <main className="lg:pl-68">
        <div className="p-[24px_20px] lg:p-[40px_48px] pt-20 lg:pt-[40px]">
          {children}
        </div>
      </main>
    </div>
  )
}
