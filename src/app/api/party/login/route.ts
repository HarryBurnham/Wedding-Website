import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_name, password } = body;

    console.log('Trying login with:', {
      party_name: party_name.trim(),
      password,
    });

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
      .eq('party_name', party_name.trim())
      .eq('password', password)
      .single();

    console.log('Supabase party query result:', party, partyError);

    if (partyError || !party) {
      return NextResponse.json(
        { error: 'Invalid party name or password. Please check your details and try again.' },
        { status: 401 }
      );
    }

    // Get all guests in this party
    const { data: guests = [], error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .eq('party_id', party.id)
      .order('is_plus_one', { ascending: true })
      .order('id', { ascending: true });

    if (guestsError) {
      console.error('Error fetching guests:', guestsError);
      // Don't block login, just return empty array
    }

    // Get existing RSVPs for these guests (empty if no guests)
    const guestIds = (guests ?? []).map(g => g.id);
    const { data: existingRsvps = [] } = await supabase
      .from('guest_rsvps')
      .select('*')
      .in('guest_id', guestIds);

    // Get existing party extras (null if not exist)
    let partyExtras = null;
    try {
      const { data } = await supabase
        .from('party_extras')
        .select('*')
        .eq('party_id', party.id)
        .single();
      partyExtras = data;
    } catch {
      partyExtras = null;
    }

    // Format guests with individual invitation types
    const formattedGuests = guests?.map(guest => ({
      id: guest.id,
      firstName: guest.first_name,
      lastName: guest.last_name,
      isPlusOne: guest.is_plus_one,
      canBringPlusOne: guest.can_bring_plus_one,
      plusOneFor: guest.plus_one_for,
      invitedToCeremony: guest.invited_to_ceremony,
      invitedToReception: guest.invited_to_reception,
    }));

    // Format existing RSVPs as a map
    const rsvpMap: { [key: number]: any } = {};
    (existingRsvps ?? []).forEach(rsvp => {
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
        partyId: party.id,
        partyName: party.party_name,
      },
      guests: formattedGuests,
      existingRsvps: rsvpMap,
      partyExtras: partyExtras
        ? {
            songRequest: partyExtras.song_request,
            recipeTitle: partyExtras.recipe_title,
            recipeText: partyExtras.recipe_text,
          }
        : null,
    });
  } catch (error) {
    console.error('Error in party login:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}