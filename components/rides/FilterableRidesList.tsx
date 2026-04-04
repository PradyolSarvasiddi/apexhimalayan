'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tour, TourImage } from '@/lib/types';
import { FadeUp } from '@/components/ui/motion-wrappers';

interface FilterableRidesListProps {
  tours: (Tour & { images: TourImage[] })[];
}

export default function FilterableRidesList({ tours }: FilterableRidesListProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTours = activeFilter === 'all' 
    ? tours 
    : tours.filter(tour => tour.category === activeFilter);

  return (
    <>
      <FadeUp className="mb-0 md:mb-4">
        <div className="filter-tabs sticky top-[80px] md:top-[100px] z-20 bg-bg-primary/95 backdrop-blur-sm py-4 flex flex-nowrap overflow-x-auto gap-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center scrollbar-hide">
          <button 
            className={`filter-tab whitespace-nowrap px-6 py-2 rounded-full ${activeFilter === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab whitespace-nowrap px-6 py-2 rounded-full ${activeFilter === 'motorcycle' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('motorcycle')}
          >
            Motorcycle
          </button>
          <button 
            className={`filter-tab whitespace-nowrap px-6 py-2 rounded-full ${activeFilter === 'trekking' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('trekking')}
          >
            Trekking
          </button>
          <button 
            className={`filter-tab whitespace-nowrap px-6 py-2 rounded-full ${activeFilter === 'camping' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('camping')}
          >
            Camping
          </button>
        </div>
      </FadeUp>

      <div className="grid-3 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => {
              const heroImage = tour.images?.find(i => i.is_hero) || tour.images?.[0];
              const imageUrl = heroImage?.image_url || 'https://picsum.photos/seed/leh/600/400';
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  key={tour.id} 
                  className="card filter-item h-full flex flex-col"
                >
                  <div className="card__image-wrapper" style={{ position: 'relative' }}>
                    <Image src={imageUrl} alt={tour.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="card__image" style={{ objectFit: 'cover' }} />
                    {tour.is_limited_spots && <div className="card__badge">Limited Spots</div>}
                  </div>
                  <div className="card__content flex flex-col flex-1">
                    <h3 className="card__title">{tour.title}</h3>
                    <div className="card__meta">
                      <span className="label">{tour.duration_days} Days</span>
                      <span className={`label ${tour.difficulty === 'hard' ? 'text-orange' : tour.difficulty === 'easy' ? 'text-green-500' : 'text-gold'}`}>
                        {tour.difficulty ? tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1) : ''}
                      </span>
                    </div>
                    <p className="card__desc mt-8 flex-1">{tour.short_description}</p>
                    <div className="card__meta mt-auto pt-4 shadow-none border-t border-white/5">
                      <Link href={`/rides/${tour.slug}`} className="btn btn--ghost w-full text-center" style={{ padding: '8px 16px' }}>View Details</Link>
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
              <p className="subheadline text-secondary uppercase tracking-widest">No expeditions found in this category yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
