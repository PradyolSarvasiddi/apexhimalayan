import {
  LayoutDashboard,
  Map,
  Home,
  Image,
  MessageSquareQuote,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import type { TourCategory, StayType, GalleryCategory, Difficulty } from './types'

export const TOUR_CATEGORIES: { value: TourCategory; label: string }[] = [
  { value: 'motorcycle', label: 'Motorcycle Tour' },
  { value: 'trekking', label: 'Trekking' },
  { value: 'camping', label: 'Camping' },
]

export const STAY_TYPES: { value: StayType; label: string }[] = [
  { value: 'camping', label: 'Camping' },
  { value: 'guesthouse', label: 'Guesthouse' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'homestay', label: 'Homestay' },
]

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'trekking', label: 'Trekking' },
  { value: 'landscapes', label: 'Landscapes' },
  { value: 'camps', label: 'Camps' },
  { value: 'people', label: 'People' },
]

export const DIFFICULTY_LEVELS: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: '#4A7C4E' },
  { value: 'moderate', label: 'Moderate', color: '#C8860A' },
  { value: 'hard', label: 'Hard', color: '#B5451B' },
]

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_GALLERY_UPLOAD = 10
export const ITEMS_PER_PAGE = 20
export const TOAST_DURATION = 3000
export const DEBOUNCE_MS = 300

export interface NavItem {
  label: string
  href: string
  icon: any
  showBadge?: boolean
  external?: boolean
  isSignOut?: boolean
}

export const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'CONTENT',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Tours', href: '/admin/tours', icon: Map },
      { label: 'Stays', href: '/admin/stays', icon: Home },
      { label: 'Gallery', href: '/admin/gallery', icon: Image },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'View Website', href: '/', icon: ExternalLink, external: true },
      { label: 'Sign Out', href: '#signout', icon: LogOut, isSignOut: true },
    ],
  },
]

export const SETTING_KEYS = {
  WHATSAPP: 'whatsapp_number',
  EMAIL: 'email',
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook',
  ADDRESS: 'address',
  TAGLINE: 'tagline',
} as const
