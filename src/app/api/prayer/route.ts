import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, request: requestText, is_private } = body;

        if (!name || !requestText) {
            return NextResponse.json(
                { error: 'Name and prayer request are required' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('prayer_requests')
            .insert([
                {
                    name,
                    email,
                    request: requestText,
                    is_private: is_private || false,
                    status: 'pending'
                }
            ]);

        if (error) throw error;

        return NextResponse.json(
            { message: 'Prayer request submitted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Prayer request error:', error);
        return NextResponse.json(
            { error: 'Failed to submit prayer request' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Fetch only approved and non-private requests for public view
        const { data, error } = await supabaseAdmin
            .from('prayer_requests')
            .select('*')
            .eq('status', 'approved')
            .eq('is_private', false)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching prayer requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prayer requests' },
            { status: 500 }
        );
    }
}
