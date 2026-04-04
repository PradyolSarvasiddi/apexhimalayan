-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
-- Note: Doing text fields with check constraints instead of enums for ease of modification

-- Tours
CREATE TABLE IF NOT EXISTS public.tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('motorcycle', 'trekking', 'camping')),
  description TEXT,
  short_description TEXT,
  duration_days INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard') OR difficulty IS NULL),
  best_season TEXT,
  group_size_min INTEGER DEFAULT 1,
  group_size_max INTEGER DEFAULT 20,
  itinerary JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  contact_info TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  is_limited_spots BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tour Images
CREATE TABLE IF NOT EXISTS public.tour_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  is_hero BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Stays
CREATE TABLE IF NOT EXISTS public.stays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('camping', 'guesthouse', 'hotel', 'homestay')),
  description TEXT,
  short_description TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  contact_info TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Stay Images
CREATE TABLE IF NOT EXISTS public.stay_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stay_id UUID NOT NULL REFERENCES public.stays(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  is_hero BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('motorcycle', 'trekking', 'landscapes', 'camps', 'people')),
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  location TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tour_interested TEXT,
  preferred_dates TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Note: Ensure that storage buckets 'tour-images' are created manually if not existing.

-- RLS Configuration
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to most tables
CREATE POLICY "Enable read access for all users" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.tour_images FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.stays FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.stay_images FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.site_settings FOR SELECT USING (true);

-- Allow public to INSERT enquiries (contact form)
CREATE POLICY "Enable insert access for all users" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Allow authenticated (admin) users to have FULL ACCESS
CREATE POLICY "Enable full access for authenticated users" ON public.tours FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable full access for authenticated users" ON public.tour_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable full access for authenticated users" ON public.stays FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable full access for authenticated users" ON public.stay_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable full access for authenticated users" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable full access for authenticated users" ON public.testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable full access for authenticated users" ON public.enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable full access for authenticated users" ON public.site_settings FOR ALL TO authenticated USING (true);
