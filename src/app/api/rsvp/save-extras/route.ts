import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_id, song_request } = body;

    if (!party_id) {
      return NextResponse.json({ error: 'Party ID is required' }, { status: 400 });
    }

    // Check if record exists
    const { data: existingExtras } = await supabase
      .from('party_extras')
      .select('id')
      .eq('party_id', party_id)
      .single();

    if (existingExtras) {
      // Update existing record
      const { error } = await supabase
        .from('party_extras')
        .update({
          song_request: song_request || null,
          updated_at: new Date().toISOString(),
        })
        .eq('party_id', party_id);

      if (error) {
        console.error('Error updating extras:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('party_extras')
        .insert({
          party_id,
          song_request: song_request || null,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error inserting extras:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving extras:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
