import { createClient } from '@/lib/supabase/client'
import type { GalleryImage } from '@/lib/types'

const supabase = createClient()

export async function getGalleryImages(category?: string) {
  try {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
    return (data as GalleryImage[]) || [];
  } catch (err) {
    console.error('Fatal error in getGalleryImages:', err);
    return [];
  }
}

export async function uploadGalleryImage(imageData: {
  image_url: string
  image_path: string
  category: string
  caption?: string
}) {
  const { data, error } = await supabase
    .from('gallery')
    .insert(imageData)
    .select()
    .single()

  if (error) throw error
  return data as GalleryImage
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>) {
  const { error } = await supabase
    .from('gallery')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function deleteGalleryImage(id: string, imagePath: string) {
  await supabase.storage.from('gallery-images').remove([imagePath])

  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)

  if (error) throw error
}
