'use client';
import React from 'react';
import Link from 'next/link';
import { Home, Compass, Map, Phone } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background visual - subtle mountains */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none w-full max-w-7xl blur-3xl z-[-1]">
        <div className="w-[800px] h-[400px] bg-orange/40 rounded-full blur-[120px] mx-auto"></div>
      </div>
      
      <div className="z-10 max-w-2xl px-6">
        <span className="hero__eyebrow text-orange mb-4 block">404 — YOU'VE REROUTED BEYOND THE MAP</span>
        <h1 className="headline text-5xl md:text-7xl mb-8 tracking-tighter">LOST ON THE TRAIL?</h1>
        
        <p className="subheadline text-secondary mb-12 text-lg">
          The ridge you're looking for doesn't exist in our current itinerary. 
          Let's get you back to the base camp or explore new routes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <Magnetic>
            <Link href="/" className="btn btn--primary flex items-center justify-center gap-3 py-5 w-full">
              <Home size={18} />
              Return to Base Camp
            </Link>
          </Magnetic>
          
          <Magnetic>
            <Link href="/rides" className="btn btn--ghost flex items-center justify-center gap-3 py-5 w-full">
              <Map size={18} />
              Explore Expeditions
            </Link>
          </Magnetic>
        </div>

        <div className="mt-16 pt-12 border-t border-border/30 flex flex-wrap justify-center gap-12 text-secondary opacity-60">
          <div className="flex items-center gap-3">
             <Compass size={20} className="text-orange" />
             <span className="label text-xs uppercase tracking-widest">Re-orienting...</span>
          </div>
          <Link href="/contact" className="hover:text-gold transition-colors flex items-center gap-3">
             <Phone size={20} className="text-orange" />
             <span className="label text-xs uppercase tracking-widest">Call Dispatch</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
