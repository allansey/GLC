import { supabaseAdmin } from "@/lib/supabase/server";
import { Event } from "@/types/database";
import { EventCard } from "@/components/ui/EventCard";
import { motion } from "framer-motion";
import * as Framer from "framer-motion"; // Import entire namespace for server component usage if needed, or stick to client components for animation.
// Since we're using "use client" in EventCard, we can keep this page as a Server Component for fetching.

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Events",
    description: "Discover upcoming events, worship nights, and programs at Gracelove Chapel.",
};

export default async function EventsPage() {
    const { data, error } = await supabaseAdmin
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('id', { ascending: true });

    const events = data as Event[] | null;

    if (error) {
        console.error("Error fetching events:", error);
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-primary py-20 text-center text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Note: In Server Components, we can't simply render motion.div directly without "use client".
                        We'll use a simple wrapper or just standard HTML with Tailwind classes for the hero if we want full SSR.
                        However, usually the Page file itself can be a Server Component and import Client Components.
                        Let's keep the Hero simple for SSR or extract it if we want animation.
                    */}
                    <div className="animate-fade-in-up"> {/* Assuming you might have utility classes or we just accept static first render then hydrate */}
                        <h1 className="mb-4 text-4xl font-bold font-heading md:text-5xl">Upcoming Events</h1>
                        <p className="mx-auto max-w-2xl text-lg opacity-90">
                            Join us for these exciting opportunities to worship, learn, and connect with our church family.
                        </p>
                    </div>
                </div>
            </section>

            {/* Events List */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {!events || events.length === 0 ? (
                            <div className="text-center py-10">
                                <h3 className="text-2xl text-muted-foreground">No upcoming events at the moment.</h3>
                                <p className="text-muted-foreground mt-2">Check back soon!</p>
                            </div>
                        ) : (
                            events.map((event, index) => (
                                <EventCard key={event.id} event={event} index={index} />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

