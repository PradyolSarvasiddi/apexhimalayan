import { createClient } from '@/lib/supabase/client'
import type { Tour, TourImage } from '@/lib/types'

const supabase = createClient()

export async function getTours(category?: string) {
  try {
    let query = supabase
      .from('tours')
      .select('*, images:tour_images(*)')
      .order('display_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
    return (data as (Tour & { images: TourImage[] })[]) || [];
  } catch (err) {
    console.error('Fatal error in getTours:', err);
    return [];
  }
}

export async function getTourById(id: string) {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*, images:tour_images(*)')
      .eq('id', id)
      .order('display_order', { referencedTable: 'tour_images', ascending: true })
      .single()

    if (error) {
      console.error(`Error fetching tour by ID ${id}:`, error);
      return null;
    }
    return data as Tour & { images: TourImage[] };
  } catch (err) {
    console.error(`Fatal error in getTourById for ${id}:`, err);
    return null;
  }
}

export async function getTourBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*, images:tour_images(*)')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error(`Error fetching tour by slug ${slug}:`, error);
      return null;
    }
    return data as Tour & { images: TourImage[] };
  } catch (err) {
    console.error(`Fatal error in getTourBySlug for ${slug}:`, err);
    return null;
  }
}

export async function deleteTour(id: string) {
  // Get images first to clean up storage
  const { data: images } = await supabase
    .from('tour_images')
    .select('image_path')
    .eq('tour_id', id)

  if (images && images.length > 0) {
    await supabase.storage
      .from('tour-images')
      .remove(images.map((img: { image_path: string }) => img.image_path))
  }

  const { error } = await supabase
    .from('tours')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateTourField(id: string, field: string, value: unknown) {
  const { error } = await supabase
    .from('tours')
    .update({ [field]: value })
    .eq('id', id)

  if (error) throw error
}

export async function getTourStats() {
  try {
    const [
      { count: total },
      { count: available },
      { count: featured },
      { count: limited }
    ] = await Promise.all([
      supabase.from('tours').select('*', { count: 'exact', head: true }),
      supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_available', true),
      supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_limited_spots', true)
    ]);

    return {
      total: total || 0,
      available: available || 0,
      featured: featured || 0,
      limited: limited || 0,
    }
  } catch (err) {
    console.error('Error fetching tour stats:', err);
    return { total: 0, available: 0, featured: 0, limited: 0 };
  }
}
