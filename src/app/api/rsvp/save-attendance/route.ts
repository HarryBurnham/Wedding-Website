import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_id, guest_rsvps } = body;

    if (!party_id || !guest_rsvps) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Process each guest RSVP
    for (const rsvp of guest_rsvps) {
      const { guest_id, attending, plus_one_first_name, plus_one_last_name } = rsvp;

      // Check if record exists
      const { data: existingRsvp } = await supabase
        .from('guest_rsvps')
        .select('id')
        .eq('guest_id', guest_id)
        .single();

      if (existingRsvp) {
        // Update existing record (only attendance fields, preserves meal data)
        const { error } = await supabase
          .from('guest_rsvps')
          .update({
            attending,
            plus_one_first_name: plus_one_first_name || null,
            plus_one_last_name: plus_one_last_name || null,
            updated_at: new Date().toISOString(),
          })
          .eq('guest_id', guest_id);

        if (error) {
          console.error('Error updating RSVP:', error);
          return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 });
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('guest_rsvps')
          .insert({
            guest_id,
            attending,
            plus_one_first_name: plus_one_first_name || null,
            plus_one_last_name: plus_one_last_name || null,
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error inserting RSVP:', error);
          return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
