import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total guests
    const { count: totalGuests } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true });

    // Get all RSVPs
    const { data: rsvps } = await supabase
      .from('rsvps')
      .select('*');

    const totalResponses = rsvps?.length || 0;
    
    // Calculate attending count
    let attending = 0;
    let notAttending = 0;
    const mealCounts: { [key: string]: number } = {};

    rsvps?.forEach(rsvp => {
      const isAttending = Object.values(rsvp.attending || {}).some(Boolean);
      if (isAttending) {
        attending++;
        // Count meal choices
        Object.values(rsvp.meal_choices || {}).forEach((choice: any) => {
          if (choice) {
            mealCounts[choice] = (mealCounts[choice] || 0) + 1;
          }
        });
      } else {
        notAttending++;
      }
    });

    const pending = (totalGuests || 0) - totalResponses;

    return NextResponse.json({
      totalGuests: totalGuests || 0,
      totalResponses,
      attending,
      notAttending,
      pending,
      mealCounts,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      totalGuests: 0,
      totalResponses: 0,
      attending: 0,
      notAttending: 0,
      pending: 0,
      mealCounts: {},
    });
  }
}
