"use client";

import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/types/database";

interface EventCardProps {
    event: Event;
    index: number;
}

export function EventCard({ event, index }: EventCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/10 hover:shadow-lg transition-all duration-300"
        >
            <div className="grid md:grid-cols-[300px_1fr] gap-0">
                {/* Event Image */}
                <div className="relative h-64 md:h-auto min-h-[220px] bg-primary/5">
                    <Image
                        src={event.image_url || "/assets/images/placeholder.jpg"}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                        unoptimized
                    />
                    {event.recurring && (
                        <div className="absolute top-4 left-4">
                            <span className="bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                Recurring
                            </span>
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold font-heading text-primary mb-4">
                            {event.title}
                        </h2>

                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-2 text-foreground/70">
                                <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="text-sm font-medium">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="text-sm font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="text-sm font-medium">{event.location}</span>
                            </div>
                        </div>

                        <p className="text-foreground/80 leading-relaxed text-base">
                            {event.description}
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link
                            href={`/contact?subject=Inquiry%20regarding%20${encodeURIComponent(event.title)}`}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all hover:gap-3"
                        >
                            <span>Event Inquiry</span>
                            <ArrowRight className="w-4 h-4 text-secondary" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
