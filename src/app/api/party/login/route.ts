import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { party_name, password } = await req.json();

    if (!party_name || !password) {
      return NextResponse.json({ error: 'Missing party name or password' }, { status: 400 });
    }

    // Fetch the party by party_name
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .eq('party_name', party_name)
      .single();

    if (partyError || !party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // Check password
    if (party.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Fetch guests for the party
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('id, first_name, last_name, is_plus_one')
      .eq('party_id', party.id);

    if (guestsError) throw guestsError;

    // Fetch existing RSVP if any
    const { data: existingRsvp } = await supabase
      .from('rsvps')
      .select('*')
      .eq('party_id', party.id)
      .single();

    // ✅ Return party_id so frontend can use it for RSVP submission
    return NextResponse.json({
      party: {
        id: party.id,                     // <-- MUST include party.id
        name: party.party_name,
        invited_to_ceremony: party.invited_to_ceremony,
        invited_to_reception: party.invited_to_reception,
      },
      guests: guests.map((g) => ({
        id: g.id,
        name: `${g.first_name} ${g.last_name}`,
        firstName: g.first_name,
        lastName: g.last_name,
        isPlusOne: g.is_plus_one,
        code: '',
      })),
      existing_rsvp: existingRsvp || null,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}