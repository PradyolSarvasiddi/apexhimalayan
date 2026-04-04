import { createClient } from '@/lib/supabase/server';
import type { Stay, StayImage } from '@/lib/types';
import FilterableStaysList from './FilterableStaysList';

export default async function StaysList() {
  const supabase = await createClient();
  
  const { data: staysData, error } = await supabase
    .from('stays')
    .select('*, images:stay_images(*)')
    .eq('is_available', true)
    .order('display_order', { ascending: true });

  if (error || !staysData) {
    console.error('Error fetching stays in StaysList:', error);
    return (
      <div className="py-24 text-center">
        <p className="subheadline text-secondary uppercase tracking-widest">
          Stays temporarily unavailable. Please check back later.
        </p>
      </div>
    );
  }

  const stays = staysData as (Stay & { images: StayImage[] })[];

  return <FilterableStaysList stays={stays} />;
}
