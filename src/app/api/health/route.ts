import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// This endpoint can be pinged by free cron services (like cron-job.org or UptimeRobot)
// every 2-3 days to keep your Supabase project active and prevent it from pausing.
export async function GET() {
    try {
        const { error } = await supabase.from("services").select("id").limit(1);

        if (error) {
            return NextResponse.json(
                { status: "error", message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            status: "ok",
            timestamp: new Date().toISOString(),
            message: "Supabase connection active",
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
            { status: "error", message },
            { status: 500 }
        );
    }
}
