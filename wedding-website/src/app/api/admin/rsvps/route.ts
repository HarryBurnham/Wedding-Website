import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select(`
        *,
        guests (
          first_name,
          last_name,
          code
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    const formattedRsvps = rsvps?.map(rsvp => ({
      id: rsvp.id,
      guest_id: rsvp.guest_id,
      guest_name: rsvp.guests ? `${rsvp.guests.first_name} ${rsvp.guests.last_name}` : 'Unknown',
      guest_code: rsvp.guests?.code || '',
      attending: rsvp.attending || {},
      meal_choices: rsvp.meal_choices || {},
      dietary_restrictions: rsvp.dietary_restrictions || {},
      song_request: rsvp.song_request,
      submitted_at: rsvp.submitted_at,
    })) || [];

    return NextResponse.json({ rsvps: formattedRsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ rsvps: [] });
  }
}
