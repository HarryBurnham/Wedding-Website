import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total parties
    const { count: totalParties } = await supabase
      .from('parties')
      .select('*', { count: 'exact', head: true });

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
    let attendingGuests = 0;
    let notAttendingGuests = 0;
    const mealCounts: { [key: string]: number } = {};

    rsvps?.forEach(rsvp => {
      // Count attending guests
      Object.entries(rsvp.attending || {}).forEach(([guestId, isAttending]) => {
        if (isAttending) {
          attendingGuests++;
          // Count meal choices
          const mealChoice = rsvp.meal_choices?.[guestId];
          if (mealChoice) {
            mealCounts[mealChoice] = (mealCounts[mealChoice] || 0) + 1;
          }
        } else {
          notAttendingGuests++;
        }
      });
    });

    const pendingParties = (totalParties || 0) - totalResponses;

    return NextResponse.json({
      totalParties: totalParties || 0,
      totalGuests: totalGuests || 0,
      totalResponses,
      attendingGuests,
      notAttendingGuests,
      pendingParties,
      mealCounts,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      totalParties: 0,
      totalGuests: 0,
      totalResponses: 0,
      attendingGuests: 0,
      notAttendingGuests: 0,
      pendingParties: 0,
      mealCounts: {},
    });
  }
}
