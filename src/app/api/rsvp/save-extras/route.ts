import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_id, song_request, recipe_title, recipe_text } = body;

    if (!party_id) {
      return NextResponse.json({ error: 'Party ID is required' }, { status: 400 });
    }

    // Check if party extras exist
    const { data: existingExtras } = await supabase
      .from('party_extras')
      .select('id')
      .eq('party_id', party_id)
      .single();

    const extrasData = {
      party_id,
      song_request: song_request || null,
      recipe_title: recipe_title || null,
      recipe_text: recipe_text || null,
      updated_at: new Date().toISOString(),
    };

    if (existingExtras) {
      // Update existing
      const { error } = await supabase
        .from('party_extras')
        .update(extrasData)
        .eq('id', existingExtras.id);

      if (error) {
        console.error('Error updating extras:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('party_extras')
        .insert({
          ...extrasData,
          submitted_at: new Date().toISOString(),
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
