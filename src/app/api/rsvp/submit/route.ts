import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { party_name, password } = await req.json();

    if (!party_name || !password) {
      return NextResponse.json({ error: 'Missing party name or password' }, { status: 400 });
    }

    // 1️⃣ Fetch party by party_name
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .eq('party_name', party_name)
      .single(); // should only be one match

    if (partyError) throw partyError;
    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // 2️⃣ Check password (replace this with hashed passwords in production!)
    if (party.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // 3️⃣ Fetch guests for this party
    const { data: guests, error: guestError } = await supabase
      .from('guests')
      .select('id, first_name, last_name, is_plus_one')
      .eq('party_id', party.id);

    if (guestError) throw guestError;

    // 4️⃣ Fetch existing RSVP for this party (optional)
    const { data: existingRsvp } = await supabase
      .from('rsvps')
      .select('*')
      .eq('party_id', party.id)
      .single();

    // 5️⃣ Return data in the shape your frontend expects
    return NextResponse.json({
      party: {
        id: party.id,
        name: party.party_name,
        invited_to_ceremony: party.invited_to_ceremony,
        invited_to_reception: party.invited_to_reception,
      },
      guests: guests.map(g => ({
        id: g.id,
        name: `${g.first_name} ${g.last_name}`,
        firstName: g.first_name,
        lastName: g.last_name,
        isPlusOne: g.is_plus_one,
        code: '', // optional
      })),
      existing_rsvp: existingRsvp || null,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
