import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { FadeUp } from '@/components/ui/motion-wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Himalayan Expedition FAQ',
  description: 'Find answers to common questions about our motorcycle tours, trekking, and adventure trips in the Himalayas. Essential info for every rider.',
  alternates: {
    canonical: '/faq',
  },
}

export default function FaqPage() {
  return (
    <main>
      <section className="hero hero--shorter">
        <div className="hero__bg parallax-bg" style={{ position: 'relative' }}>
          <Image 
            src="https://picsum.photos/seed/faq/1920/1080" 
            alt="FAQ" 
            fill 
            priority 
            style={{ objectFit: 'cover' }} 
          />
        </div>
        <div className="hero__overlay"></div>
        <div className="hero__grain"></div>
        <div className="hero__content">
          <h1 className="hero__title">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="label text-orange">Home / FAQ</p>
        </div>
      </section>

      <section className="section bg-white-section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <FadeUp className="mb-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </FadeUp>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <FadeUp className="mb-8 md:mb-12">
            <label htmlFor="faq-search" className="sr-only">Search questions</label>
            <input 
              id="faq-search"
              type="text" 
              className="form-input w-full" 
              placeholder="Search questions..." 
              style={{ padding: '16px 20px', fontSize: 'clamp(1rem, 4vw, 1.125rem)', borderRadius: '8px' }} 
            />
          </FadeUp>

          <FadeUp>
            <div className="filter-tabs">
              <button className="filter-tab active">Before Booking</button>
              <button className="filter-tab">During Tour</button>
              <button className="filter-tab">Payments</button>
              <button className="filter-tab">Safety</button>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="accordion">
              <div className="accordion__header">
                <span>Do I need an international driving permit?</span>
                <span className="accordion__icon">▼</span>
              </div>
              <div className="accordion__content">
                <div className="accordion__inner">
                  Yes, if you are not an Indian citizen, you must have a valid International Driving Permit (IDP) along with your home country&#39;s motorcycle license to ride in India.
                </div>
              </div>
            </div>
            <div className="accordion">
              <div className="accordion__header">
                <span>What kind of motorcycles do you provide?</span>
                <span className="accordion__icon">▼</span>
              </div>
              <div className="accordion__content">
                <div className="accordion__inner">
                  We primarily use Royal Enfield Himalayan 411cc and the new 450cc models. They are purpose-built for the rugged terrains of the Himalayas and are meticulously maintained by our expert mechanics.
                </div>
              </div>
            </div>
            <div className="accordion">
              <div className="accordion__header">
                <span>Is riding gear provided?</span>
                <span className="accordion__icon">▼</span>
              </div>
              <div className="accordion__content">
                <div className="accordion__inner">
                  We highly recommend bringing your own well-fitted riding gear (helmet, jacket, pants, gloves, boots). However, we do rent out high-quality gear upon request, subject to availability.
                </div>
              </div>
            </div>
            <div className="accordion">
              <div className="accordion__header">
                <span>What happens in case of a breakdown?</span>
                <span className="accordion__icon">▼</span>
              </div>
              <div className="accordion__content">
                <div className="accordion__inner">
                  Every expedition is accompanied by a backup vehicle carrying a certified Royal Enfield mechanic and spare parts. In the rare event of an unfixable breakdown, a spare motorcycle is provided immediately.
                </div>
              </div>
            </div>
            <div className="accordion">
              <div className="accordion__header">
                <span>How do you handle altitude sickness?</span>
                <span className="accordion__icon">▼</span>
              </div>
              <div className="accordion__content">
                <div className="accordion__inner">
                  Our itineraries are designed with proper acclimatization days. Our road captains and backup vehicles carry portable oxygen cylinders and first-aid kits. If symptoms persist, we have protocols to transport riders to lower altitudes immediately.
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp className="text-center mt-12">
            <h3 className="headline mb-4">Still have questions?</h3>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">Chat on WhatsApp</a>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
