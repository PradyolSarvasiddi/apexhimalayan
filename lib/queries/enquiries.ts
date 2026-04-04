import { createClient } from '@/lib/supabase/client'
import type { Enquiry } from '@/lib/types'

const supabase = createClient()

export async function getEnquiries(filter?: 'all' | 'read' | 'unread') {
  try {
    let query = supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter === 'read') query = query.eq('is_read', true)
    if (filter === 'unread') query = query.eq('is_read', false)

    const { data, error } = await query
    if (error) {
      console.error('Error fetching enquiries:', error);
      return [];
    }
    return (data as Enquiry[]) || [];
  } catch (err) {
    console.error('Fatal error in getEnquiries:', err);
    return [];
  }
}

export async function getUnreadCount() {
  try {
    const { count, error } = await supabase
      .from('enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
    return count || 0;
  } catch (err) {
    console.error('Fatal error in getUnreadCount:', err);
    return 0;
  }
}

export async function markAsRead(id: string) {
  const { error } = await supabase
    .from('enquiries')
    .update({ is_read: true })
    .eq('id', id)

  if (error) throw error
}

export async function markAsUnread(id: string) {
  const { error } = await supabase
    .from('enquiries')
    .update({ is_read: false })
    .eq('id', id)

  if (error) throw error
}

export async function markAllAsRead() {
  const { error } = await supabase
    .from('enquiries')
    .update({ is_read: true })
    .eq('is_read', false)

  if (error) throw error
}

export async function deleteEnquiry(id: string) {
  const { error } = await supabase
    .from('enquiries')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getRecentEnquiries(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent enquiries:', error);
      return [];
    }
    return (data as Enquiry[]) || [];
  } catch (err) {
    console.error('Fatal error in getRecentEnquiries:', err);
    return [];
  }
}
