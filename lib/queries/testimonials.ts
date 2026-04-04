import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/lib/types'

const supabase = createClient()

export async function getTestimonials() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*, tour:tours(id, title)')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
    return (data as Testimonial[]) || [];
  } catch (err) {
    console.error('Fatal error in getTestimonials:', err);
    return [];
  }
}

export async function createTestimonial(testimonial: {
  customer_name: string
  location?: string
  review_text: string
  rating: number
  tour_id?: string
  is_featured: boolean
}) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single()

  if (error) throw error
  return data as Testimonial
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const { error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) throw error
}
