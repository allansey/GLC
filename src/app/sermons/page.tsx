import { supabaseAdmin } from "@/lib/supabase/server";
import { Sermon } from "@/types/database";
import { SermonCard } from "@/components/ui/SermonCard";
import { LatestSermonCard } from "@/components/ui/LatestSermonCard";
import { getYouTubeThumbnail } from "@/lib/utils/youtube";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Sermons",
    description: "Watch and listen to spirit-filled sermons and messages from Gracelove Chapel.",
};

export default async function SermonsPage() {
    const { data, error } = await supabaseAdmin
        .from('sermons')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: false });

    const sermons = data as Sermon[] | null;
    const latestSermon = sermons && sermons.length > 0 ? sermons[0] : null;
    const recentSermons = sermons && sermons.length > 1 ? sermons.slice(1) : [];

    if (error) {
        console.error("Error fetching sermons:", error);
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-primary py-20 text-center text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="animate-fade-in-up">
                        <h1 className="mb-4 text-4xl font-bold font-heading md:text-5xl">Sermons</h1>
                        <p className="mx-auto max-w-2xl text-lg opacity-90">
                            Watch and listen to messages that inspire, challenge, and encourage your faith journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Latest Sermon Featured */}
            {latestSermon && (
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-bold font-heading text-primary mb-8 text-center">Latest Message</h2>
                            <LatestSermonCard sermon={latestSermon} />
                        </div>
                    </div>
                </section>
            )}

            {/* Sermons Grid */}
            <section className="py-20 bg-secondary/5">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold font-heading text-primary mb-12 text-center">Recent Sermons</h2>

                    {!sermons || sermons.length === 0 ? (
                        <div className="text-center py-10">
                            <h3 className="text-2xl text-muted-foreground">No sermons available yet.</h3>
                            <p className="text-muted-foreground mt-2">Please check back later for updates.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {recentSermons.length > 0 ? (
                                recentSermons.map((sermon, index) => (
                                    <SermonCard key={sermon.id} sermon={sermon} index={index} />
                                ))
                            ) : (
                                // If only 1 sermon exists (latest), and no others
                                !latestSermon && (
                                    <div className="col-span-full text-center text-muted-foreground">
                                        No recent sermons to display.
                                    </div>
                                )
                            )}

                            {/* If we have only 1 sermon which is the latest, we might want to say 'More coming soon' or just show nothing additional */}
                            {latestSermon && recentSermons.length === 0 && (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-muted-foreground">More sermons coming soon!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
