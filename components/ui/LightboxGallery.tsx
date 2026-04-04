'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaggerContainer } from './motion-wrappers';

interface LightboxGalleryProps {
  images: { id: string; image_url: string; alt?: string }[];
  title?: string;
  gridClassName?: string;
}

export function LightboxGallery({ images, title, gridClassName }: LightboxGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (index !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [index]);

  const showNext = () => {
    if (index === null) return;
    setIndex((index + 1) % images.length);
  };

  const showPrev = () => {
    if (index === null) return;
    setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full">
      {title && <h2 className="headline mb-12 text-center">{title}</h2>}
      
      <StaggerContainer className={cn("grid", gridClassName || "grid-2 gap-8")}>
        {images.map((img, idx) => (
          <motion.div 
            key={img.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -5 }}
            className="card group cursor-pointer overflow-hidden relative"
            style={{ borderRadius: '12px' }}
            onClick={() => setIndex(idx)}
          >
            <div className="card__image-wrapper" style={{ height: '500px', position: 'relative' }}>
              <Image 
                src={img.image_url} 
                alt={img.alt || `Gallery image ${idx + 1}`} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="transition-transform duration-700 group-hover:scale-110"
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </StaggerContainer>

      <AnimatePresence>
        {index !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setIndex(null)}
          >
            {/* Close Button / Back Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-8 right-8 z-[1010] bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/20 text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setIndex(null); }}
            >
              <div className="flex items-center gap-2">
                <span className="label text-[10px] font-bold uppercase tracking-widest hidden md:block">Close</span>
                <X className="w-6 h-6" />
              </div>
            </motion.button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[1010] bg-white/5 hover:bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/10 text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[1010] bg-white/5 hover:bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/10 text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div 
              className="relative"
              style={{ width: '90vw', maxWidth: '1200px', height: '85vh' }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Image 
                src={images[index].image_url} 
                alt={images[index].alt || 'Large view'} 
                fill
                sizes="100vw"
                style={{ objectFit: 'contain', borderRadius: '8px' }}
                className="shadow-2xl"
              />
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="label text-white/60 tracking-[0.2em]">{index + 1} / {images.length}</p>
                {images[index].alt && <p className="label text-white mt-2 uppercase">{images[index].alt}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
