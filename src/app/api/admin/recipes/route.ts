import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select(`
        id,
        recipe_text,
        submitted_at,
        parties (
          id,
          party_name
        )
      `)
      .not('recipe_text', 'is', null)
      .neq('recipe_text', '')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    const recipes = rsvps?.map(rsvp => ({
      id: rsvp.id,
      party_name: rsvp.parties?.[0]?.party_name || 'Unknown',
      recipe_text: rsvp.recipe_text,
      submitted_at: rsvp.submitted_at,
    })) || [];

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ recipes: [] });
  }
}
