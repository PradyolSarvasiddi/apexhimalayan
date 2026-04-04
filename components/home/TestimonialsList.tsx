import { createClient } from '@/lib/supabase/server';
import type { Testimonial } from '@/lib/types';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import NextImage from 'next/image';

export default async function TestimonialsList() {
  const supabase = await createClient();
  
  const { data: testimonialsData, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  const testimonials = (testimonialsData as Testimonial[]) || [];

  if (testimonials.length === 0) {
    return (
      <div className="card stagger-item" style={{ borderLeft: '4px solid var(--color-accent-orange)', marginBottom: '24px' }}>
        <div className="card__content">
          <div className="text-gold mb-4" style={{ fontSize: '1.5rem' }}>★★★★★</div>
          <p className="mb-4" style={{ fontStyle: 'italic' }}>&quot;The Ladakh circuit was the most challenging and rewarding experience of my life. The Apex team handled everything perfectly.&quot;</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <NextImage 
              src="https://picsum.photos/seed/u1/50/50" 
              alt="User" 
              width={50} 
              height={50} 
              style={{ borderRadius: '50%' }} 
            />
            <div>
              <h4 className="subheadline">James Peterson</h4>
              <p className="label">London, UK</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StaggerContainer className="masonry-grid">
      {testimonials.map((review) => (
        <StaggerItem key={review.id} className="card" style={{ borderLeft: '4px solid var(--color-accent-orange)', marginBottom: '24px' }}>
          <div className="card__content">
            <div className="text-gold mb-4" style={{ fontSize: '1.5rem' }}>
              {'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}
            </div>
            <p className="mb-4" style={{ fontStyle: 'italic' }}>&quot;{review.review_text}&quot;</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <NextImage 
                src={`https://picsum.photos/seed/${review.id}/50/50`} 
                alt={review.customer_name} 
                width={50} 
                height={50} 
                style={{ borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div>
                <h3 className="subheadline" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{review.customer_name}</h3>
                <p className="label">{review.location || 'Adventure Rider'}</p>
              </div>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
