import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: parties, error } = await supabase
      .from('parties')
      .select(`
        *,
        guests (*)
      `)
      .order('id', { ascending: true });

    if (error) throw error;

    const formattedParties = parties?.map(party => ({
      partyId: party.id,
      partyName: party.party_name,
      password: party.password,
      invitedToCeremony: party.invited_to_ceremony,
      invitedToReception: party.invited_to_reception,
      invitationType: party.invited_to_ceremony ? 'All Day' : 'Evening Only',
      guests: party.guests?.map((g: any) => ({
        id: g.id,
        firstName: g.first_name,
        lastName: g.last_name,
        isPlusOne: g.is_plus_one,
        canBringPlusOne: g.can_bring_plus_one,
        plusOneFor: g.plus_one_for,
      })) || [],
      createdAt: party.created_at,
    })) || [];

    return NextResponse.json({ parties: formattedParties });
  } catch (error) {
    console.error('Error fetching parties:', error);
    return NextResponse.json({ parties: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_name, password, invited_to_ceremony, invited_to_reception, guests } = body;

    if (!party_name || !password) {
      return NextResponse.json({ error: 'Party name and password are required' }, { status: 400 });
    }

    // Create party
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .insert({
        party_name,
        password,
        invited_to_ceremony: invited_to_ceremony ?? true,
        invited_to_reception: invited_to_reception ?? true,
      })
      .select()
      .single();

    if (partyError) throw partyError;

    // Add guests if provided
    if (guests && guests.length > 0) {
      // First, add all non-plus-one guests
      const mainGuests = guests.filter((g: any) => !g.is_plus_one);
      const insertedMainGuests: { [tempId: string]: number } = {};

      for (const guest of mainGuests) {
        const { data: insertedGuest, error: guestError } = await supabase
          .from('guests')
          .insert({
            party_id: party.id,
            first_name: guest.first_name,
            last_name: guest.last_name,
            is_plus_one: false,
            can_bring_plus_one: guest.can_bring_plus_one || false,
            plus_one_for: null,
          })
          .select()
          .single();

        if (guestError) {
          console.error('Error adding guest:', guestError);
        } else if (insertedGuest) {
          insertedMainGuests[guest.temp_id || guest.first_name] = insertedGuest.id;
        }
      }

      // Then add plus-one slots linked to their main guests
      const plusOneGuests = guests.filter((g: any) => g.is_plus_one);
      for (const guest of plusOneGuests) {
        const mainGuestId = insertedMainGuests[guest.plus_one_for_temp_id];
        if (mainGuestId) {
          const { error: plusOneError } = await supabase
            .from('guests')
            .insert({
              party_id: party.id,
              first_name: guest.first_name || 'Guest',
              last_name: guest.last_name ||'TBC',
              is_plus_one: true,
              can_bring_plus_one: false,
              plus_one_for: mainGuestId,
            });

          if (plusOneError) {
            console.error('Error adding plus one:', plusOneError);
          }
        }
      }
    }

    return NextResponse.json({ 
      party: {
        partyId: party.id,
        partyName: party.party_name,
      }
    });
  } catch (error) {
    console.error('Error creating party:', error);
    return NextResponse.json({ error: 'Failed to create party' }, { status: 500 });
  }
}
