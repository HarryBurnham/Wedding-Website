import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      party_id,
      attending,
      meal_choices,
      dietary_restrictions,
      song_request,
      recipe_text,
    } = body;

    if (!party_id) {
      return NextResponse.json({ error: 'Party ID is required' }, { status: 400 });
    }

    // Verify party exists
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('id')
      .eq('id', party_id)
      .single();

    if (partyError || !party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // Check if RSVP already exists
    const { data: existingRsvp } = await supabase
      .from('rsvps')
      .select('id')
      .eq('party_id', party_id)
      .single();

    const rsvpData = {
      party_id,
      attending: attending || {},
      meal_choices: meal_choices || {},
      dietary_restrictions: dietary_restrictions || {},
      song_request: song_request || null,
      recipe_text: recipe_text || null,
      updated_at: new Date().toISOString(),
    };

    if (existingRsvp) {
      // Update existing RSVP
      const { error: updateError } = await supabase
        .from('rsvps')
        .update(rsvpData)
        .eq('id', existingRsvp.id);

      if (updateError) {
        console.error('RSVP update error:', updateError);
        return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 });
      }
    } else {
      // Create new RSVP
      const { error: insertError } = await supabase
        .from('rsvps')
        .insert({
          ...rsvpData,
          submitted_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('RSVP insert error:', insertError);
        return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in RSVP submission:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
