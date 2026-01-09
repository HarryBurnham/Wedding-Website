import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasUrl: !!process.env.SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    urlStart: process.env.SUPABASE_URL?.slice(0, 25),
    keyStart: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 15),
  });
}
