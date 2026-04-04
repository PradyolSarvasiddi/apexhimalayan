import { createClient } from '@/lib/supabase/client'
import type { SiteSetting } from '@/lib/types'

const supabase = createClient()

export async function getSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key')

    if (error) {
      console.error('Error fetching settings:', error);
      return [];
    }
    return (data as SiteSetting[]) || [];
  } catch (err) {
    console.error('Fatal error in getSettings:', err);
    return [];
  }
}

export async function getSettingByKey(key: string) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single()

    if (error) {
      console.error(`Error fetching setting by key ${key}:`, error);
      return null;
    }
    return data as SiteSetting;
  } catch (err) {
    console.error(`Fatal error in getSettingByKey for ${key}:`, err);
    return null;
  }
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabase
    .from('site_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)

  if (error) throw error
}

export async function updateSettings(settings: Record<string, string>) {
  for (const [key, value] of Object.entries(settings)) {
    await updateSetting(key, value)
  }
}
