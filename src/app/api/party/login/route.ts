import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_name, password } = body;

    if (!party_name || !password) {
      return NextResponse.json(
        { error: 'Party name and password are required' },
        { status: 400 }
      );
    }

    // Look up party by name and password
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .ilike('party_name', party_name.trim())
      .eq('password', password)
      .single();

    if (partyError || !party) {
      return NextResponse.json(
        { error: 'Invalid party name or password. Please check your details and try again.' },
        { status: 401 }
      );
    }

    // Get all guests in this party
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .eq('party_id', party.party_id)
      .order('is_plus_one', { ascending: true })
      .order('id', { ascending: true });

    if (guestsError) {
      console.error('Error fetching guests:', guestsError);
      return NextResponse.json({ error: 'Failed to load guest details' }, { status: 500 });
    }

    // Safely handle empty guest list
    if (!guests || guests.length === 0) {
      return NextResponse.json({ error: 'No guests found for this party' }, { status: 404 });
    }

    // Get existing RSVPs for these guests
    const guestIds = guests?.map(g => g.id) || [];
    const { data: existingRsvps } = await supabase
      .from('guest_rsvps')
      .select('*')
      .in('guest_id', guestIds);

    // Get existing party extras
    const { data: partyExtras } = await supabase
      .from('party_extras')
      .select('*')
      .eq('party_id', party.party_id)
      .single();

    // Format guests
    const formattedGuests = guests?.map(guest => ({
      id: guest.id,
      firstName: guest.first_name,
      lastName: guest.last_name,
      isPlusOne: guest.is_plus_one,
      canBringPlusOne: guest.can_bring_plus_one,
      plusOneFor: guest.plus_one_for,
    })) || [];

    // Format existing RSVPs as a map
    const rsvpMap: { [key: number]: any } = {};
    existingRsvps?.forEach(rsvp => {
      rsvpMap[rsvp.guest_id] = {
        attending: rsvp.attending,
        mealChoice: rsvp.meal_choice,
        dietaryRequirements: rsvp.dietary_requirements,
        plusOneFirstName: rsvp.plus_one_first_name,
        plusOneLastName: rsvp.plus_one_last_name,
      };
    });

    return NextResponse.json({
      party: {
        partyId: party.party_id,
        partyName: party.party_name,
        invitedToCeremony: party.invited_to_ceremony,
        invitedToReception: party.invited_to_reception,
      },
      guests: formattedGuests,
      existingRsvps: rsvpMap,
      partyExtras: partyExtras ? {
        songRequest: partyExtras.song_request,
        recipeTitle: partyExtras.recipe_title,
        recipeText: partyExtras.recipe_text,
      } : null,
    });
  } catch (error) {
    console.error('Error in party login:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
