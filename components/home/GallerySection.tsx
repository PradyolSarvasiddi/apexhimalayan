import { createClient } from '@/lib/supabase/server';
import type { GalleryImage } from '@/lib/types';
import Link from 'next/link';
import FilterableGallery from './FilterableGallery';
import { FadeUp } from '@/components/ui/motion-wrappers';

export default async function GallerySection() {
  const supabase = await createClient();
  
  // Fetch gallery images from the 'gallery' table (synced with CMS)
  const { data: imagesData } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true });

  const galleryImages = imagesData as GalleryImage[] || [];

  return (
    <section id="gallery" className="section bg-cream-section">
      <div className="container">
        <FadeUp>
          <h2 className="headline text-center mb-12">Our Gallery</h2>
        </FadeUp>

        <FilterableGallery images={galleryImages} />

        <FadeUp className="text-center mt-12">
          <Link href="/contact" className="btn btn--ghost">Request Custom Photography Tour</Link>
        </FadeUp>
      </div>
    </section>
  );
}
