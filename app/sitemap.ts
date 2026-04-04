import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://apexhimalayanrides.com'
  const supabase = await createClient()

  // Fetch all tour slugs
  const { data: tours } = await supabase
    .from('tours')
    .select('slug, updated_at')
    .eq('is_available', true)

  // Fetch all stay slugs
  const { data: stays } = await supabase
    .from('stays')
    .select('slug, updated_at')
    .eq('is_available', true)

  const tourUrls = (tours || []).map((tour: any) => ({
    url: `${baseUrl}/rides/${tour.slug}`,
    lastModified: tour.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const stayUrls = (stays || []).map((stay: any) => ({
    url: `${baseUrl}/stays/${stay.slug}`,
    lastModified: stay.updated_at || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/rides`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stays`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...tourUrls, ...stayUrls]
}
