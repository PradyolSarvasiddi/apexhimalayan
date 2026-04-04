'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 z-[-1] opacity-50 grainy-bg"></div>
      <div className="max-w-xl w-full bg-dark-section border border-border p-12 rounded-2xl shadow-2xl relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 p-4 bg-orange/20 rounded-full border border-orange/30">
          <AlertTriangle className="text-orange w-12 h-12" />
        </div>
        
        <h1 className="headline text-4xl mb-6 mt-4">Expedition Halted</h1>
        <p className="subheadline mb-10 text-secondary">
          We've encountered an unexpected rough patch on the digital trail. The server responded with: 
          <span className="block mt-2 font-mono text-xs opacity-50 bg-white/5 py-1 px-2 rounded">
            {error.message || "Unknown error occurred"}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn btn--primary flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          <Link href="/" className="btn btn--ghost flex items-center justify-center gap-2">
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </div>
      
      <p className="mt-12 label text-secondary opacity-40">
        If the problem persists, please contact our support team.
      </p>
    </div>
  );
}
