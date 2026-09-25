"use client";

import { Play } from "lucide-react";
import { getYouTubeThumbnail } from "@/lib/utils/youtube";
import { Sermon } from "@/types/database";
import { useState } from "react";
import { VideoModal } from "./VideoModal";

interface LatestSermonCardProps {
    sermon: Sermon;
}

export function LatestSermonCard({ sermon }: LatestSermonCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-4xl mx-auto">
            <div
                onClick={() => sermon.video_url && setIsModalOpen(true)}
                className="block group cursor-pointer"
            >
                <div className="aspect-video bg-accent/20 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/10">
                    {/* Thumbnail Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                            backgroundImage: `url(${sermon.thumbnail_url || getYouTubeThumbnail(sermon.video_url)})`
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                    {/* Play Button */}
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 relative z-10 transition-transform duration-300">
                        <Play className="w-8 h-8 text-primary ml-1 fill-current" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent text-white z-10">
                        <h3 className="font-bold text-2xl md:text-3xl mb-2">
                            {sermon.title}
                        </h3>
                        <p className="text-lg opacity-90">
                            {sermon.speaker} • {new Date(sermon.date).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Series Badge */}
                    {sermon.series && (
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
                                {sermon.series}
                            </span>
                        </div>
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
        </div>
    );
}
