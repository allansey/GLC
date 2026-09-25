"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-primary">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 z-10" />
                {/* Placeholder for actual image - using a colored div for now, but could be an <img> */}
                <div
                    className="h-full w-full bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-50"
                />
            </div>

            <div className="container relative z-20 px-4 text-center md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-3xl space-y-6"
                >
                    <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md">
                        Welcome to <br />
                        <span className="text-secondary drop-shadow-sm">Gracelove Chapel</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-white/95 sm:text-xl font-medium drop-shadow-sm">
                        A place where Grace abounds and Love transforms. Join us this Sunday for worship, fellowship, and the Word.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Link
                            href="/visit"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-secondary px-8 text-sm font-medium text-white shadow-lg transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                        >
                            Plan Your Visit
                        </Link>
                        <Link
                            href="/sermons"
                            className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Watch Sermons <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
            >
                <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
            </motion.div>
        </section>
    );
}
