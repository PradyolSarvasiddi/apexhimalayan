import { createClient } from '@/lib/supabase/client'
import type { Stay, StayImage } from '@/lib/types'

const supabase = createClient()

export async function getStays(type?: string) {
  try {
    let query = supabase
      .from('stays')
      .select('*, images:stay_images(*)')
      .order('display_order', { ascending: true })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching stays:', error);
      return [];
    }
    return (data as (Stay & { images: StayImage[] })[]) || [];
  } catch (err) {
    console.error('Fatal error in getStays:', err);
    return [];
  }
}

export async function getStayById(id: string) {
  try {
    const { data, error } = await supabase
      .from('stays')
      .select('*, images:stay_images(*)')
      .eq('id', id)
      .order('display_order', { referencedTable: 'stay_images', ascending: true })
      .single()

    if (error) {
      console.error(`Error fetching stay by ID ${id}:`, error);
      return null;
    }
    return data as Stay & { images: StayImage[] };
  } catch (err) {
    console.error(`Fatal error in getStayById for ${id}:`, err);
    return null;
  }
}

export async function deleteStay(id: string) {
  const { data: images } = await supabase
    .from('stay_images')
    .select('image_path')
    .eq('stay_id', id)

  if (images && images.length > 0) {
    await supabase.storage
      .from('stay-images')
      .remove(images.map((img: { image_path: string }) => img.image_path))
  }

  const { error } = await supabase
    .from('stays')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateStayField(id: string, field: string, value: unknown) {
  const { error } = await supabase
    .from('stays')
    .update({ [field]: value })
    .eq('id', id)

  if (error) throw error
}
