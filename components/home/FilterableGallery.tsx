'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/ui/motion-wrappers';
import type { GalleryImage } from '@/lib/types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FilterableGalleryProps {
  images: GalleryImage[];
}

export default function FilterableGallery({ images }: FilterableGalleryProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filteredImages = activeFilter === 'all' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  const openLightbox = (imgId: string) => {
    const idx = filteredImages.findIndex(img => img.id === imgId);
    if (idx !== -1) setSelectedIdx(idx);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % filteredImages.length);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <>
      <FadeUp className="filter-tabs" style={{ marginBottom: '48px', padding: '16px 0', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} 
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'motorcycle' ? 'active' : ''}`} 
          onClick={() => setActiveFilter('motorcycle')}
        >
          Motorcycle
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'trekking' ? 'active' : ''}`} 
          onClick={() => setActiveFilter('trekking')}
        >
          Trekking
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'landscapes' ? 'active' : ''}`} 
          onClick={() => setActiveFilter('landscapes')}
        >
          Landscapes
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'camps' ? 'active' : ''}`} 
          onClick={() => setActiveFilter('camps')}
        >
          Camps
        </button>
      </FadeUp>

      <div className="masonry-grid-container min-h-[500px]">
        <motion.div layout className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {filteredImages.length > 0 ? (
              filteredImages.map((img) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  key={img.id} 
                  className="masonry-item filter-item group cursor-pointer relative min-h-[300px]"
                  onClick={() => openLightbox(img.id)}
                >
                  <Image 
                    src={img.image_url} 
                    alt={img.caption || "Gallery image"} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="masonry-overlay">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center w-full">
                <p className="subheadline text-secondary uppercase tracking-widest">No photos found in this category yet.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox for Gallery */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedIdx(null)}
          >
            <button
              className="absolute top-8 right-8 z-[2010] bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/20 text-white transition-colors"
              onClick={() => setSelectedIdx(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {filteredImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[2010] bg-white/5 hover:bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/10 text-white transition-colors"
                  onClick={showPrev}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[2010] bg-white/5 hover:bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/10 text-white transition-colors"
                  onClick={showNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.div 
              key={selectedIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div 
                className="relative w-full" 
                style={{ height: '80vh', aspectRatio: '16/9' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image 
                  src={filteredImages[selectedIdx].image_url} 
                  alt={filteredImages[selectedIdx].caption || 'Large view'} 
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'contain', borderRadius: '8px' }}
                  className="shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="label text-white/60 tracking-[0.2em]">{selectedIdx + 1} / {filteredImages.length}</p>
                {filteredImages[selectedIdx].caption && (
                  <p className="label text-white mt-2 uppercase">{filteredImages[selectedIdx].caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
