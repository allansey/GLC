"use client";

import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone, ArrowRight, Facebook, Linkedin, Mail, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

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

interface Service {
  id: string;
  name: string;
  time: string;
  description: string;
  image_url?: string;
  branch?: string;
}

export interface BranchService {
  name: string;
  time: string;
  description: string;
}

export interface ChurchBranch {
  id: string;
  name: string;
  tag: string;
  address: string;
  phone: string;
  image_url: string;
  map_url: string;
  services: BranchService[];
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

const defaultBranches: ChurchBranch[] = [
  {
    id: "main-campus",
    name: "Main Campus (Ayeduase - KNUST)",
    tag: "Headquarters",
    address: "Ayeduase Gate, Near KNUST, Kumasi, Ghana",
    phone: "+233 (0) 24 000 0000",
    image_url: "/assets/images/worship.jpg",
    map_url: "https://maps.google.com/maps?q=Ayeduase%20Gate%2C%20KNUST%2C%20Kumasi%2C%20Ghana&t=&z=15&ie=UTF8&iwloc=&output=embed",
    services: [
      {
        name: "Sunday Celebration Service",
        time: "9:00 AM - 11:30 AM",
        description: "Spirit-filled worship, vibrant praise, and life-transforming biblical preaching.",
      },
      {
        name: "Midweek Grace Encounter",
        time: "Wednesdays at 6:30 PM",
        description: "In-depth Bible study, believers' fellowship, and interactive discipleship.",
      },
      {
        name: "Prophetic & Healing Service",
        time: "Fridays at 7:00 PM",
        description: "Intensive prayer, divine empowerment, and spiritual breakthrough.",
      },
    ],
  },
  {
    id: "city-campus",
    name: "City Campus (Central Branch)",
    tag: "City Branch",
    address: "Kumasi City Center (Commercial Hub), Kumasi, Ghana",
    phone: "+233 (0) 24 000 0001",
    image_url: "/assets/images/camp.jpg",
    map_url: "https://maps.google.com/maps?q=Kumasi%2C%20Ghana&t=&z=14&ie=UTF8&iwloc=&output=embed",
    services: [
      {
        name: "Sunday Divine Encounter",
        time: "8:30 AM - 10:30 AM",
        description: "Inspiring Sunday morning worship and profound revelation of God's Word.",
      },
      {
        name: "Midweek Word Feast",
        time: "Thursdays at 6:30 PM",
        description: "Faith-building teachings and fellowship for workers, professionals, and students.",
      },
      {
        name: "Hour of Deliverance & Miracles",
        time: "Fridays at 6:30 PM",
        description: "A consecrated evening of powerful intercession, signs, and spiritual breakthrough.",
      },
    ],
  },
];

export default function Home() {
  const [settings, setSettings] = useState<Record<string, string>>({
    mission_text: "The vision of Gracelove is to reap souls for Christ through the gospel of grace and love...",
    vision_text: "The mission of Gracelove is simple yet profound: reaping souls for Christ.",
    about_image_url: "/assets/images/faith.jpg",
  });
  const [staff, setStaff] = useState<Staff[]>(defaultStaff);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch settings
        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("key, value");

        if (settingsData) {
          const settingsMap = settingsData.reduce((acc, curr) => ({
            ...acc,
            [curr.key]: curr.value
          }), {});
          setSettings(prev => ({ ...prev, ...settingsMap }));
        }

        // Fetch staff
        const { data: staffData } = await supabase
          .from("staff")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (staffData && staffData.length > 0) {
          setStaff(staffData);
        }

        // Fetch services
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
        }

      } catch (error) {
        console.error("Error fetching CMS data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayedStaff = staff.length > 0 ? staff : defaultStaff;

  // Build the two branch models, incorporating Supabase services dynamically if present
  const branches = defaultBranches.map((branch) => {
    const branchSpecificServices = services.filter((s) => {
      if (s.branch) {
        return s.branch.toLowerCase().includes(branch.id === "main-campus" ? "main" : "city");
      }
      return branch.id === "main-campus";
    });

    if (branchSpecificServices.length > 0) {
      return {
        ...branch,
        services: branchSpecificServices.map((s) => ({
          name: s.name,
          time: s.time,
          description: s.description || "Join us for this uplifting time in God's presence.",
        })),
      };
    }
    return branch;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Our Branches & Service Times Section */}
      <section className="py-20 bg-light" id="branches">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary font-bold text-xs uppercase tracking-wider mb-4 border border-secondary/20">
              <MapPin className="w-3.5 h-3.5" /> Two Vibrant Church Branches
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4">
              Our Branches &amp; Service Times
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Gracelove Chapel gathers across two locations with tailored service times. Choose your nearest branch and join us this week!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col bg-background rounded-3xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Branch Header Banner */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-primary/10">
                  <Image
                    src={branch.image_url}
                    alt={branch.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                  {/* Branch Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary text-white shadow-md uppercase tracking-wider">
                      {branch.tag}
                    </span>
                  </div>

                  {/* Branch Header Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-1 text-white drop-shadow-sm">
                      {branch.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90">
                      <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="truncate">{branch.address}</span>
                    </p>
                  </div>
                </div>

                {/* Branch Content & Services List */}
                <div className="flex flex-col flex-1 p-6 sm:p-8 justify-between space-y-6">
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-widest text-primary/70 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary" /> Service Schedule
                    </h4>
                    <div className="space-y-3.5">
                      {branch.services.map((service, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-2xl bg-light/70 border border-primary/5 hover:border-secondary/30 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                            <h5 className="font-bold text-base sm:text-lg text-primary font-heading">
                              {service.name}
                            </h5>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/25 w-max">
                              <Clock className="w-3.5 h-3.5" /> {service.time}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/75 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Branch Action Buttons */}
                  <div className="pt-4 border-t border-primary/10 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/visit"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-sm text-sm"
                    >
                      Plan a Visit <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href={branch.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-light text-primary font-bold hover:bg-secondary/15 hover:text-secondary border border-primary/10 transition-colors text-sm"
                    >
                      <MapPin className="w-4 h-4 text-secondary" /> Get Directions
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <div id="about-us" className="scroll-mt-20">
        <MissionVisionSection
          missionText={settings.mission_text}
          visionText={settings.vision_text}
        />
      </div>

      {/* Leadership Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4">
              Our Leadership Team
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Meet the devoted shepherds and ministers guiding Gracelove Chapel into God&apos;s presence, grace, and purpose.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {displayedStaff.map((member, index) => (
              <motion.div
                key={member.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
                        <a
                          href={member.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-primary/5 hover:bg-secondary hover:text-white rounded-full transition-colors"
                          title="Facebook"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-primary/5 hover:bg-secondary hover:text-white rounded-full transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-primary/5 hover:bg-secondary hover:text-white rounded-full transition-colors"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
