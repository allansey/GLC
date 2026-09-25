"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Users, Calendar, Video, Mail } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        contacts: 0,
        events: 0,
        sermons: 0,
        newContacts: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch contact submissions count
                const { count: contactsCount } = await supabase
                    .from("contact_submissions")
                    .select("*", { count: "exact", head: true });

                // Fetch new contacts (status = 'new')
                const { count: newContactsCount } = await supabase
                    .from("contact_submissions")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "new");

                // Fetch events count
                const { count: eventsCount } = await supabase
                    .from("events")
                    .select("*", { count: "exact", head: true });

                // Fetch sermons count
                const { count: sermonsCount } = await supabase
                    .from("sermons")
                    .select("*", { count: "exact", head: true });

                setStats({
                    contacts: contactsCount || 0,
                    events: eventsCount || 0,
                    sermons: sermonsCount || 0,
                    newContacts: newContactsCount || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Contacts",
            value: stats.contacts,
            icon: Mail,
            color: "bg-primary",
            badge: stats.newContacts > 0 ? `${stats.newContacts} new` : null,
        },
        {
            title: "Events",
            value: stats.events,
            icon: Calendar,
            color: "bg-secondary",
        },
        {
            title: "Sermons",
            value: stats.sermons,
            icon: Video,
            color: "bg-accent",
        },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-2">
                    Dashboard
                </h1>
                <p className="text-foreground/60">
                    Welcome to Gracelove Chapel Admin
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-foreground/60">Loading statistics...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {statCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-primary/10 p-4 sm:p-6 hover:shadow-md transition-all hover:border-primary/20"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${card.color} p-3 rounded-lg shadow-sm`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    {card.badge && (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                            {card.badge}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1 font-heading">
                                    {card.value}
                                </h3>
                                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 sm:mt-12">
                <h2 className="text-xl font-bold font-heading text-primary mb-4 sm:mb-6">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <Link
                        href="/admin/events"
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-4 sm:p-6 hover:shadow-md transition-all hover:border-primary/20 text-center group"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/10 transition-colors">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Manage Events</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Create and edit events</p>
                    </Link>

                    <Link
                        href="/admin/sermons"
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-4 sm:p-6 hover:shadow-md transition-all hover:border-primary/20 text-center group"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/10 transition-colors">
                            <Video className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Manage Sermons</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Upload new sermons</p>
                    </Link>

                    <Link
                        href="/admin/contacts"
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-4 sm:p-6 hover:shadow-md transition-all hover:border-primary/20 text-center group"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/10 transition-colors">
                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">View Contacts</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Review submissions</p>
                    </Link>

                    <a
                        href="/"
                        target="_blank"
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-4 sm:p-6 hover:shadow-md transition-all hover:border-primary/20 text-center group"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/10 transition-colors">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">View Website</h3>
                        <p className="text-xs sm:text-sm text-gray-500">See public site</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
