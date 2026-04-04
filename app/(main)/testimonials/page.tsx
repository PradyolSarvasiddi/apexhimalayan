import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Testimonial } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { FadeUp, StaggerContainer, StaggerItem, Counter } from '@/components/ui/motion-wrappers';
import NextImage from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rider Testimonials & Reviews',
  description: 'Read real stories from riders who have journeyed with us across the Himalayas. Heartfelt reviews from our global community of adventure seekers.',
  alternates: {
    canonical: '/testimonials',
  },
}

import { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Skeleton } from '@/components/ui/Skeleton';
import TestimonialsList from '@/components/home/TestimonialsList';

export default async function TestimonialsPage() {

  return (
    <main>
      <section className="hero hero--shorter">
        <div className="hero__bg parallax-bg" style={{ position: 'relative' }}>
          <NextImage 
            src="https://picsum.photos/seed/testimonials/1920/1080" 
            alt="Testimonials" 
            fill 
            priority 
            style={{ objectFit: 'cover' }} 
          />
        </div>
        <div className="hero__overlay"></div>
        <div className="hero__grain"></div>
        <div className="hero__content">
          <h1 className="hero__title outline-text">REAL STORIES</h1>
          <p className="label text-orange">Home / Testimonials</p>
        </div>
      </section>

      <section className="section bg-white-section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <FadeUp className="mb-8">
            <Link href="/" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </FadeUp>
        </div>
      </section>

      <FadeUp className="stats-bar">
        <div className="stat-item" style={{ borderRight: 'none' }}>
          <Counter target={500} suffix="+" className="stat-item__num" />
          <div className="stat-item__label">Happy Riders</div>
        </div>
        <div className="stat-item" style={{ borderRight: 'none' }}>
          <Counter target={4.9} className="stat-item__num" />
          <div className="stat-item__label">Average Rating</div>
        </div>
        <div className="stat-item" style={{ borderRight: 'none' }}>
          <Counter target={200} suffix="+" className="stat-item__num" />
          <div className="stat-item__label">5-Star Reviews</div>
        </div>
      </FadeUp>

      <section className="section">
        <div className="container">
          <ErrorBoundary sectionName="Testimonials">
            <Suspense fallback={
              <div className="masonry-grid">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-64 w-full mb-6" />
                ))}
              </div>
            }>
              <TestimonialsList />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <section className="section section--dark text-center">
        <FadeUp className="container">
          <h2 className="headline mb-4">Our Riders Come From Everywhere</h2>
          <p className="subheadline mb-12">Join a global community of adventure seekers.</p>
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', opacity: 0.5, height: '400px' }}>
            <NextImage 
              src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
              alt="World Map" 
              fill
              style={{ filter: 'invert(1)', objectFit: 'contain' }} 
            />
            {/* Dots */}
            <div style={{ position: 'absolute', top: '30%', left: '20%', width: '10px', height: '10px', background: 'var(--color-accent-orange)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-accent-orange)' }}></div>
            <div style={{ position: 'absolute', top: '25%', left: '45%', width: '10px', height: '10px', background: 'var(--color-accent-orange)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-accent-orange)' }}></div>
            <div style={{ position: 'absolute', top: '40%', left: '70%', width: '10px', height: '10px', background: 'var(--color-accent-orange)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-accent-orange)' }}></div>
            <div style={{ position: 'absolute', top: '70%', left: '80%', width: '10px', height: '10px', background: 'var(--color-accent-orange)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-accent-orange)' }}></div>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}
