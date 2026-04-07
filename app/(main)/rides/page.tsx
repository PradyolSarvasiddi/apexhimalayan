import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Tour, TourImage } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import FilterableRidesList from '@/components/rides/FilterableRidesList';
import { FadeUp } from '@/components/ui/motion-wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Himalayan Motorcycle Expeditions',
  description: 'Explore our handpicked motorcycle tours across the Himalayas. From Leh-Manali to Spiti Valley, discover the ultimate adventure.',
  alternates: {
    canonical: '/rides',
  },
}

import { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { TourCardSkeleton } from '@/components/ui/Skeleton';
import RidesList from '@/components/rides/RidesList';

export default async function RidesPage() {

  return (
    <main>
      <section className="hero hero--shorter">
        <div className="hero__bg parallax-bg">
          <Image 
            src="https://picsum.photos/seed/ridehero/1920/1080" 
            alt="Our Expeditions" 
            fill 
            priority 
            style={{ objectFit: 'cover' }} 
          />
        </div>
        <div className="hero__overlay"></div>
        <div className="hero__grain"></div>
        <div className="hero__content hero__content--centered">
          <h1 className="hero__title">OUR EXPEDITIONS</h1>
          <p className="label text-orange">Home / Rides</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeUp className="mb-8">
            <Link href="/" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </FadeUp>

          <ErrorBoundary sectionName="Expeditions List">
            <Suspense fallback={
              <div className="grid-3 min-h-[400px]">
                {[1, 2, 3, 4, 5, 6].map(i => <TourCardSkeleton key={i} />)}
              </div>
            }>
              <RidesList />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
    </main>
  );
}
