import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email notification using Resend
    try {
      await resend.emails.send({
        from: 'Wedding Website <onboarding@resend.dev>', // Use your verified domain later
        to: 'harryadiawedding@gmail.com',
        replyTo: email,
        subject: `💌 Wedding Contact: Message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #722F37; border-bottom: 2px solid #722F37; padding-bottom: 10px;">
              New Message from Wedding Website
            </h2>
            
            <div style="background-color: #f9f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #722F37;">From:</strong> ${name}
              </p>
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #722F37;">Email:</strong> 
                <a href="mailto:${email}" style="color: #722F37;">${email}</a>
              </p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; color: #722F37;"><strong>Message:</strong></p>
              <p style="margin: 0; color: #333; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #888; font-size: 12px; margin-top: 20px;">
              You can reply directly to this email to respond to ${name}.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // Log error but don't fail the request - message is already saved to DB
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in contact form:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
