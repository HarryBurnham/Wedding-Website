import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: recipes, error } = await supabase
      .from('party_extras')
      .select(`
        *,
        parties (
          party_id,
          party_name
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    const formattedRecipes = recipes?.map(recipe => ({
      id: recipe.id,
      partyId: recipe.party_id,
      partyName: recipe.parties?.party_name || 'Unknown',
      recipeTitle: recipe.recipe_title,
      recipeText: recipe.recipe_text,
      songRequest: recipe.song_request,
      submittedAt: recipe.submitted_at,
    })) || [];

    return NextResponse.json({ recipes: formattedRecipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ recipes: [] });
  }
}

