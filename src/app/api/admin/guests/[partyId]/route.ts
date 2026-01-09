import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Update party
export async function PATCH(
  request: NextRequest,
  { params }: { params: { partyId: string } }
) {
  try {
    const supabase = createAdminClient();
    const partyId = parseInt(params.partyId);
    const body = await request.json();
    const { party_name, password } = body;

    const { error } = await supabase
      .from('parties')
      .update({
        party_name,
        password,
        updated_at: new Date().toISOString(),
      })
      .eq('id', partyId);

    if (error) {
      console.error('Error updating party:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A party with this name already exists' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating party:', error);
    return NextResponse.json({ error: 'Failed to update party' }, { status: 500 });
  }
}

// Delete party
export async function DELETE(
  request: NextRequest,
  { params }: { params: { partyId: string } }
) {
  try {
    const supabase = createAdminClient();
    const partyId = parseInt(params.partyId);

    // Delete guests first (due to foreign key)
    await supabase.from('guest_rsvps').delete().in(
      'guest_id',
      (await supabase.from('guests').select('id').eq('party_id', partyId)).data?.map(g => g.id) || []
    );
    await supabase.from('guests').delete().eq('party_id', partyId);
    await supabase.from('party_extras').delete().eq('party_id', partyId);

    // Delete the party
    const { error } = await supabase
      .from('parties')
      .delete()
      .eq('id', partyId);

    if (error) {
      console.error('Error deleting party:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting party:', error);
    return NextResponse.json({ error: 'Failed to delete party' }, { status: 500 });
  }
}