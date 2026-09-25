"use client";

import { Calendar, User, PlayCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sermon } from "@/types/database";
import { getYouTubeThumbnail } from "@/lib/utils/youtube";
import { useState } from "react";
import { VideoModal } from "./VideoModal";

interface SermonCardProps {
    sermon: Sermon;
    index: number;
}

export function SermonCard({ sermon, index }: SermonCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const thumbnailUrl = sermon.thumbnail_url || getYouTubeThumbnail(sermon.video_url);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/10 hover:shadow-lg transition-all duration-300 flex flex-col"
        >
            <div 
                className="relative aspect-video overflow-hidden cursor-pointer"
                onClick={() => sermon.video_url && setIsModalOpen(true)}
            >
                <Image
                    src={thumbnailUrl}
                    alt={sermon.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle className="w-6 h-6 md:w-8 md:h-8 text-primary fill-current" />
                    </div>
                </div>
                {sermon.series && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                            {sermon.series}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>{new Date(sermon.date).toLocaleDateString()}</span>
                    </div>
                    {/* Add duration if available in DB later */}
                </div>

                <h3 className="text-xl font-bold font-heading text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                    {sermon.title}
                </h3>

                <div className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-4">
                    <User className="w-4 h-4 text-secondary" />
                    <span>{sermon.speaker}</span>
                </div>

                {sermon.scripture_reference && (
                    <p className="text-sm text-foreground/60 italic mb-4">
                        {sermon.scripture_reference}
                    </p>
                )}

                <div className="flex gap-3 mt-auto pt-4">
                    {sermon.video_url && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 w-full bg-primary text-primary-foreground text-center py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Watch Video
                        </button>
                    )}
                    {sermon.audio_url && (
                        <a
                            href={sermon.audio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-secondary/10 text-secondary text-center py-2 rounded-full text-sm font-semibold hover:bg-secondary/20 transition-colors"
                        >
                            Listen Audio
                        </a>
                    )}
                </div>
            </div>
            {sermon.video_url && (
                <VideoModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    videoUrl={sermon.video_url} 
                />
            )}
        </motion.article>
    );
}
