import { createClient } from '@/lib/supabase/server';
import type { Tour, TourImage } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { Mountain } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';

export default async function FeaturedTours() {
  const supabase = await createClient();
  
  const { data: toursData, error } = await supabase
    .from('tours')
    .select('*, images:tour_images(*)')
    .eq('is_available', true)
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true })
    .limit(6);

  if (error || !toursData || toursData.length === 0) {
    return (
      <div className="py-20 text-center opacity-50">
        <Mountain className="mx-auto mb-4 opacity-20" size={48} />
        <p className="subheadline">Expeditions temporarily unavailable</p>
      </div>
    );
  }

  const featuredTours = toursData as (Tour & { images: TourImage[] })[];

  return (
    <div className="rides-layout__grid">
      <StaggerContainer>
        <div className="horizontal-scroll">
          {featuredTours.map((tour) => {
            const heroImage = tour.images?.find(i => i.is_hero) || tour.images?.[0];
            const imageUrl = heroImage?.image_url || 'https://picsum.photos/seed/leh/600/400';
            const difficulty = tour.difficulty?.toLowerCase() || 'moderate';
            
            return (
              <StaggerItem key={tour.id} className="card tour-card-v2">
                <div className="card__image-wrapper" style={{ position: 'relative' }}>
                  <Image src={imageUrl} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} className="card__image" />
                  <div className="card__badge-v2">{tour.duration_days} DAYS</div>
                </div>
                <div className="tour-card-v2__content">
                  <div className="tour-card-v2__top">
                    <h3 className="card__title">{tour.title}</h3>
                    <div className={`difficulty-badge ${difficulty}`}>
                      <span style={{ fontSize: '12px' }}>⛰</span> {difficulty.toUpperCase()}
                    </div>
                  </div>
                  <p className="card__desc">{tour.short_description}</p>
                  <div className="tour-card-v2__footer">
                    <Link href={`/rides/${tour.slug}`} className="view-link">
                      VIEW DETAILS →
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>
    </div>
  );
}
