import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all parties with their guests and RSVPs
    const { data: parties, error } = await supabase
      .from('parties')
      .select(`
        *,
        guests (
          *,
          guest_rsvps (*)
        ),
        party_extras (*)
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Raw parties data:', JSON.stringify(parties, null, 2));

    const formattedRsvps = parties?.map(party => {
      const guests = party.guests || [];
      const extras = party.party_extras?.[0];

      // Check if any guest has responded
      const hasResponded = guests.some((g: any) => g.guest_rsvps?.length > 0);

      // Format guest details
      const guestDetails = guests.map((guest: any) => {
        const rsvp = guest.guest_rsvps?.[0];
        
        // Debug log for each guest
        console.log(`Guest ${guest.id} (${guest.first_name}):`, {
          hasRsvp: !!rsvp,
          rsvpAttending: rsvp?.attending,
          rsvpAttendingType: typeof rsvp?.attending,
        });

        // Handle attending - could be boolean, string, or null
        let attending: boolean | null = null;
        if (rsvp?.attending !== undefined && rsvp?.attending !== null) {
          // Handle string "true"/"false" or boolean true/false
          if (typeof rsvp.attending === 'string') {
            attending = rsvp.attending === 'true';
          } else {
            attending = Boolean(rsvp.attending);
          }
        }

        return {
          id: guest.id,
          firstName: guest.first_name,
          lastName: guest.last_name,
          isPlusOne: guest.is_plus_one,
          canBringPlusOne: guest.can_bring_plus_one,
          plusOneFor: guest.plus_one_for,
          // RSVP data
          attending,
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

      // Count attending - use explicit true check
      const attendingCount = guestDetails.filter((g: any) => g.attending === true).length;
      const notAttendingCount = guestDetails.filter((g: any) => g.attending === false).length;

      console.log(`Party ${party.party_name}: attending=${attendingCount}, notAttending=${notAttendingCount}`);

      return {
        partyId: party.id,
        partyName: party.party_name,
        invitationType: party.invited_to_ceremony ? 'All Day' : 'Evening Only',
        invitedToCeremony: party.invited_to_ceremony,
        invitedToReception: party.invited_to_reception,
        hasResponded,
        attendingCount,
        notAttendingCount,
        guests: guestDetails,
        songRequest: extras?.song_request || null,
        recipeTitle: extras?.recipe_title || null,
        recipeText: extras?.recipe_text || null,
      };
    }) || [];

    return NextResponse.json({ rsvps: formattedRsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ rsvps: [] });
  }
}
