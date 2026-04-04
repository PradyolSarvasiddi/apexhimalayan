import { createClient } from '@/lib/supabase/server';
import type { Tour, TourImage } from '@/lib/types';
import FilterableRidesList from './FilterableRidesList';

export default async function RidesList() {
  const supabase = await createClient();
  
  const { data: toursData, error } = await supabase
    .from('tours')
    .select('*, images:tour_images(*)')
    .eq('is_available', true)
    .order('display_order', { ascending: true });

  if (error || !toursData) {
    console.error('Error fetching tours in RidesList:', error);
    return (
      <div className="py-24 text-center">
        <p className="subheadline text-secondary uppercase tracking-widest">
          Expeditions temporarily unavailable. Please check back later.
        </p>
      </div>
    );
  }

  const tours = toursData as (Tour & { images: TourImage[] })[];

  return <FilterableRidesList tours={tours} />;
}
