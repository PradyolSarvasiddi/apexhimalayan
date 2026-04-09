import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tour, TourImage } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { LightboxGallery } from '@/components/ui/LightboxGallery';
import { FadeUp } from '@/components/ui/motion-wrappers';
import { Metadata } from 'next';
import ContactButtons from '@/components/ui/ContactButtons';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: tour } = await supabase.from('tours').select('title, short_description').eq('slug', slug).single();

  if (!tour) return { title: 'Ride Detail' };

  return {
    title: `${tour.title}`,
    description: tour.short_description || `Join our ${tour.title} motorcycle expedition across the Himalayas.`,
    alternates: {
      canonical: `/rides/${slug}`,
    },
    openGraph: {
      title: `${tour.title} | Apex Himalayan Rides`,
      description: tour.short_description,
      type: 'article',
    }
  };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch tour by slug
  const { data: tourData } = await supabase
    .from('tours')
    .select('*, images:tour_images(*)')
    .eq('slug', slug)
    .single();

  if (!tourData) {
    notFound();
  }

  const tour = tourData as Tour & { images: TourImage[] };
  const heroImage = tour.images?.find(i => i.is_hero) || tour.images?.[0];
  const heroUrl = heroImage?.image_url || 'https://picsum.photos/seed/leh/1920/1080';

  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "Tour",
    "name": tour.title,
    "description": tour.short_description,
    "image": heroUrl,
    "tourDuration": `P${tour.duration_days}D`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": "0", // Price on request
      "availability": "https://schema.org/InStock"
    },
    "itinerary": tour.itinerary?.map((day: any) => ({
      "@type": "Day",
      "name": day.title,
      "description": day.description
    }))
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://apexhimalayanrides.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Rides",
        "item": "https://apexhimalayanrides.com/rides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tour.title,
        "item": `https://apexhimalayanrides.com/rides/${slug}`
      }
    ]
  };

  return (
    <main>
      <ErrorBoundary sectionName="Ride Details">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
        <section className="hero hero--short">
          <div className="hero__bg parallax-bg">
            <Image 
              src={heroUrl} 
              alt={tour.title} 
              fill 
              priority 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div className="hero__overlay"></div>
          <div className="hero__grain"></div>
          <div className="hero__content hero__content--centered">
            <h1 className="hero__title">{tour.title.toUpperCase()}</h1>
            <p className="label text-orange">Home / Rides / {tour.title}</p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
            
            <FadeUp>
              <Link href="/rides" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                <ArrowLeft className="w-4 h-4" /> Back to All Rides
              </Link>
            </FadeUp>

            <div className="main-content-wrapper grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
            
            <div className="main-content min-w-0">
              <div className="filter-tabs flex-nowrap overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ justifyContent: 'flex-start' }}>
                <a href="#overview" className="filter-tab">Overview</a>
                <a href="#itinerary" className="filter-tab">Itinerary</a>
                {tour.inclusions?.length > 0 && <a href="#inclusions" className="filter-tab">Inclusions</a>}
                {tour.images?.length > 0 && <a href="#gallery" className="filter-tab">Gallery</a>}
              </div>

              <FadeUp id="overview" className="mb-12" style={{ scrollMarginTop: '100px' }}>
                <h2 className="headline mb-4">About This Expedition</h2>
                {tour.description ? (
                  <div 
                    className="mb-8 tiptap" 
                    dangerouslySetInnerHTML={{ __html: tour.description }}
                  />
                ) : (
                  <p className="mb-8">{tour.short_description || "Information coming soon."}</p>
                )}
              </FadeUp>

              {tour.itinerary && tour.itinerary.length > 0 && (
                <FadeUp className="mb-12" id="itinerary" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="headline mb-8">Day-by-Day Itinerary</h2>
                  {tour.itinerary.map((day, idx) => (
                    <div className="accordion" key={idx}>
                      <div className="accordion__header">
                        <span>
                          <span className="text-orange" style={{ marginRight: '16px', border: '1px solid var(--color-accent-orange)', borderRadius: '50%', width: '30px', height: '30px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {day.day_number || idx + 1}
                          </span>
                          {day.title}
                        </span>
                        <span className="accordion__icon">▼</span>
                      </div>
                      <div className="accordion__content">
                        <div className="accordion__inner" dangerouslySetInnerHTML={{ __html: day.description }}>
                        </div>
                      </div>
                    </div>
                  ))}
                </FadeUp>
              )}

              {tour.inclusions && tour.inclusions.length > 0 && (
                <FadeUp className="mb-12" id="inclusions" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="headline mb-8">What's Included & Excluded</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="subheadline text-orange mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span> Inclusions
                      </h3>
                      <ul className="space-y-2">
                        {tour.inclusions.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-text-primary">
                            <span className="text-orange">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {tour.exclusions && tour.exclusions.length > 0 && (
                      <div>
                        <h3 className="subheadline text-muted mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-500"></span> Exclusions
                        </h3>
                        <ul className="space-y-2">
                          {tour.exclusions.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-text-secondary">
                              <span className="text-red-500">✕</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </FadeUp>
              )}
            </div>

            <div className="sidebar w-full lg:sticky lg:top-[100px] h-fit">
              <div className="card" style={{ padding: '32px' }}>
                <h3 className="headline mb-2">Price on Request</h3>
                <div className="mb-8" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="label">Duration</span>
                    <span className="subheadline">{tour.duration_days} Days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="label">Difficulty</span>
                    <span className={`subheadline ${tour.difficulty === 'hard' ? 'text-orange' : tour.difficulty === 'easy' ? 'text-green-500' : 'text-gold'}`}>
                      {tour.difficulty ? tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1) : 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="label">Group Size</span>
                    <span className="subheadline">Max {tour.group_size_max || 12}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="label">Season</span>
                    <span className="subheadline">{tour.best_season || 'All Year'}</span>
                  </div>
                </div>
                <ContactButtons phone="9816996799" waPhone="919816996799" />
              </div>
            </div>
            </div>
            
            {tour.images && tour.images.length > 0 && (
              <FadeUp id="gallery" className="mt-12 w-full pt-12" style={{ borderTop: '1px solid var(--color-border)', scrollMarginTop: '100px' }}>
                <LightboxGallery 
                  images={tour.images
                    .filter(img => !img.is_hero)
                    .map(img => ({ id: img.id, image_url: img.image_url, alt: `Gallery image for ${tour.title}` }))} 
                  title="Expedition Gallery" 
                />
              </FadeUp>
            )}
          </div>
        </section>
      </ErrorBoundary>
    </main>
  );
}
