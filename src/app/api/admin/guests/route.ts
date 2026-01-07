import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ guests: guests || [] });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ guests: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('guests')
      .insert({
        code: body.code,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email || null,
        has_plus_one: body.has_plus_one || false,
        invited_to_ceremony: body.invited_to_ceremony ?? true,
        invited_to_reception: body.invited_to_reception ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Create guest member entries
    const members = [
      {
        guest_id: data.id,
        name: `${body.first_name} ${body.last_name}`,
        is_plus_one: false,
      },
    ];

    if (body.has_plus_one) {
      members.push({
        guest_id: data.id,
        name: 'Plus One',
        is_plus_one: true,
      });
    }

    await supabase.from('guest_members').insert(members);

    return NextResponse.json({ guest: data });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}
