import { createClient } from '@/lib/supabase/server';
import type { Stay, StayImage } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { Tent } from 'lucide-react';

export default async function FeaturedStays() {
  const supabase = await createClient();
  
  const { data: staysData, error } = await supabase
    .from('stays')
    .select('*, images:stay_images(*)')
    .eq('is_available', true)
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true })
    .limit(6);

  if (error || !staysData || staysData.length === 0) {
    return (
      <div className="py-20 text-center opacity-50 w-full">
        <Tent className="mx-auto mb-4 opacity-20" size={48} />
        <p className="subheadline">Stays temporarily unavailable</p>
      </div>
    );
  }

  const featuredStays = staysData as (Stay & { images: StayImage[] })[];

  return (
    <div className="rides-layout__grid">
      <StaggerContainer>
        <div className="horizontal-scroll">
          {featuredStays.map((stay) => {
            const heroImage = stay.images?.find(i => i.is_hero) || stay.images?.[0];
            const imageUrl = heroImage?.image_url || 'https://picsum.photos/seed/sarchu/800/600';
            
            return (
              <StaggerItem key={stay.id} className="card tour-card-v2">
                <div className="card__image-wrapper" style={{ position: 'relative' }}>
                  <Image src={imageUrl} alt={stay.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} className="card__image" />
                  <div className="card__badge-v2">{stay.location?.toUpperCase()}</div>
                </div>
                <div className="tour-card-v2__content">
                  <div className="tour-card-v2__top" style={{ justifyContent: 'center' }}>
                    <h3 className="card__title" style={{ textAlign: 'center' }}>{stay.name}</h3>
                  </div>
                  <p className="card__desc" style={{ textAlign: 'center' }}>{stay.short_description || stay.description}</p>
                  <div className="tour-card-v2__footer">
                    <Link href={`/stays/${stay.slug}`} className="view-link">
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
