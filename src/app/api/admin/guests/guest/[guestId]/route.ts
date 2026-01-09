import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Update guest
export async function PATCH(
  request: NextRequest,
  { params }: { params: { guestId: string } }
) {
  try {
    const supabase = createAdminClient();
    const guestId = parseInt(params.guestId);
    const body = await request.json();
    const { first_name, last_name, invited_to_ceremony, can_bring_plus_one } = body;

    // Get current guest data
    const { data: currentGuest } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (!currentGuest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Update the guest
    const { error } = await supabase
      .from('guests')
      .update({
        first_name,
        last_name,
        invited_to_ceremony,
        invited_to_reception: true,
        can_bring_plus_one: currentGuest.is_plus_one ? false : can_bring_plus_one,
      })
      .eq('id', guestId);

    if (error) {
      console.error('Error updating guest:', error);
      throw error;
    }

    // If this guest has a plus-one, update their invitation type to match
    if (!currentGuest.is_plus_one) {
      await supabase
        .from('guests')
        .update({
          invited_to_ceremony,
          invited_to_reception: true,
        })
        .eq('plus_one_for', guestId);

      // Handle can_bring_plus_one changes
      const { data: existingPlusOne } = await supabase
        .from('guests')
        .select('id')
        .eq('plus_one_for', guestId)
        .single();

      if (can_bring_plus_one && !existingPlusOne) {
        // Create plus-one slot
        await supabase.from('guests').insert({
          party_id: currentGuest.party_id,
          first_name: 'Guest',
          last_name: 'of ' + first_name,
          is_plus_one: true,
          can_bring_plus_one: false,
          plus_one_for: guestId,
          invited_to_ceremony,
          invited_to_reception: true,
        });
      } else if (!can_bring_plus_one && existingPlusOne) {
        // Remove plus-one slot (and their RSVP if any)
        await supabase.from('guest_rsvps').delete().eq('guest_id', existingPlusOne.id);
        await supabase.from('guests').delete().eq('id', existingPlusOne.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}

// Delete guest
export async function DELETE(
  request: NextRequest,
  { params }: { params: { guestId: string } }
) {
  try {
    const supabase = createAdminClient();
    const guestId = parseInt(params.guestId);

    // Get guest info first
    const { data: guest } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // If this is a main guest, also delete their plus-one
    if (!guest.is_plus_one) {
      const { data: plusOne } = await supabase
        .from('guests')
        .select('id')
        .eq('plus_one_for', guestId)
        .single();

      if (plusOne) {
        await supabase.from('guest_rsvps').delete().eq('guest_id', plusOne.id);
        await supabase.from('guests').delete().eq('id', plusOne.id);
      }
    }

    // Delete RSVP first
    await supabase.from('guest_rsvps').delete().eq('guest_id', guestId);

    // Delete the guest
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);

    if (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}