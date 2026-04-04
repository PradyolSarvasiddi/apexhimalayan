import type { NextConfig } from "next";

import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      // Supabase storage (covers all project refs)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Placeholder images used as fallbacks in dev
      { protocol: 'https', hostname: 'picsum.photos' },
      // Testimonial avatars
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Wikimedia (world map SVG on testimonials page)
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default withBundleAnalyzer(nextConfig);
