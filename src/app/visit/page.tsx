"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function VisitPage() {
    const [settings, setSettings] = useState<Record<string, string>>({
        church_address: "Ayeduase Gate, KNUST, Kumasi, Ghana",
        church_phone: "+233 (0) 24 000 0000",
        church_email: "info@gracelovechapel.com",
    });
    const [services, setServices] = useState<{ id: string; name: string; time: string }[]>([
        { id: "1", name: "Sunday Celebration Service", time: "9:00 AM - 11:30 AM" },
        { id: "2", name: "Midweek Grace Encounter", time: "Wednesdays at 6:30 PM" },
        { id: "3", name: "Prophetic & Healing Service", time: "Fridays at 7:00 PM" },
    ]);

    useEffect(() => {
        async function fetchVisitData() {
            try {
                const { data: settingsData } = await supabase
                    .from("site_settings")
                    .select("key, value")
                    .in("key", ["church_address", "church_phone", "church_email"]);

                if (settingsData && settingsData.length > 0) {
                    const settingsMap = settingsData.reduce((acc, curr) => ({
                        ...acc,
                        [curr.key]: curr.value
                    }), {});
                    setSettings(prev => ({ ...prev, ...settingsMap }));
                }

                const { data: servicesData } = await supabase
                    .from("services")
                    .select("id, name, time")
                    .eq("is_active", true)
                    .order("display_order", { ascending: true });

                if (servicesData && servicesData.length > 0) setServices(servicesData);
            } catch (error) {
                console.error("Error fetching visit data:", error);
            }
        }
        fetchVisitData();
    }, []);

    const branches = [
        {
            id: "main",
            name: "Main Campus (Ayeduase - KNUST)",
            tag: "Headquarters",
            address: settings.church_address || "Ayeduase Gate, Near KNUST, Kumasi, Ghana",
            phone: settings.church_phone || "+233 (0) 24 000 0000",
            email: settings.church_email || "info@gracelovechapel.com",
            mapEmbed: "https://maps.google.com/maps?q=Ayeduase%20Gate%2C%20KNUST%2C%20Kumasi%2C%20Ghana&t=&z=15&ie=UTF8&iwloc=&output=embed",
            services: [
                { name: "Sunday Celebration Service", time: "9:00 AM - 11:30 AM", desc: "Main Sunday worship & preaching" },
                { name: "Midweek Grace Encounter", time: "Wednesdays at 6:30 PM", desc: "Interactive Bible study & prayer" },
                { name: "Prophetic & Healing Service", time: "Fridays at 7:00 PM", desc: "Intensive deliverance & prayer" },
            ]
        },
        {
            id: "city",
            name: "City Campus (Central Branch)",
            tag: "City Branch",
            address: "Kumasi City Center (Commercial Hub), Kumasi, Ghana",
            phone: "+233 (0) 24 000 0001",
            email: "city@gracelovechapel.com",
            mapEmbed: "https://maps.google.com/maps?q=Kumasi%2C%20Ghana&t=&z=14&ie=UTF8&iwloc=&output=embed",
            services: [
                { name: "Sunday Divine Encounter", time: "8:30 AM - 10:30 AM", desc: "Sunday morning spiritual uplift" },
                { name: "Midweek Word Feast", time: "Thursdays at 6:30 PM", desc: "Faith-building exposition" },
                { name: "Hour of Deliverance & Miracles", time: "Fridays at 6:30 PM", desc: "Evening of breakthrough & signs" },
            ]
        }
    ];

    const [selectedBranch, setSelectedBranch] = useState<string>("main");

    const currentBranch = branches.find(b => b.id === selectedBranch) || branches[0];

    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-primary py-20 text-center text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="mb-4 text-4xl font-bold font-heading md:text-5xl">Plan a Visit</h1>
                        <p className="mx-auto max-w-2xl text-lg opacity-90">
                            We can&apos;t wait to welcome you to Gracelove Chapel across our two branches. Here&apos;s everything you need to know.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Service Times & Location */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Branch Switcher Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex p-1.5 bg-light rounded-2xl border border-primary/10 shadow-sm max-w-full overflow-x-auto">
                            {branches.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => setSelectedBranch(b.id)}
                                    className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all whitespace-nowrap ${
                                        selectedBranch === b.id
                                            ? "bg-primary text-white shadow-md"
                                            : "text-foreground/70 hover:text-primary hover:bg-white/50"
                                    }`}
                                >
                                    {b.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-2">
                        <motion.div
                            key={currentBranch.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary flex items-center gap-3">
                                        <Clock className="w-7 h-7 text-secondary" />
                                        Service Times
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-bold bg-secondary/15 text-secondary border border-secondary/25 rounded-full uppercase tracking-wider">
                                        {currentBranch.tag}
                                    </span>
                                </div>
                                <div className="space-y-3.5">
                                    {currentBranch.services.map((service, idx) => (
                                        <div key={idx} className="p-4 bg-light rounded-2xl border border-primary/5 shadow-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                <span className="font-bold text-base sm:text-lg text-primary">{service.name}</span>
                                                <span className="text-secondary font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-secondary/10 w-max">
                                                    {service.time}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-foreground/70">{service.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-4 flex items-center gap-3">
                                    <MapPin className="w-7 h-7 text-secondary" />
                                    Location &amp; Directions
                                </h2>
                                <p className="text-base sm:text-lg text-foreground/80 mb-4 font-medium flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                                    {currentBranch.address}
                                </p>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden relative shadow-md border border-primary/10 bg-accent/10">
                                    <iframe 
                                        src={currentBranch.mapEmbed} 
                                        className="w-full h-full border-0" 
                                        allowFullScreen 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`${currentBranch.name} Location Map`}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-secondary/5 rounded-3xl p-8 lg:p-12 border border-secondary/10"
                        >
                            <h2 className="text-3xl font-bold font-heading text-primary mb-6">What to Expect</h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2 text-primary">Warm Welcome</h3>
                                        <p className="text-foreground/70">From the moment you walk through the doors, you'll be greeted by friendly faces who are glad you're here.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2 text-primary">Engaging Worship</h3>
                                        <p className="text-foreground/70">Our services feature spirit-filled praise, intimate worship, and an encounter with the presence of God.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2 text-primary">Transforming Message</h3>
                                        <p className="text-foreground/70">Each week, you'll hear practical, inspiring messages rooted in the Gospel of Grace and Love to empower your walk with Christ.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
                                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-secondary" /> Need help finding us?
                                </h4>
                                <p className="text-sm text-foreground/70 mb-4">Give us a call or send an email and we'll be happy to provide directions or answer any questions.</p>
                                <div className="space-y-2 text-sm font-medium">
                                    <p className="flex items-center gap-2 text-foreground/80"><Phone className="w-4 h-4 text-secondary" /> {settings.church_phone}</p>
                                    <p className="flex items-center gap-2 text-foreground/80"><Mail className="w-4 h-4 text-secondary" /> {settings.church_email}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
