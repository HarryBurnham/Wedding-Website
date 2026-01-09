import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ messages: [] });
  }
}
