import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { WEDDING_CONFIG } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        message,
        sent_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Send email notification
    // Option 1: Using Resend (recommended, easy setup)
    // Option 2: Using SendGrid
    // Option 3: Using Supabase Edge Functions
    
    // For now, we'll use a simple webhook approach
    // You can integrate with any email service
    
    if (process.env.EMAIL_WEBHOOK_URL) {
      try {
        await fetch(process.env.EMAIL_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: WEDDING_CONFIG.contactEmail,
            subject: `Wedding Website Contact: ${name}`,
            text: `
New message from your wedding website:

Name: ${name}
Email: ${email}

Message:
${message}
            `,
            replyTo: email,
          }),
        });
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('Email sending error:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in contact form:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
