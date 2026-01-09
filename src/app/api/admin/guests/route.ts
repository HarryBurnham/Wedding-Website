import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch parties with embedded guests, RSVPs, and party_extras
    const { data: partiesData, error } = await supabase
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

    if (error) throw error;

    // Map the data into the structure your frontend expects
    const parties = partiesData?.map((party: any) => {
      const extras = party.party_extras?.[0];

      // Sort guests: main guests first, plus-ones last
      const sortedGuests = (party.guests || []).sort((a: any, b: any) => {
        if (a.is_plus_one === b.is_plus_one) return a.id - b.id;
        return a.is_plus_one ? 1 : -1;
      });

      return {
        partyId: party.id,
        partyName: party.party_name,
        invitedToCeremony: party.invited_to_ceremony,
        invitedToReception: party.invited_to_reception,
        invitationType: party.invited_to_ceremony ? 'All Day' : 'Evening Only',
        songRequest: extras?.song_request || '',
        recipeTitle: extras?.recipe_title || '',
        recipeText: extras?.recipe_text || '',
        guests: sortedGuests.map((guest: any) => {
          const rsvp = guest.guest_rsvps?.[0];
          return {
            id: guest.id,
            firstName: guest.first_name,
            lastName: guest.last_name,
            isPlusOne: guest.is_plus_one,
            canBringPlusOne: guest.can_bring_plus_one,
            plusOneFor: guest.plus_one_for,
            attending: rsvp?.attending ?? null,
            mealChoice: rsvp?.meal_choice || '',
            dietaryRequirements: rsvp?.dietary_requirements || '',
            plusOneFirstName: rsvp?.plus_one_first_name || '',
            plusOneLastName: rsvp?.plus_one_last_name || '',
          };
        }),
      };
    }) || [];

    return NextResponse.json({ parties });
  } catch (error) {
    console.error('Error fetching parties:', error);
    return NextResponse.json({ parties: [] });
  }
}