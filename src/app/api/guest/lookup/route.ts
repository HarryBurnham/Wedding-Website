import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  try {
    // Look up guest by code
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (guestError || !guest) {
      return NextResponse.json(
        { error: 'Guest not found. Please check your code and try again.' },
        { status: 404 }
      );
    }

    // Get all members in this guest's party
    const { data: members, error: membersError } = await supabase
      .from('guest_members')
      .select('*')
      .eq('guest_id', guest.id)
      .order('is_plus_one', { ascending: true });

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return NextResponse.json({ error: 'Failed to load guest details' }, { status: 500 });
    }

    // Check for existing RSVP
    const { data: existingRsvp } = await supabase
      .from('rsvps')
      .select('*')
      .eq('guest_id', guest.id)
      .single();

    // Format response
    const formattedMembers = members?.map(member => ({
      id: member.id,
      name: member.name,
      isPlusOne: member.is_plus_one,
    })) || [];

    // If no members exist, create a default entry for the primary guest
    if (formattedMembers.length === 0) {
      formattedMembers.push({
        id: guest.id,
        name: guest.first_name + ' ' + guest.last_name,
        isPlusOne: false,
      });

      // Add plus one if allowed
      if (guest.has_plus_one) {
        formattedMembers.push({
          id: guest.id + '-plus-one',
          name: 'Plus One',
          isPlusOne: true,
        });
      }
    }

    return NextResponse.json({
      id: guest.id,
      code: guest.code,
      primary_guest_name: guest.first_name + ' ' + guest.last_name,
      members: formattedMembers,
      invited_to_ceremony: guest.invited_to_ceremony,
      invited_to_reception: guest.invited_to_reception,
      existing_rsvp: existingRsvp ? {
        attending: existingRsvp.attending || {},
        meal_choices: existingRsvp.meal_choices || {},
        dietary_restrictions: existingRsvp.dietary_restrictions || {},
        song_request: existingRsvp.song_request,
        recipe_text: existingRsvp.recipe_text,
        recipe_file_name: existingRsvp.recipe_file_name,
      } : null,
    });
  } catch (error) {
    console.error('Error in guest lookup:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
