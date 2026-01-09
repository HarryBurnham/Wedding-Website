import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Try inserting a test party
    const { data, error } = await supabase
      .from('parties')
      .insert({
        party_name: 'TEST_DELETE_ME',
        password: 'test123',
        invited_to_ceremony: true,
        invited_to_reception: true,
      })
      .select()
      .single();
    
    // If it worked, delete it
    if (data) {
      await supabase.from('parties').delete().eq('id', data.id);
    }
    
    return NextResponse.json({
      success: !error,
      error: error,
      data: data,
    });
  } catch (e: any) {
    return NextResponse.json({
      caught: e.message,
    });
  }
}
