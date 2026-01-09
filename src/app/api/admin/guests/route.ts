import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Fetch all parties
    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select('*')
      .order('id', { ascending: true });

    if (partiesError) throw partiesError;

    // Fetch all guests
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .order('id', { ascending: true });

    if (guestsError) throw guestsError;

    // Fetch all party extras
    const { data: extras, error: extrasError } = await supabase
      .from('party_extras')
      .select('*');

    if (extrasError) throw extrasError;

    // Group guests by party
    const guestsByPartyId: { [key: number]: any[] } = {};
    (guests || []).forEach(guest => {
      if (!guestsByPartyId[guest.party_id]) {
        guestsByPartyId[guest.party_id] = [];
      }
      guestsByPartyId[guest.party_id].push(guest);
    });

    // Map extras by party
    const extrasByPartyId: { [key: number]: any } = {};
    (extras || []).forEach(extra => {
      extrasByPartyId[extra.party_id] = extra;
    });

    // Format the response
    const formattedParties = (parties || []).map(party => {
      const partyGuests = guestsByPartyId[party.id] || [];
      const partyExtras = extrasByPartyId[party.id];

      // Sort guests: main guests first, plus-ones last
      const sortedGuests = partyGuests.sort((a, b) => {
        if (a.is_plus_one === b.is_plus_one) return a.id - b.id;
        return a.is_plus_one ? 1 : -1;
      });

      return {
        partyId: party.id,
        partyName: party.party_name,
        password: party.password,
        invitedToCeremony: party.invited_to_ceremony,
        invitedToReception: party.invited_to_reception,
        invitationType: party.invited_to_ceremony ? 'All Day' : 'Evening Only',
        createdAt: party.created_at,
        songRequest: partyExtras?.song_request || '',
        recipeTitle: partyExtras?.recipe_title || '',
        recipeText: partyExtras?.recipe_text || '',
        guests: sortedGuests.map(guest => ({
          id: guest.id,
          firstName: guest.first_name,
          lastName: guest.last_name,
          isPlusOne: guest.is_plus_one,
          canBringPlusOne: guest.can_bring_plus_one,
          plusOneFor: guest.plus_one_for,
        })),
      };
    });

    return NextResponse.json({ parties: formattedParties });
  } catch (error) {
    console.error('Error fetching parties:', error);
    return NextResponse.json({ parties: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { party_name, password, invited_to_ceremony, invited_to_reception, guests } = body;

    // Validate required fields
    if (!party_name || !password) {
      return NextResponse.json({ error: 'Party name and password are required' }, { status: 400 });
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ error: 'At least one guest is required' }, { status: 400 });
    }

    // 1. Create the party
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

    if (partyError) {
      console.error('Error creating party:', partyError);
      if (partyError.code === '23505') {
        return NextResponse.json({ error: 'A party with this name already exists' }, { status: 400 });
      }
      throw partyError;
    }

    // 2. Create the guests
    const guestsToInsert: any[] = [];
    const plusOneGuests: { forIndex: number; guest: any }[] = [];

    // First pass: prepare main guests and track plus-ones needed
    guests.forEach((guest: any, index: number) => {
      guestsToInsert.push({
        party_id: party.id,
        first_name: guest.first_name,
        last_name: guest.last_name,
        is_plus_one: false,
        can_bring_plus_one: guest.can_bring_plus_one || false,
        plus_one_for: null,
      });

      // If guest can bring a plus one, we'll create a placeholder plus-one guest
      if (guest.can_bring_plus_one) {
        plusOneGuests.push({
          forIndex: index,
          guest: {
            party_id: party.id,
            first_name: 'Guest',
            last_name: 'of ' + guest.first_name,
            is_plus_one: true,
            can_bring_plus_one: false,
            plus_one_for: null, // Will be set after main guests are inserted
          },
        });
      }
    });

    // Insert main guests
    const { data: insertedGuests, error: guestsError } = await supabase
      .from('guests')
      .insert(guestsToInsert)
      .select();

    if (guestsError) {
      console.error('Error creating guests:', guestsError);
      // Rollback: delete the party
      await supabase.from('parties').delete().eq('id', party.id);
      throw guestsError;
    }

    // Insert plus-one guests with references to main guests
    if (plusOneGuests.length > 0 && insertedGuests) {
      const plusOnesToInsert = plusOneGuests.map(po => ({
        ...po.guest,
        plus_one_for: insertedGuests[po.forIndex].id,
      }));

      const { error: plusOneError } = await supabase
        .from('guests')
        .insert(plusOnesToInsert);

      if (plusOneError) {
        console.error('Error creating plus-one guests:', plusOneError);
        // Don't fail the whole request, plus-ones are optional
      }
    }

    return NextResponse.json({ 
      success: true, 
      party: {
        id: party.id,
        name: party.party_name,
      },
      guestsCreated: insertedGuests?.length || 0,
    });
  } catch (error) {
    console.error('Error creating party:', error);
    return NextResponse.json({ error: 'Failed to create party' }, { status: 500 });
  }
}
