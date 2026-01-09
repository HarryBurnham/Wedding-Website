import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Try a simple insert and delete to test RLS bypass
    const { data, error } = await supabase
      .from('parties')
      .select('*')
      .limit(1);
    
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
