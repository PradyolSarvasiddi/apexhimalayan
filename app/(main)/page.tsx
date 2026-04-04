import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Tour, TourImage, Stay, StayImage } from '@/lib/types';
import AboutSection from '@/components/home/AboutSection';
import GallerySection from '@/components/home/GallerySection';
import ContactSection from '@/components/home/ContactSection';
import { TestimonialsSectionV2 } from '@/components/ui/testimonial-v2';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import Magnetic from '@/components/ui/Magnetic';
import StatsBar from '@/components/home/StatsBar';
import { Mountain, Tent, BriefcaseMedical } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apex Himalayan Rides — Ride Where Roads End',
  description: 'Premium adventure travel experiences in the Himalayas. Specialist motorcycle tours, high-altitude trekking, and luxury camping expeditions across Ladakh, Spiti, and beyond.',
  alternates: {
    canonical: '/',
  },
}

const MotorcycleIcon = ({ className }: { className?: string }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="5.5" cy="16" r="3.5"/>
    <circle cx="18.5" cy="16" r="3.5"/>
    <path d="M15 6h3.5"/>
    <path d="m12 17-3-7-3 4"/>
    <path d="m9 10h4.5l3 6"/>
    <path d="m15.5 10-2.5-4.5"/>
    <path d="m9 10-1-2"/>
  </svg>
);


import { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { TourCardSkeleton, StaySkeleton } from '@/components/ui/Skeleton';
import FeaturedTours from '@/components/home/FeaturedTours';
import FeaturedStays from '@/components/home/FeaturedStays';
import PopularDestinations from '@/components/home/PopularDestinations';

export default async function HomePage() {

  return (
    <main>
      <section className="hero">
        <video className="hero__video parallax-bg" autoPlay loop muted playsInline>
          <source src="/hero video/herovid.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay"></div>
        <div className="hero__grain"></div>
        <div className="hero__content">
          <FadeUp>
            <p className="hero__eyebrow">RIDE BEYOND ROADS</p>
          </FadeUp>
          <FadeUp>
            <h1 className="hero__title">
              Apex Himalayan Rides
            </h1>
          </FadeUp>
          <FadeUp>
            <p className="hero__subtitle">
              Premium motorcycle expeditions<br />
              across the Himalayas.
            </p>
          </FadeUp>
          <FadeUp>
            <div className="hero__actions">
              <Magnetic>
                <Link href="#rides" className="btn btn--primary">Explore Rides</Link>
              </Magnetic>
              <Magnetic>
                <Link href="#about" className="btn btn--ghost">
                  <span style={{ marginRight: '8px', opacity: 0.8 }}>▶</span>
                  Watch Our Story
                </Link>
              </Magnetic>
            </div>
          </FadeUp>

          <FadeUp>
            <StatsBar />
          </FadeUp>

          <FadeUp>
            <div className="features-bar">
              <div className="features-bar__grid">
                <div className="features-bar__item">
                  <Mountain size={28} className="features-bar__icon" />
                  <div className="features-bar__text">
                    <span className="features-bar__title">EXPERT</span>
                    <span className="features-bar__subtitle">ROAD CAPTAINS</span>
                  </div>
                </div>
                <div className="features-bar__item">
                  <MotorcycleIcon className="features-bar__icon" />
                  <div className="features-bar__text">
                    <span className="features-bar__title">WELL MAINTAINED</span>
                    <span className="features-bar__subtitle">BIKES</span>
                  </div>
                </div>
                <div className="features-bar__item">
                  <Tent size={28} className="features-bar__icon" />
                  <div className="features-bar__text">
                    <span className="features-bar__title">HANDPICKED</span>
                    <span className="features-bar__subtitle">STAYS</span>
                  </div>
                </div>
                <div className="features-bar__item">
                  <BriefcaseMedical size={28} className="features-bar__icon" />
                  <div className="features-bar__text">
                    <span className="features-bar__title">SAFETY & SUPPORT</span>
                    <span className="features-bar__subtitle">ALWAYS</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="section bg-white-section">
        <div className="container">
          <FadeUp>
            <h2 className="headline text-center mb-12">What We Offer</h2>
          </FadeUp>
          <StaggerContainer className="grid-4">
            <StaggerItem className="card">
              <div className="card__image-wrapper" style={{ position: 'relative' }}>
                <Image src="https://picsum.photos/seed/bike/600/400" alt="Specialist Himalayan Bike Expeditions and Motorcycle Tours" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} className="card__image" />
              </div>
              <div className="card__content">
                <h3 className="card__title">Bike Expeditions</h3>
                <p className="card__desc">Guided motorcycle tours through the most challenging and rewarding terrains.</p>
                <Link href="#rides" className="text-orange label">Explore →</Link>
              </div>
            </StaggerItem>
            <StaggerItem className="card">
              <div className="card__image-wrapper" style={{ position: 'relative' }}>
                <Image src="https://picsum.photos/seed/trek/600/400" alt="High Altitude Adventure Treks in the Himalayas" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} className="card__image" />
              </div>
              <div className="card__content">
                <h3 className="card__title">Adventure Treks</h3>
                <p className="card__desc">High altitude trekking experiences with expert local guides.</p>
                <Link href="#rides" className="text-orange label">Explore →</Link>
              </div>
            </StaggerItem>
            <StaggerItem className="card">
              <div className="card__image-wrapper" style={{ position: 'relative' }}>
                <Image src="https://picsum.photos/seed/luxury/600/400" alt="Luxury Stays and Premium Alpine Camps" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} className="card__image" />
              </div>
              <div className="card__content">
                <h3 className="card__title">Luxury Stays</h3>
                <p className="card__desc">Premium boutique accommodations and luxury camping setups.</p>
                <Link href="#stays" className="text-orange label">Explore →</Link>
              </div>
            </StaggerItem>
            <StaggerItem className="card">
              <div className="card__image-wrapper" style={{ position: 'relative' }}>
                <Image src="https://picsum.photos/seed/custom/600/400" alt="Tailor-made Custom Himalayan Travel Packages" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} className="card__image" />
              </div>
              <div className="card__content">
                <h3 className="card__title">Custom Packages</h3>
                <p className="card__desc">Tailor-made itineraries designed exclusively for your group.</p>
                <Link href="#contact" className="text-orange label">Explore →</Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <div className="combined-himalaya-bg">
        <Image 
          src="/background/p1.png" 
          alt="" 
          fill 
          priority 
          style={{ objectFit: 'cover', zIndex: -2, opacity: 0.4, position: 'absolute' }} 
        />
        <section id="rides" className="section section--dark bg-dark-section">
        <div className="container">
          <div className="rides-layout">
            {/* Left Column: Heading */}
            <div className="rides-layout__header">
              <FadeUp>
                <span className="hero__eyebrow" style={{ marginBottom: '12px', display: 'block' }}>OUR EXPEDITIONS</span>
                <h2 className="headline">Handpicked routes for every kind of rider</h2>
                <p className="desc">
                  From high mountain passes to remote valleys, choose an expedition that matches your spirit.
                </p>
                <Magnetic>
                  <Link href="/rides" className="view-link" style={{ marginTop: '16px' }}>Show All Rides →</Link>
                </Magnetic>
              </FadeUp>
            </div>

            {/* Right Column: Grid of Cards */}
            <ErrorBoundary sectionName="Featured Tours">
              <Suspense fallback={
                <div className="rides-layout__grid">
                  <div className="horizontal-scroll">
                    {[1, 2, 3].map(i => <TourCardSkeleton key={i} />)}
                  </div>
                </div>
              }>
                <FeaturedTours />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </section>

      <AboutSection />
    </div>

      <section id="stays" className="section section--dark bg-dark-section">
        <div className="container">
          <div className="rides-layout">
            {/* Left Column: Heading */}
            <div className="rides-layout__header">
              <FadeUp>
                <span className="hero__eyebrow" style={{ marginBottom: '12px', display: 'block' }}>LUXURY STAYS & CAMPS</span>
                <h2 className="headline">Rest in extraordinary places</h2>
                <p className="desc">
                  Curated premium accommodations in the most remote corners of the Himalayas.
                </p>
                <Magnetic>
                  <Link href="/stays" className="view-link" style={{ marginTop: '16px' }}>Show All Stays →</Link>
                </Magnetic>
              </FadeUp>
            </div>

            {/* Right Column: Grid of Cards */}
            <ErrorBoundary sectionName="Featured Stays">
              <Suspense fallback={
                <div className="rides-layout__grid">
                  <div className="horizontal-scroll">
                    {[1, 2, 3].map(i => <StaySkeleton key={i} />)}
                  </div>
                </div>
              }>
                <FeaturedStays />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </section>

      <div className="combined-himalaya-bg-2">
        <Image 
          src="/background/b2.png" 
          alt="" 
          fill 
          style={{ objectFit: 'cover', zIndex: -2, opacity: 0.4, position: 'absolute' }} 
        />
        <section className="section bg-cream-section">
        <div className="container split-layout">
          <FadeUp>
            <h2 className="headline mb-8">BUILT FOR RIDERS.<br />DESIGNED FOR EXPLORERS.</h2>
            <p className="mb-8">We don't just organize tours; we craft life-changing experiences. Our deep knowledge of the Himalayas ensures you get the most authentic, safe, and thrilling adventure possible.</p>
          </FadeUp>
          <StaggerContainer className="grid-2">
            <StaggerItem>
              <h4 className="subheadline mb-2 text-orange">✓ Trusted Local Network</h4>
              <p className="label">Deep connections with locals for authentic experiences and emergency support.</p>
            </StaggerItem>
            <StaggerItem>
              <h4 className="subheadline mb-2 text-orange">✓ Handpicked Routes</h4>
              <p className="label">We ride the roads less traveled, avoiding tourist traps.</p>
            </StaggerItem>
            <StaggerItem>
              <h4 className="subheadline mb-2 text-orange">✓ Expert Guides</h4>
              <p className="label">Certified mechanics and medical first responders on every ride.</p>
            </StaggerItem>
            <StaggerItem>
              <h4 className="subheadline mb-2 text-orange">✓ End-to-End Planning</h4>
              <p className="label">From permits to premium stays, we handle all the logistics.</p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

        <TestimonialsSectionV2 />
      </div>

      <div className="combined-himalaya-bg-3">
        <Image 
          src="/background/b3.png" 
          alt="" 
          fill 
          style={{ objectFit: 'cover', zIndex: -2, opacity: 0.4, position: 'absolute' }} 
        />
        <section id="popular" className="section section--dark bg-dark-section">
          <div className="container">
            <FadeUp>
              <h2 className="headline mb-8">Popular Destinations</h2>
            </FadeUp>
            <ErrorBoundary sectionName="Popular Destinations">
              <Suspense fallback={
                <div className="horizontal-scroll" style={{ paddingLeft: '40px', paddingBottom: '40px' }}>
                  {[1, 2, 3, 4].map(i => <TourCardSkeleton key={i} />)}
                </div>
              }>
                <PopularDestinations />
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>

        <GallerySection />
      </div>

      <div className="combined-himalaya-bg-4">
        <ContactSection />
      </div>
    </main>
  );
}
