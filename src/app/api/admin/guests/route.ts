import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select(`
        *,
        parties (
          id,
          party_name,
          invited_to_ceremony,
          invited_to_reception
        ),
        guest_rsvps (*),
        party_extras (*)
      `)
      .order('party_id', { ascending: true })
      .order('is_plus_one', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw error;

    // Group guests by party
    const partiesMap: { [key: number]: any } = {};

    guests?.forEach(guest => {
      const partyId = guest.party_id;
      const extras = guest.party_extras?.[0];
      if (!partiesMap[partyId]) {
        partiesMap[partyId] = {
          partyId,
          partyName: guest.parties?.party_name || 'Unknown',
          invitedToCeremony: guest.parties?.invited_to_ceremony || false,
          invitedToReception: guest.parties?.invited_to_reception || false,
          invitationType: guest.parties?.invited_to_ceremony ? 'All Day' : 'Evening Only',
          songRequest: extras?.song_request || '',       
          recipeTitle: extras?.reciepe_title || '',      
          recipeText: extras?.reciepe_text || '',
          guests: [],
        };
      }

      const rsvp = guest.guest_rsvps?.[0];

      partiesMap[partyId].guests.push({
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
      });
    });

    const parties = Object.values(partiesMap);

    return NextResponse.json({ parties });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ parties: [] });
  }
}