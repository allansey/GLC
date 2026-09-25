"use client";

import MissionVisionSection from "@/components/MissionVisionSection";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Facebook, Linkedin, Mail } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  facebook_url?: string;
  linkedin_url?: string;
  email?: string;
}

const defaultStaff: Staff[] = [
  {
    id: "staff-1",
    name: "Rev. Allan Sey",
    role: "Senior Pastor & Visionary",
    bio: "Leading Gracelove Chapel with a passion for the Gospel of Grace and a heart for discipling believers to impact their generation.",
    image_url: "/assets/images/pastor2.jpeg",
  },
  {
    id: "staff-2",
    name: "Minister of Worship",
    role: "Worship Director",
    bio: "Leading the congregation into deep, spirit-filled encounters with God through heartfelt praise and worship.",
    image_url: "/assets/images/placeholder-pastor.jpg",
  },
  {
    id: "staff-3",
    name: "Youth & Campus Pastor",
    role: "Youth Ministry Lead",
    bio: "Equipping young people and university students around KNUST to stand strong in faith, character, and excellence.",
    image_url: "/assets/images/placeholder-pastor.jpg",
  },
];

export default function AboutPage() {
    const [staff, setStaff] = useState<Staff[]>(defaultStaff);

    useEffect(() => {
        async function fetchStaff() {
            try {
                const { data } = await supabase
                    .from("staff")
                    .select("*")
                    .eq("is_active", true)
                    .order("display_order", { ascending: true });

                if (data && data.length > 0) {
                    setStaff(data);
                }
            } catch (error) {
                console.error("Error fetching staff for About page:", error);
            }
        }
        fetchStaff();
    }, []);

    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-primary py-20 text-center text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="mb-4 text-4xl font-bold font-heading md:text-5xl">About Us</h1>
                    <p className="mx-auto max-w-2xl text-lg opacity-90">
                        Discover the heart, vision, and people behind Gracelove Chapel.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <MissionVisionSection />

            {/* Leadership */}
            <section className="py-20 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-center text-primary mb-12">
                        Our Leadership Team
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {staff.map((member) => (
                            <div 
                                key={member.id} 
                                className="group bg-background rounded-2xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-72 sm:h-80 overflow-hidden bg-primary/5">
                                    <Image
                                        src={member.image_url || "/assets/images/placeholder-pastor.jpg"}
                                        alt={member.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow justify-between space-y-3">
                                    <div>
                                        <h3 className="text-xl font-bold font-heading text-primary group-hover:text-secondary transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-secondary font-semibold text-sm mb-2">
                                            {member.role}
                                        </p>
                                        <p className="text-sm text-foreground/75 leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>
                                    {(member.facebook_url || member.linkedin_url || member.email) && (
                                        <div className="flex items-center gap-3 pt-3 border-t border-primary/10 text-primary">
                                            {member.facebook_url && (
                                                <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/5 hover:bg-secondary hover:text-white rounded-full transition-colors">
                                                    <Facebook className="w-4 h-4" />
                                                </a>
                                            )}
                                            {member.linkedin_url && (
                                                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/5 hover:bg-secondary hover:text-white rounded-full transition-colors">
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                            {member.email && (
                                                <a href={`mailto:${member.email}`} className="p-2 bg-primary/5 hover:bg-secondary hover:text-white rounded-full transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
