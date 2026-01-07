import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select(`
        *,
        parties (
          id,
          party_name
        )
      `)
      .order('party_id', { ascending: true })
      .order('is_plus_one', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw error;

    const formattedGuests = guests?.map(guest => ({
      ...guest,
      code: String(guest.id).padStart(3, '0'),
      party_code: guest.parties ? String(guest.parties.id).padStart(3, '0') : null,
      party_name: guest.parties?.party_name || 'Unknown',
    })) || [];

    return NextResponse.json({ guests: formattedGuests });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ guests: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_id, first_name, last_name, is_plus_one } = body;

    if (!party_id || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Party ID, first name, and last name are required' },
        { status: 400 }
      );
    }

    const { data: guest, error } = await supabase
      .from('guests')
      .insert({
        party_id,
        first_name,
        last_name,
        is_plus_one: is_plus_one || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      guest: {
        ...guest,
        code: String(guest.id).padStart(3, '0'),
      }
    });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}
