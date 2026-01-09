import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    serviceKeyEnd: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10),
    anonKeyEnd: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(-10),
  });
}
