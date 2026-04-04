'use client';
import React from 'react';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-black text-white p-12 flex flex-col items-center justify-center min-h-screen text-center font-sans">
        <h1 className="text-6xl font-serif text-orange mb-8 tracking-tighter">System Malfunction</h1>
        <p className="max-w-xl text-lg opacity-60 mb-12 leading-relaxed">
          The core navigation system has failed. This is a root-level event. 
          Return to safety or attempt a hard reboot.
        </p>
        <div className="space-y-4">
           <button
             onClick={() => reset()}
             className="px-8 py-4 bg-orange text-black font-bold uppercase tracking-widest rounded-lg hover:bg-gold transition-colors"
           >
             Hard Reboot
           </button>
           <div className="block mt-4 text-xs opacity-20 font-mono">
             Error: {error.message || 'Severe crash'}
           </div>
        </div>
      </body>
    </html>
  );
}
