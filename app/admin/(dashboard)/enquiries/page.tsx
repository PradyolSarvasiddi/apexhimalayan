'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createClient } from '@/lib/supabase/client'
import { cn, formatDateTime } from '@/lib/utils'
import { Mail, Eye, EyeOff, Trash2, MessageCircle, MailIcon, CheckCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import type { Enquiry } from '@/lib/types'

export default function EnquiriesPage() {
  const supabase = createClient()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchEnquiries = async () => {
    try {
      let query = supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'read') query = query.eq('is_read', true)
      if (filter === 'unread') query = query.eq('is_read', false)

      const [{ data }, { count }] = await Promise.all([
        query,
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ])

      setEnquiries(data || [])
      setUnreadCount(count || 0)
    } catch {
      toast.error('Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleRead = async (id: string, isRead: boolean) => {
    setEnquiries(prev => prev.map(e =>
      e.id === id ? { ...e, is_read: !isRead } : e
    ))

    const { error } = await supabase
      .from('enquiries')
      .update({ is_read: !isRead })
      .eq('id', id)

    if (error) {
      setEnquiries(prev => prev.map(e =>
        e.id === id ? { ...e, is_read: isRead } : e
      ))
      toast.error('Failed to update')
    } else {
      setUnreadCount(prev => isRead ? prev + 1 : prev - 1)
    }
  }

  const markAllRead = async () => {
    const { error } = await supabase
      .from('enquiries')
      .update({ is_read: true })
      .eq('is_read', false)

    if (error) {
      toast.error('Failed to mark all as read')
    } else {
      setEnquiries(prev => prev.map(e => ({ ...e, is_read: true })))
      setUnreadCount(0)
      toast.success('All marked as read')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', deleteId)
      if (error) throw error

      const wasUnread = enquiries.find(e => e.id === deleteId)?.is_read === false
      setEnquiries(prev => prev.filter(e => e.id !== deleteId))
      if (wasUnread) setUnreadCount(prev => prev - 1)
      toast.success('Enquiry deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filters = ['all', 'unread', 'read'] as const

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading enquiries..." />
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#151A17] min-h-screen px-6 md:px-10 pb-12">
      <AdminHeader 
        action={
          unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )
        }
      />

      {/* Header Info */}
      <div className="flex items-center gap-3 mb-6">
        {unreadCount > 0 && (
          <Badge variant="gold" className="shadow-gold/20">{unreadCount} unread enquiries</Badge>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-bg-card rounded-lg p-1 w-fit mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-black uppercase tracking-widest transition-all',
              filter === f
                ? 'bg-accent-gold text-[#0D0F0E] shadow-gold'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Enquiries table */}
      {enquiries.length > 0 ? (
        <Card padding="sm" className="bg-[#1C2219] border-[#2A3530]">
          <div className="divide-y divide-[#2A3530]">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id}>
                <div
                  onClick={() => {
                    setExpandedId(expandedId === enquiry.id ? null : enquiry.id)
                    if (!enquiry.is_read) toggleRead(enquiry.id, false)
                  }}
                  className={cn(
                    'flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-[#243028] border-l-2 border-transparent transition-all duration-300',
                    !enquiry.is_read ? 'bg-[#243028]/40 border-l-[#C9A84C]' : ''
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!enquiry.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#C9A84C] shrink-0 glow-gold" />
                      )}
                      <p className={cn(
                        'text-sm truncate',
                        !enquiry.is_read ? 'font-semibold text-text-primary' : 'text-text-secondary'
                      )}>
                        {enquiry.name}
                      </p>
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      {enquiry.email} {enquiry.phone && `· ${enquiry.phone}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    {enquiry.tour_interested && (
                      <p className="text-xs text-text-muted mb-1">{enquiry.tour_interested}</p>
                    )}
                    <p className="text-xs text-text-muted">{formatDateTime(enquiry.created_at)}</p>
                  </div>
                </div>

                {expandedId === enquiry.id && (
                  <div className="px-4 pb-4 bg-bg-elevated/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                      {enquiry.tour_interested && (
                        <div>
                          <span className="text-text-muted">Tour: </span>
                          <span className="text-text-primary">{enquiry.tour_interested}</span>
                        </div>
                      )}
                      {enquiry.preferred_dates && (
                        <div>
                          <span className="text-text-muted">Preferred dates: </span>
                          <span className="text-text-primary">{enquiry.preferred_dates}</span>
                        </div>
                      )}
                    </div>
                    {enquiry.message && (
                      <p className="text-sm text-[#9A9585] bg-[#243028] border border-white/5 rounded-lg p-4 mb-4 shadow-inner">
                        {enquiry.message}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); toggleRead(enquiry.id, enquiry.is_read) }}
                      >
                        {enquiry.is_read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {enquiry.is_read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                      {enquiry.phone && (
                        <a
                          href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </Button>
                        </a>
                      )}
                      <a
                        href={`mailto:${enquiry.email}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm">
                          <MailIcon className="w-3.5 h-3.5" />
                          Email
                        </Button>
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(enquiry.id) }}
                        className="ml-auto p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={<Mail className="w-8 h-8 text-text-muted" />}
          title="No enquiries yet"
          description="When visitors contact you, they'll appear here."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message="Are you sure? This cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
