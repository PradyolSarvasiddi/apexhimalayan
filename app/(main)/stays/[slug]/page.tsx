import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Stay, StayImage } from '@/lib/types';
import { MapPin, Phone, Check, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { LightboxGallery } from '@/components/ui/LightboxGallery';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: stay } = await supabase.from('stays').select('name, short_description').eq('slug', slug).single();

  if (!stay) return { title: 'Stay Detail' };

  return {
    title: `${stay.name}`,
    description: stay.short_description || `Experience the comfort of ${stay.name} in the Himalayas.`,
    alternates: {
      canonical: `/stays/${slug}`,
    },
    openGraph: {
      title: `${stay.name} | Apex Himalayan Rides`,
      description: stay.short_description,
      type: 'article',
    }
  };
}

export default async function StayDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch stay by slug
  const { data: stayData } = await supabase
    .from('stays')
    .select('*, images:stay_images(*)')
    .eq('slug', slug)
    .single();

  if (!stayData) {
    notFound();
  }

  const stay = stayData as Stay & { images: StayImage[] };
  
  // Prepare images
  const heroImage = stay.images?.find(i => i.is_hero) || stay.images?.[0];
  const heroUrl = heroImage?.image_url || 'https://picsum.photos/seed/sarchu/1920/1080';
  
  // Filter out the hero image for gallery display, or display all if no hero
  const galleryImages = stay.images?.filter(i => i.id !== heroImage?.id) || [];

  const accommodationSchema = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": stay.name,
    "description": stay.short_description,
    "image": heroUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": stay.location,
      "addressRegion": "Himachal Pradesh",
      "addressCountry": "IN"
    },
    "amenityFeature": stay.amenities?.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
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
        "name": "Stays",
        "item": "https://apexhimalayanrides.com/stays"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": stay.name,
        "item": `https://apexhimalayanrides.com/stays/${slug}`
      }
    ]
  };
  // if we have no gallery images but we do have the hero image, we might not show a gallery at all.
  // but if we have multiple images, they will automatically be displayed!

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(accommodationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <section className="hero hero--short">
        <div className="hero__bg parallax-bg" style={{ position: 'relative' }}>
          <Image 
            src={heroUrl} 
            alt={stay.name} 
            fill 
            priority 
            style={{ objectFit: 'cover' }} 
          />
        </div>
        <div className="hero__overlay"></div>
        <div className="hero__grain"></div>
        <div className="hero__content">
          <h1 className="hero__title">{stay.name.toUpperCase()}</h1>
          <p className="label text-orange">Home / Stays / {stay.name}</p>
        </div>
      </section>

      <section className="section bg-white-section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
          
          <FadeUp className="mb-4">
            <Link href="/stays" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <ArrowLeft className="w-4 h-4" /> Back to All Stays
            </Link>
          </FadeUp>

          <div className="main-content-wrapper grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
            <div className="left-side min-w-0">
              <FadeUp className="mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <MapPin className="text-accent-orange w-6 h-6" />
                  <span className="subheadline text-primary m-0 p-0 line-clamp-none">{stay.location}</span>
                </div>
                
                <h2 className="headline mb-4">About This Stay</h2>
                {stay.description ? (
                  <div 
                    className="mb-8 tiptap" 
                    dangerouslySetInnerHTML={{ __html: stay.description }}
                  />
                ) : (
                  <p className="mb-8 text-secondary">{stay.short_description || "Information coming soon."}</p>
                )}
              </FadeUp>

              {stay.amenities && stay.amenities.length > 0 && (
                <div className="mb-12">
                  <FadeUp>
                    <h2 className="headline mb-8">Amenities</h2>
                  </FadeUp>
                  <StaggerContainer className="grid-2">
                    {stay.amenities.map((amenity, idx) => (
                      <StaggerItem key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--color-bg-elevated)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <Check className="text-secondary w-5 h-5 flex-shrink-0" />
                        <span className="label text-primary">{amenity}</span>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}
            </div>

            <div className="sidebar w-full lg:sticky lg:top-[100px] h-fit">
              <div className="card" style={{ padding: '32px' }}>
                <h3 className="headline mb-2">Reserve Your Stay</h3>
                <p className="text-secondary mb-8">Get in touch with our team to confirm availability and exact pricing for your dates.</p>
                
                <div className="mb-8" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="label">Location</span>
                    <span className="subheadline text-right" style={{ maxWidth: '60%' }}>{stay.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="label">Type</span>
                    <span className="subheadline text-orange">
                      {stay.type.charAt(0).toUpperCase() + stay.type.slice(1)}
                    </span>
                  </div>
                </div>
                
                <Link href={`/contact?subject=Enquiry for ${stay.name}`} className="btn btn--primary btn--full mb-4 text-center">Enquire Now</Link>
                {stay.contact_info && (
                   <a href={`tel:${stay.contact_info.replace(/[^0-9+]/g, '')}`} className="btn btn--ghost btn--full text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                     <Phone className="w-4 h-4" /> Call Property
                   </a>
                )}
              </div>
            </div>
          </div>
          
          {galleryImages && galleryImages.length > 0 && (
            <FadeUp className="mt-12 w-full pt-12" style={{ borderTop: '1px solid var(--color-border)' }}>
              <LightboxGallery images={galleryImages.map(img => ({ id: img.id, image_url: img.image_url, alt: `Gallery image for ${stay.name}` }))} title="Property Gallery" />
            </FadeUp>
          )}

        </div>
      </section>
    </main>
  );
}
