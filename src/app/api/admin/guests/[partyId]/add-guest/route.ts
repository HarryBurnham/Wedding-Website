import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { partyId: string } }
) {
  try {
    const supabase = createAdminClient();
    const partyId = parseInt(params.partyId);
    const body = await request.json();
    const { first_name, last_name, invited_to_ceremony, can_bring_plus_one } = body;

    if (!first_name?.trim()) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }

    // Insert the main guest
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .insert({
        party_id: partyId,
        first_name: first_name.trim(),
        last_name: last_name?.trim() || '',
        is_plus_one: false,
        can_bring_plus_one: can_bring_plus_one || false,
        invited_to_ceremony: invited_to_ceremony ?? true,
        invited_to_reception: true,
      })
      .select()
      .single();

    if (guestError) {
      console.error('Error adding guest:', guestError);
      throw guestError;
    }

    // If can bring plus one, create the plus-one slot
    if (can_bring_plus_one && guest) {
      await supabase.from('guests').insert({
        party_id: partyId,
        first_name: 'Guest',
        last_name: 'of ' + first_name.trim(),
        is_plus_one: true,
        can_bring_plus_one: false,
        plus_one_for: guest.id,
        invited_to_ceremony: invited_to_ceremony ?? true,
        invited_to_reception: true,
      });
    }

    return NextResponse.json({ success: true, guest });
  } catch (error) {
    console.error('Error adding guest:', error);
    return NextResponse.json({ error: 'Failed to add guest' }, { status: 500 });
  }
}