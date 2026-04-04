import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Stay, StayImage } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import FilterableStaysList from '@/components/stays/FilterableStaysList';
import { FadeUp } from '@/components/ui/motion-wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Stays & Alpine Camps',
  description: 'Discover our handpicked boutique hotels and luxury campsites across the Himalayas. Premium comfort in the heart of adventure.',
  alternates: {
    canonical: '/stays',
  },
}

import { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { StaySkeleton } from '@/components/ui/Skeleton';
import StaysList from '@/components/stays/StaysList';

export default async function StaysPage() {

  return (
    <main>
      <section className="hero hero--shorter">
        <div className="hero__bg parallax-bg">
          <Image 
            src="https://picsum.photos/seed/stayshero/1920/1080" 
            alt="Luxury Stays" 
            fill 
            priority 
            style={{ objectFit: 'cover' }} 
          />
        </div>
        <div className="hero__overlay"></div>
        <div className="hero__grain"></div>
        <div className="hero__content hero__content--centered">
          <h1 className="hero__title outline-text">LUXURY STAYS & CAMPS</h1>
          <p className="label text-orange">Home / Stays</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeUp className="mb-8">
            <Link href="/" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </FadeUp>

          <FadeUp className="mb-12 text-center" style={{ maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <h2 className="headline mb-4">REST IN EXTRAORDINARY PLACES</h2>
            <p>From premium high-altitude glamping to heritage boutique hotels, our handpicked stays ensure your comfort after a long day of riding.</p>
          </FadeUp>

          <ErrorBoundary sectionName="Stays List">
            <Suspense fallback={
              <div className="grid-3 min-h-[400px]">
                {[1, 2, 3, 4, 5, 6].map(i => <StaySkeleton key={i} />)}
              </div>
            }>
              <StaysList />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
    </main>
  );
}
