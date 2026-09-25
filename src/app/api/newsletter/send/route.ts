import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        // Authenticate request: Bearer token must belong to a valid authenticated user
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.replace(/^Bearer\s+/i, "");

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized: Missing authentication token" },
                { status: 401 }
            );
        }

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid or expired admin session" },
                { status: 401 }
            );
        }

        const { subject, content } = await req.json();

        if (!subject || !content) {
            return NextResponse.json(
                { error: "Subject and content are required" },
                { status: 400 }
            );
        }

        // 1. Fetch all active subscribers
        const { data: subscribers, error: fetchError } = await supabaseAdmin
            .from("newsletter_subscribers")
            .select("email")
            .eq("is_active", true);

        if (fetchError) throw fetchError;
        if (!subscribers || subscribers.length === 0) {
            return NextResponse.json({ message: "No active subscribers found" });
        }

        const emails = subscribers.map((s: { email: string }) => s.email);

        // 2. Send emails using Resend (Batch sending)
        const { data, error } = await resend.emails.send({
            from: "Gracelove Chapel <onboarding@resend.dev>", // Replace with verified domain in production
            to: emails,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <img src="https://gracelovechapel.com/logo.png" alt="Gracelove Chapel" style="height: 50px; margin-bottom: 20px;">
                    <h1 style="color: #1a365d; font-size: 24px;">${subject}</h1>
                    <div style="color: #4a5568; line-height: 1.6; font-size: 16px;">
                        ${content.replace(/\n/g, "<br>")}
                    </div>
                    <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
                    <p style="color: #a0aec0; font-size: 12px; text-align: center;">
                        You are receiving this because you subscribed to Gracelove Chapel's newsletter.<br>
                        <a href="https://gracelovechapel.com/unsubscribe" style="color: #4a5568;">Unsubscribe</a>
                    </p>
                </div>
            `,
        });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: `Newsletter sent successfully to ${emails.length} subscribers!`,
            resendId: data?.id
        });

    } catch (error: any) {
        console.error("Newsletter send error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send newsletter" },
            { status: 500 }
        );
    }
}
