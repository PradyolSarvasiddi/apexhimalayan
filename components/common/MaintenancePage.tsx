'use client';
import React from 'react';
import { Settings, AlertCircle } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md w-full border border-orange/20 bg-dark-section p-12 rounded-3xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex justify-center mb-8 gap-4">
           <Settings className="text-orange animate-spin-slow" size={48} />
           <AlertCircle className="text-gold" size={48} />
        </div>
        
        <h1 className="headline text-3xl mb-6 tracking-tight">System Configuration Required</h1>
        
        <p className="subheadline text-secondary mb-10 text-balance">
          Base camp is currently offline. The navigation systems require environment variables to be set before we can depart.
        </p>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-sm font-mono text-left space-y-3">
          <p className="text-gold opacity-80 uppercase text-[10px] tracking-[0.2em] mb-2">Checklist:</p>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse"></div>
            <span>NEXT_PUBLIC_SUPABASE_URL</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse"></div>
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
          </div>
        </div>

        <p className="mt-12 label text-xs opacity-30 uppercase tracking-[0.3em]">
          Apex Himalayan Rides — Technical Ops
        </p>
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
