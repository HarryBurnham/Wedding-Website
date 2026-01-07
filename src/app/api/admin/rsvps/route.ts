import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select(`
        *,
        parties (
          id,
          party_name
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    // Get all guests to map IDs to names
    const { data: guests } = await supabase
      .from('guests')
      .select('id, first_name, last_name, is_plus_one, party_id');

    const guestMap = new Map(
      guests?.map(g => [g.id, g]) || []
    );

    const formattedRsvps = rsvps?.map(rsvp => ({
      id: rsvp.id,
      party_id: rsvp.party_id,
      party_code: rsvp.parties ? String(rsvp.parties.id).padStart(3, '0') : null,
      party_name: rsvp.parties?.party_name || 'Unknown',
      attending: rsvp.attending || {},
      meal_choices: rsvp.meal_choices || {},
      dietary_restrictions: rsvp.dietary_restrictions || {},
      song_request: rsvp.song_request,
      recipe_text: rsvp.recipe_text,
      submitted_at: rsvp.submitted_at,
      // Map guest IDs to names for display
      guest_details: Object.keys(rsvp.attending || {}).map(guestId => {
        const guest = guestMap.get(parseInt(guestId));
        return {
          id: guestId,
          name: guest ? `${guest.first_name} ${guest.last_name}` : `Guest #${guestId}`,
          is_plus_one: guest?.is_plus_one || false,
          attending: rsvp.attending?.[guestId] || false,
          meal_choice: rsvp.meal_choices?.[guestId] || null,
          dietary_restriction: rsvp.dietary_restrictions?.[guestId] || null,
        };
      }),
    })) || [];

    return NextResponse.json({ rsvps: formattedRsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ rsvps: [] });
  }
}
