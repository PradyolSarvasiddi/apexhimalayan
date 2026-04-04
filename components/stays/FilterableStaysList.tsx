'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Stay, StayImage } from '@/lib/types';
import { FadeUp } from '@/components/ui/motion-wrappers';

interface FilterableStaysListProps {
  stays: (Stay & { images: StayImage[] })[];
}

export default function FilterableStaysList({ stays }: FilterableStaysListProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredStays = activeFilter === 'all' 
    ? stays 
    : stays.filter(stay => stay.type === activeFilter);

  return (
    <>
      <FadeUp>
        <div className="filter-tabs" style={{ position: 'sticky', top: '100px', zIndex: 10, background: 'var(--color-bg-primary)', padding: '16px 0', display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px' }}>
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'camping' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('camping')}
          >
            Luxury Camps
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'hotel' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('hotel')}
          >
            Boutique Hotels
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'homestay' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('homestay')}
          >
            Heritage Stays
          </button>
        </div>
      </FadeUp>

      <div className="grid-3 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredStays.length > 0 ? (
            filteredStays.map((stay) => {
              const heroImage = stay.images?.find(i => i.is_hero) || stay.images?.[0];
              const imageUrl = heroImage?.image_url || 'https://picsum.photos/seed/sarchu/800/600';

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  key={stay.id} 
                  className="card filter-item h-full flex flex-col"
                >
                  <div className="card__image-wrapper" style={{ position: 'relative', height: '300px' }}>
                    <Image src={imageUrl} alt={stay.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="card__image" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card__content flex-1 flex flex-col">
                    <h3 className="card__title">{stay.name}</h3>
                    <div className="card__meta" style={{ padding: 0, marginTop: '8px', border: 'none' }}>
                      <span className="label text-gold">📍 {stay.location}</span>
                    </div>
                    <p className="card__desc mt-4">{stay.short_description || stay.description}</p>
                    
                    {stay.amenities && stay.amenities.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {stay.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="label" style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="card__meta mt-auto pt-4 flex gap-3 shadow-none border-t border-white/5">
                      <Link href={`/stays/${stay.slug}`} className="btn btn--primary flex-1 text-center" style={{ padding: '8px 16px' }}>View Details</Link>
                      {stay.contact_info && (
                        <a href={`tel:${stay.contact_info.replace(/[^0-9+]/g, '')}`} className="btn btn--ghost" style={{ padding: '8px' }} title="Call directly">
                          📞
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center"
            >
              <p className="subheadline text-secondary uppercase tracking-widest">No stays found in this category yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
