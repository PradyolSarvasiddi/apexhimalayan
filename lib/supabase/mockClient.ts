import toursData from '../../toursData.json'
import type { Tour, Stay } from '../types'

function normaliseTourCategory(raw: string) {
  const s = (raw || '').toLowerCase()
  if (s.includes('motorcycle') || s.includes('bike') || s.includes('ride')) return 'motorcycle'
  if (s.includes('trek'))  return 'trekking'
  if (s.includes('camp') || s.includes('safari')) return 'camping'
  return 'motorcycle'
}

function normaliseDifficulty(raw: string) {
  const s = (raw || '').toLowerCase()
  if (s === 'easy') return 'easy'
  if (s === 'hard' || s === 'difficult') return 'hard'
  return 'moderate'
}

function parseDurationDays(raw: string) {
  if (!raw) return null
  const match = String(raw).match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

function normaliseStayType(raw: string) {
  const s = (raw || '').toLowerCase()
  if (s === 'camping' || s === 'guesthouse' || s === 'hotel' || s === 'homestay') return s
  return 'hotel'
}

const mappedTours: Tour[] = (toursData.tours || []).map((t: any, i: number) => ({
  id: t.slug,
  title: t.title,
  slug: t.slug,
  category: normaliseTourCategory(t.category) as any,
  description: t.full_description || null,
  short_description: t.short_description || null,
  duration_days: parseDurationDays(t.trip_details?.duration),
  difficulty: normaliseDifficulty(t.trip_details?.difficulty) as any,
  best_season: t.trip_details?.best_season || null,
  group_size_min: t.trip_details?.min_group_size ?? 1,
  group_size_max: t.trip_details?.max_group_size ?? 12,
  itinerary: (t.itinerary || []).map((item: any) => ({
    day_number: item.day,
    title: item.title || '',
    description: item.description || '',
  })),
  inclusions: t.inclusions_exclusions?.included || [],
  exclusions: t.inclusions_exclusions?.not_included || [],
  contact_info: t.contact_info || null,
  is_featured: t.status?.featured ?? false,
  is_available: t.status?.available ?? true,
  is_limited_spots: false,
  is_popular: t.status?.popular ?? false,
  display_order: i,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  images: []
}))

const mappedStays: Stay[] = (toursData.stays || []).map((s: any, i: number) => ({
  id: s.slug,
  name: s.name,
  slug: s.slug,
  location: s.location || '',
  type: normaliseStayType(s.type) as any,
  description: s.full_description || null,
  short_description: s.short_description || null,
  amenities: s.amenities || [],
  contact_info: s.contact_info || null,
  is_featured: s.status?.featured ?? false,
  is_available: s.status?.available ?? true,
  display_order: i,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  images: []
}))

export function createMockSupabaseClient() {
  const mockData: Record<string, any[]> = {
    tours: mappedTours,
    stays: mappedStays,
    testimonials: [
      {
        id: '1',
        customer_name: 'John Doe',
        location: 'California, USA',
        review_text: 'An absolutely incredible experience riding through the Himalayas. The captains were professional and the support was top-notch.',
        rating: 5,
        tour_id: null,
        is_featured: true,
        display_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        customer_name: 'Sarah Jenkins',
        location: 'London, UK',
        review_text: 'The stays were beautiful and the route selection was perfect. Highly recommend Apex Himalayan Rides!',
        rating: 5,
        tour_id: null,
        is_featured: true,
        display_order: 2,
        created_at: new Date().toISOString()
      }
    ],
    site_settings: [],
    gallery: [],
    enquiries: [],
  }

  const builder = (table: string, filters: any[] = []) => {
    const chain: any = {
      select: () => chain,
      eq: () => chain,
      order: () => chain,
      limit: (n: number) => {
        filters.push({ type: 'limit', value: n })
        return chain
      },
      single: () => {
        filters.push({ type: 'single' })
        return chain
      },
      insert: (val: any) => {
        const arr = mockData[table] || []
        const newObj = { id: Math.random().toString(), ...val, created_at: new Date().toISOString() }
        arr.push(newObj)
        filters.push({ type: 'insert_result', value: newObj })
        return chain
      },
      update: () => chain,
      delete: () => chain,
      
      then: (onfulfilled: any) => {
        let result = mockData[table] || []
        
        const eqFilters = filters.filter(f => f.type === 'eq')
        for (const f of eqFilters) {
          result = result.filter(item => {
            return String(item[f.field]) === String(f.value)
          })
        }
        
        const limitFilter = filters.find(f => f.type === 'limit')
        if (limitFilter) {
          result = result.slice(0, limitFilter.value)
        }

        const isSingle = filters.some(f => f.type === 'single')
        let finalData: any = result
        if (isSingle) {
          finalData = result[0] || null
        }

        const insertFilter = filters.find(f => f.type === 'insert_result')
        if (insertFilter) {
          finalData = insertFilter.value
        }

        return Promise.resolve(onfulfilled({ data: finalData, error: null }))
      }
    }

    return new Proxy(chain, {
      get: (target, prop) => {
        if (prop === 'eq') {
          return (field: string, value: any) => {
            filters.push({ type: 'eq', field, value })
            return target
          }
        }
        if (prop in target) {
          return target[prop]
        }
        return () => target
      }
    })
  }

  return {
    from: (table: string) => builder(table),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: { email: 'admin@test.com' } }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        remove: () => Promise.resolve({ data: [], error: null }),
        upload: () => Promise.resolve({ data: {}, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
      })
    }
  }
}
