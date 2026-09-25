import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Resend } from 'resend';
import type { ContactFormData, ApiResponse } from '@/types/database';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body: ContactFormData = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { data, error: dbError } = await supabaseAdmin
            .from('contact_submissions')
            .insert({
                name,
                email,
                subject,
                message,
                status: 'new'
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Failed to save submission' },
                { status: 500 }
            );
        }

        // Send email notification to admin
        try {
            await resend.emails.send({
                from: 'Gracelove Chapel Website <onboarding@resend.dev>', // Change this to your verified domain
                to: process.env.ADMIN_EMAIL!,
                subject: `New Contact Form: ${subject}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `
            });
        } catch (emailError) {
            // Log email error but don't fail the request
            console.error('Email error:', emailError);
            // Submission still saved to database
        }

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: 'Thank you for your message! We will get back to you soon.',
                data
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
