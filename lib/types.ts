export interface Tour {
  id: string
  title: string
  slug: string
  category: 'motorcycle' | 'trekking' | 'camping'
  description: string | null
  short_description: string | null
  duration_days: number | null
  difficulty: 'easy' | 'moderate' | 'hard' | null
  best_season: string | null
  group_size_min: number
  group_size_max: number
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  contact_info: string | null
  is_featured: boolean
  is_available: boolean
  is_limited_spots: boolean
  is_popular: boolean
  display_order: number
  created_at: string
  updated_at: string
  images?: TourImage[]
}

export interface TourImage {
  id: string
  tour_id: string
  image_url: string
  image_path: string
  is_hero: boolean
  display_order: number
  created_at?: string
}

export interface ItineraryDay {
  day_number: number
  title: string
  description: string
}

export interface Stay {
  id: string
  name: string
  slug: string
  location: string
  type: 'camping' | 'guesthouse' | 'hotel' | 'homestay'
  description: string | null
  short_description: string | null
  amenities: string[]
  contact_info: string | null
  is_featured: boolean
  is_available: boolean
  display_order: number
  created_at: string
  updated_at: string
  images?: StayImage[]
}

export interface StayImage {
  id: string
  stay_id: string
  image_url: string
  image_path: string
  is_hero: boolean
  display_order: number
  created_at?: string
}

export interface GalleryImage {
  id: string
  image_url: string
  image_path: string
  category: 'motorcycle' | 'trekking' | 'landscapes' | 'camps' | 'people'
  caption: string | null
  display_order: number
  created_at: string
}

export interface Testimonial {
  id: string
  customer_name: string
  location: string | null
  review_text: string
  rating: number
  tour_id: string | null
  tour?: Tour | null
  is_featured: boolean
  display_order: number
  created_at: string
}

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  tour_interested: string | null
  preferred_dates: string | null
  message: string | null
  is_read: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  updated_at?: string
}

export interface DashboardStats {
  totalTours: number
  availableTours: number
  totalStays: number
  unreadEnquiries: number
  galleryPhotos: number
}

export type TourCategory = Tour['category']
export type StayType = Stay['type']
export type GalleryCategory = GalleryImage['category']
export type Difficulty = NonNullable<Tour['difficulty']>
