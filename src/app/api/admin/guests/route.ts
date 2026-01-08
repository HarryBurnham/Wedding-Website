import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select(`
        *,
        parties (
          party_id,
          party_name,
          invited_to_ceremony
        ),
        guest_rsvps (*)
      `)
      .order('party_id', { ascending: true })
      .order('is_plus_one', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw error;

    const formattedGuests = guests?.map(guest => {
      const rsvp = guest.guest_rsvps?.[0];
      return {
        id: guest.id,
        partyId: guest.party_id,
        partyName: guest.parties?.party_name || 'Unknown',
        invitationType: guest.parties?.invited_to_ceremony ? 'All Day' : 'Evening Only',
        firstName: guest.first_name,
        lastName: guest.last_name,
        fullName: `${guest.first_name} ${guest.last_name}`,
        isPlusOne: guest.is_plus_one,
        canBringPlusOne: guest.can_bring_plus_one,
        plusOneFor: guest.plus_one_for,
        // RSVP info
        attending: rsvp?.attending ?? null,
        mealChoice: rsvp?.meal_choice || null,
        dietaryRequirements: rsvp?.dietary_requirements || null,
        plusOneFirstName: rsvp?.plus_one_first_name || null,
        plusOneLastName: rsvp?.plus_one_last_name || null,
        // Display name (uses plus-one name if provided)
        displayName: guest.is_plus_one && rsvp?.plus_one_first_name
          ? `${rsvp.plus_one_first_name} ${rsvp.plus_one_last_name || ''}`.trim()
          : `${guest.first_name} ${guest.last_name}`,
      };
    }) || [];

    return NextResponse.json({ guests: formattedGuests });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ guests: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_id, first_name, last_name, is_plus_one, can_bring_plus_one, plus_one_for } = body;

    if (!party_id || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Party ID, first name, and last name are required' },
        { status: 400 }
      );
    }

    const { data: guest, error } = await supabase
      .from('guests')
      .insert({
        party_id,
        first_name,
        last_name,
        is_plus_one: is_plus_one || false,
        can_bring_plus_one: can_bring_plus_one || false,
        plus_one_for: plus_one_for || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ guest });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}
