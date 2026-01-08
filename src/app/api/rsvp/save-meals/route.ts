import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guest_rsvps } = body;

    if (!guest_rsvps) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update meal choices for each guest
    for (const rsvp of guest_rsvps) {
      const { guest_id, meal_choice, dietary_requirements } = rsvp;

      const { error } = await supabase
        .from('guest_rsvps')
        .update({
          meal_choice: meal_choice || null,
          dietary_requirements: dietary_requirements || null,
          updated_at: new Date().toISOString(),
        })
        .eq('guest_id', guest_id);

      if (error) {
        console.error('Error updating meal choice:', error);
        return NextResponse.json({ error: 'Failed to save meal choices' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving meals:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
