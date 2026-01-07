import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select(`
        id,
        recipe_text,
        recipe_file_url,
        recipe_file_name,
        submitted_at,
        guests (
          first_name,
          last_name
        )
      `)
      .or('recipe_text.neq.null,recipe_file_url.neq.null')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    const recipes = rsvps?.map(rsvp => ({
      id: rsvp.id,
      guest_name: rsvp.guests ? `${rsvp.guests.first_name} ${rsvp.guests.last_name}` : 'Unknown',
      recipe_text: rsvp.recipe_text,
      recipe_file_url: rsvp.recipe_file_url,
      recipe_file_name: rsvp.recipe_file_name,
      submitted_at: rsvp.submitted_at,
    })).filter(r => r.recipe_text || r.recipe_file_url) || [];

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ recipes: [] });
  }
}
