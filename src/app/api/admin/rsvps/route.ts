import { NextResponse } from 'next/server';
// import { createAdminClient } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // const supabase = createAdminClient();

    // Get all parties
    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select('*')
      .order('id', { ascending: true });

    console.log('Parties count:', parties?.length, 'Error:', partiesError);

    if (partiesError) throw partiesError;

    // Get all guests
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .order('id', { ascending: true });

    if (guestsError) throw guestsError;

    // Get all RSVPs
    const { data: rsvps, error: rsvpsError } = await supabase
      .from('guest_rsvps')
      .select('*');

    if (rsvpsError) throw rsvpsError;

    // Get all party extras
    const { data: extras, error: extrasError } = await supabase
      .from('party_extras')
      .select('*');

    if (extrasError) throw extrasError;

    // Create lookup maps
    const rsvpsByGuestId: { [key: number]: any } = {};
    (rsvps || []).forEach(rsvp => {
      rsvpsByGuestId[rsvp.guest_id] = rsvp;
    });

    const extrasByPartyId: { [key: number]: any } = {};
    (extras || []).forEach(extra => {
      extrasByPartyId[extra.party_id] = extra;
    });

    // Group guests by party
    const guestsByPartyId: { [key: number]: any[] } = {};
    (guests || []).forEach(guest => {
      if (!guestsByPartyId[guest.party_id]) {
        guestsByPartyId[guest.party_id] = [];
      }
      guestsByPartyId[guest.party_id].push(guest);
    });

    // Format the response
    const formattedRsvps = (parties || []).map(party => {
      const partyGuests = guestsByPartyId[party.id] || [];
      const partyExtras = extrasByPartyId[party.id];

      // Check if any guest has responded
      const hasResponded = partyGuests.some(g => rsvpsByGuestId[g.id] !== undefined);

      // Format guest details
      const guestDetails = partyGuests.map(guest => {
        const rsvp = rsvpsByGuestId[guest.id];

        return {
          id: guest.id,
          firstName: guest.first_name,
          lastName: guest.last_name,
          isPlusOne: guest.is_plus_one,
          canBringPlusOne: guest.can_bring_plus_one,
          plusOneFor: guest.plus_one_for,
          invitedToCeremony: guest.invited_to_ceremony,
          invitedToReception: guest.invited_to_reception,
          // RSVP data
          attending: rsvp?.attending ?? null,
          mealChoice: rsvp?.meal_choice || null,
          dietaryRequirements: rsvp?.dietary_requirements || null,
          plusOneFirstName: rsvp?.plus_one_first_name || null,
          plusOneLastName: rsvp?.plus_one_last_name || null,
          // Display name
          displayName: guest.is_plus_one && rsvp?.plus_one_first_name
            ? `${rsvp.plus_one_first_name} ${rsvp.plus_one_last_name || ''}`.trim()
            : `${guest.first_name} ${guest.last_name}`,
          submittedAt: rsvp?.submitted_at || null,
        };
      });

      // Count attending/not attending/pending
      const attendingCount = guestDetails.filter(g => g.attending === true).length;
      const notAttendingCount = guestDetails.filter(g => g.attending === false).length;
      const pendingCount = guestDetails.filter(g => g.attending === null).length;

      // Determine party invitation type based on guests (for display purposes)
      const hasAllDayGuests = partyGuests.some(g => g.invited_to_ceremony);
      const hasEveningGuests = partyGuests.some(g => !g.invited_to_ceremony);

      return {
        partyId: party.id,
        partyName: party.party_name,
        invitationType: hasAllDayGuests && hasEveningGuests 
          ? 'Mixed' 
          : hasAllDayGuests 
            ? 'All Day' 
            : 'Evening Only',
        hasAllDayGuests,
        hasEveningGuests,
        hasResponded,
        attendingCount,
        notAttendingCount,
        pendingCount,
        guests: guestDetails,
        songRequest: partyExtras?.song_request || null,
        recipeTitle: partyExtras?.recipe_title || null,
        recipeText: partyExtras?.recipe_text || null,
      };
    });

    return NextResponse.json({ rsvps: formattedRsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ rsvps: [], error: String(error) }, { status: 500 });
  }
}