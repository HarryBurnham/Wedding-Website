import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const guest_id = formData.get('guest_id') as string;
    const attending = JSON.parse(formData.get('attending') as string);
    const meal_choices = JSON.parse(formData.get('meal_choices') as string);
    const dietary_restrictions = JSON.parse(formData.get('dietary_restrictions') as string);
    const song_request = formData.get('song_request') as string;
    const recipe_text = formData.get('recipe_text') as string;
    const recipe_file = formData.get('recipe_file') as File | null;

    if (!guest_id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    // Verify guest exists
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id')
      .eq('id', guest_id)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Handle file upload if present
    let recipe_file_url = null;
    let recipe_file_name = null;

    if (recipe_file && recipe_file.size > 0) {
      const fileExt = recipe_file.name.split('.').pop();
      const fileName = `${guest_id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(fileName, recipe_file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        // Continue without file, don't fail the whole submission
      } else {
        const { data: publicUrl } = supabase.storage
          .from('recipes')
          .getPublicUrl(fileName);
        
        recipe_file_url = publicUrl.publicUrl;
        recipe_file_name = recipe_file.name;
      }
    }

    // Check if RSVP already exists
    const { data: existingRsvp } = await supabase
      .from('rsvps')
      .select('id')
      .eq('guest_id', guest_id)
      .single();

    const rsvpData = {
      guest_id,
      attending,
      meal_choices,
      dietary_restrictions,
      song_request: song_request || null,
      recipe_text: recipe_text || null,
      recipe_file_url,
      recipe_file_name,
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
