import { createClient } from '@/lib/supabase/server';
import type { Tour, TourImage } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import Magnetic from '@/components/ui/Magnetic';

export default async function PopularDestinations() {
  const supabase = await createClient();
  
  // Fetch popular destinations
  let { data: popularData, error } = await supabase
    .from('tours')
    .select('*, images:tour_images(*)')
    .eq('is_popular', true)
    .limit(10);

  let popularDestinations = (popularData as (Tour & { images: TourImage[] })[]) || [];

  // Fallback if no popular destinations are selected
  if (popularDestinations.length === 0 && !error) {
    const { data: fallbackData } = await supabase
      .from('tours')
      .select('*, images:tour_images(*)');
      
    if (fallbackData && fallbackData.length > 0) {
      const shuffled = [...fallbackData].sort(() => 0.5 - Math.random());
      popularDestinations = (shuffled.slice(0, 6) as (Tour & { images: TourImage[] })[]);
    }
  }

  if (popularDestinations.length === 0) {
    return <p className="text-secondary text-center py-12 w-full">More destinations coming soon!</p>;
  }

  return (
    <StaggerContainer className="horizontal-scroll" style={{ paddingLeft: '40px', paddingBottom: '40px' }}>
      {popularDestinations.map((tour, idx) => {
        const heroImage = tour.images?.find(i => i.is_hero) || tour.images?.[0];
        const imageUrl = heroImage?.image_url || `https://picsum.photos/seed/ride-${idx}/400/600`;
        const displayIndex = idx + 1;
        
        return (
          <StaggerItem key={tour.id} style={{ position: 'relative', minWidth: '350px' }}>
            <div className="popular-number">{displayIndex}</div>
            <div className="popular-destination-card">
              <Magnetic>
                <Link 
                  href={tour.slug ? `/rides/${tour.slug}` : `/rides`} 
                  className="card" 
                  style={{ width: '300px', display: 'block', overflow: 'hidden', borderRadius: '12px' }}
                >
                  <div className="card__image-wrapper" style={{ height: '450px', position: 'relative' }}>
                    <Image src={imageUrl} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 350px" style={{ objectFit: 'cover' }} className="card__image" />
                    <div className="hero__overlay" style={{ background: 'linear-gradient(to top, rgba(15,17,21,0.95), transparent 60%)' }}></div>
                    <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}>
                      <h3 className="headline" style={{ color: '#EAECEF', fontSize: '1.4rem', lineHeight: '1.2', marginBottom: '8px' }}>
                        {tour.title}
                      </h3>
                      <div className="label text-orange" style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
                        {tour.duration_days ? `${tour.duration_days} DAYS` : 'EXPLORE'} — VIEW DETAILS
                      </div>
                    </div>
                  </div>
                </Link>
              </Magnetic>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
