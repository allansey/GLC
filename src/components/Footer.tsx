"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const [settings, setSettings] = useState<Record<string, string>>({
        church_address: "Ayeduase Gate, KNUST, Kumasi, Ghana",
        church_phone: "+233 (0) 24 000 0000",
        church_email: "info@gracelovechapel.com",
        facebook_url: "https://www.facebook.com/gracelovechapel",
        instagram_url: "https://www.instagram.com/gracelovechapelgh",
        youtube_url: "https://youtube.com/@gracelovechapel",
    });
    const [services, setServices] = useState<{ id: string; name: string; time: string }[]>([]);

    useEffect(() => {
        async function fetchFooterData() {
            try {
                const { data: settingsData } = await supabase
                    .from("site_settings")
                    .select("key, value")
                    .in("key", [
                        "church_address",
                        "church_phone",
                        "church_email",
                        "facebook_url",
                        "instagram_url",
                        "youtube_url"
                    ]);

                if (settingsData) {
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

                if (servicesData) setServices(servicesData);
            } catch (error) {
                console.error("Error fetching footer data:", error);
            }
        }
        fetchFooterData();
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to subscribe');

            setStatus('success');
            setMessage(data.message);
            setEmail("");
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message);
        }
    };

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* About */}
                    <div>
                        <Link href="/" className="inline-block mb-4 hover:opacity-80" style={{ transition: "var(--transition)" }}>
                            <div className="relative h-10 w-auto">
                                <Image
                                    src="/assets/images/logo.png"
                                    alt="Gracelove Chapel"
                                    width={120}
                                    height={32}
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-primary-foreground/80 mb-6">
                            A community of believers dedicated to spreading the love of Christ and serving our neighbors.
                        </p>

                        <div className="bg-primary-foreground/10 p-4 rounded-lg backdrop-blur-sm">
                            <h4 className="font-bold font-heading mb-2 text-sm">Subscribe to our Newsletter</h4>
                            <form onSubmit={handleSubscribe} className="space-y-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded bg-white border border-gray-300 placeholder:text-gray-500 text-black focus:outline-none focus:ring-1 focus:ring-secondary"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full px-3 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                </button>
                                {message && (
                                    <p className={`text-xs ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}>
                                        {message}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold font-heading">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-secondary transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/visit" className="hover:text-secondary transition-colors">Plan a Visit</Link>
                            </li>
                            <li>
                                <Link href="/sermons" className="hover:text-secondary transition-colors">Sermons</Link>
                            </li>
                            <li>
                                <Link href="/events" className="hover:text-secondary transition-colors">Events</Link>
                            </li>
                            <li>
                                <Link href="/prayer" className="hover:text-secondary transition-colors">Prayer Wall</Link>
                            </li>
                            <li>
                                <Link href="/give" className="hover:text-secondary transition-colors">Give</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold font-heading">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-secondary" />
                                <span>{settings.church_address}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-secondary" />
                                <span>{settings.church_phone}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-secondary" />
                                <span>{settings.church_email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Service Times */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold font-heading">Service Times</h3>
                        <ul className="space-y-2 text-sm">
                            {services.map((service) => (
                                <li key={service.id}>
                                    <span className="font-semibold text-secondary">{service.name}:</span> {service.time}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex gap-4">
                            <Link href={settings.facebook_url} target="_blank" className="hover:text-secondary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href={settings.instagram_url} target="_blank" className="hover:text-secondary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href={settings.youtube_url} target="_blank" className="hover:text-secondary transition-colors">
                                <Youtube className="h-5 w-5" />
                                <span className="sr-only">YouTube</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
                    © {new Date().getFullYear()} Gracelove Chapel. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
