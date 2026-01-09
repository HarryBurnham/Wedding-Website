import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch party_extras
    const { data: extras, error: extrasError } = await supabase
      .from('party_extras')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (extrasError) throw extrasError;

    // Fetch all parties to map names
    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select('id, party_name');

    if (partiesError) throw partiesError;

    // Create a map of party_id to party_name
    const partyMap = new Map(
      parties?.map(p => [p.id, p.party_name]) || []
    );

    // Format the response
    const formattedRecipes = extras?.map(extra => ({
      id: extra.id,
      partyId: extra.party_id,
      partyName: partyMap.get(extra.party_id) || 'Unknown',
      recipeTitle: extra.recipe_title,
      recipeText: extra.recipe_text,
      songRequest: extra.song_request,
      submittedAt: extra.submitted_at,
    })) || [];

    return NextResponse.json({ recipes: formattedRecipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ recipes: [] });
  }
}