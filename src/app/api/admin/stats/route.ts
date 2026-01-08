import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total parties
    const { count: totalParties } = await supabase
      .from('parties')
      .select('*', { count: 'exact', head: true });

    // Get total guests (excluding plus-ones)
    const { count: totalNamedGuests } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('is_plus_one', false);

    // Get total plus-one slots
    const { count: totalPlusOneSlots } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('is_plus_one', true);

    // Get attending count
    const { count: totalAttending } = await supabase
      .from('guest_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('attending', true);

    // Get not attending count
    const { count: totalNotAttending } = await supabase
      .from('guest_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('attending', false);

    // Get all day attending
    const { data: allDayData } = await supabase
      .from('guests_with_rsvp')
      .select('*')
      .eq('attending', true)
      .eq('invited_to_ceremony', true);

    // Get evening only attending
    const { data: eveningData } = await supabase
      .from('guests_with_rsvp')
      .select('*')
      .eq('attending', true)
      .eq('invited_to_ceremony', false);

    // Get meal choice counts
    const { data: mealData } = await supabase
      .from('guest_rsvps')
      .select('meal_choice')
      .eq('attending', true)
      .not('meal_choice', 'is', null);

    const mealCounts: { [key: string]: number } = {};
    mealData?.forEach(r => {
      if (r.meal_choice) {
        mealCounts[r.meal_choice] = (mealCounts[r.meal_choice] || 0) + 1;
      }
    });

    // Calculate pending (guests without RSVP)
    const { count: totalGuests } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true });

    const { count: totalRsvps } = await supabase
      .from('guest_rsvps')
      .select('*', { count: 'exact', head: true });

    const totalPending = (totalGuests || 0) - (totalRsvps || 0);

    return NextResponse.json({
      totalParties: totalParties || 0,
      totalNamedGuests: totalNamedGuests || 0,
      totalPlusOneSlots: totalPlusOneSlots || 0,
      totalGuests: totalGuests || 0,
      totalAttending: totalAttending || 0,
      totalNotAttending: totalNotAttending || 0,
      totalPending,
      allDayAttending: allDayData?.length || 0,
      eveningOnlyAttending: eveningData?.length || 0,
      mealCounts,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      totalParties: 0,
      totalNamedGuests: 0,
      totalPlusOneSlots: 0,
      totalGuests: 0,
      totalAttending: 0,
      totalNotAttending: 0,
      totalPending: 0,
      allDayAttending: 0,
      eveningOnlyAttending: 0,
      mealCounts: {},
    });
  }
}

