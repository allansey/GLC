"use client";

import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import Image from "next/image";
import { Clock, Facebook, Linkedin, Mail } from "lucide-react";
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
}

const defaultServices: Service[] = [
  {
    id: "default-1",
    name: "Sunday Celebration Service",
    time: "9:00 AM - 11:30 AM",
    description: "Join us for our main Sunday gathering featuring vibrant praise, intimate worship, and inspiring biblical preaching.",
    image_url: "/assets/images/worship.jpg",
  },
  {
    id: "default-2",
    name: "Midweek Grace Encounter",
    time: "Wednesdays at 6:30 PM",
    description: "Deep dive into God's word, interactive Bible study, and focused prayer to recharge your spiritual walk.",
    image_url: "/assets/images/midweek.jpeg",
  },
  {
    id: "default-3",
    name: "Prophetic & Healing Service",
    time: "Fridays at 7:00 PM",
    description: "A night of intensive prayer, spiritual breakthrough, deliverance, and divine empowerment.",
    image_url: "/assets/images/prophetic.jpeg",
  },
];

export default function Home() {
  const [settings, setSettings] = useState<Record<string, string>>({
    mission_text: "The vision of Gracelove is to reap souls for Christ through the gospel of grace and love...",
    vision_text: "The mission of Gracelove is simple yet profound: reaping souls for Christ.",
    about_image_url: "/assets/images/faith.jpg",
  });
  const [staff, setStaff] = useState<Staff[]>([]);
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

        if (staffData) setStaff(staffData);

        // Fetch services
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (servicesData) setServices(servicesData);

      } catch (error) {
        console.error("Error fetching CMS data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayedServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Our Services */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4">Our Services</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join us for powerful times of worship, fellowship, and encounter with God
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {displayedServices.map((service, index) => {
              const fallbackImage =
                index % 3 === 0
                  ? "/assets/images/worship.jpg"
                  : index % 3 === 1
                  ? "/assets/images/midweek.jpeg"
                  : "/assets/images/prophetic.jpeg";
              const imageUrl = service.image_url || fallbackImage;

              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col h-full bg-background rounded-2xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card Image Frame: fixed height, covers frame flush, centered and responsive */}
                  <div className="relative w-full h-56 sm:h-60 overflow-hidden flex-shrink-0 bg-primary/5 rounded-t-2xl">
                    <Image
                      src={imageUrl}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  {/* Card Content: uniform padding and consistent spacing */}
                  <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 text-secondary font-semibold text-sm">
                        <Clock className="w-4 h-4 flex-shrink-0 text-secondary" />
                        <span>{service.time}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-primary leading-snug group-hover:text-secondary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-foreground/75 text-sm sm:text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-heading text-center text-primary mb-12"
          >
            Our Leadership
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {staff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-background rounded-2xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-xl"
                style={{ transition: "var(--transition)" }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image_url || "/assets/images/placeholder-pastor.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with social icons - shows on hover */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4"
                    style={{ transition: "var(--transition)" }}>
                    {member.facebook_url && (
                      <a href={member.facebook_url} target="_blank" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-secondary"
                        style={{ transition: "var(--transition)" }}>
                        <Facebook className="w-5 h-5 text-primary" />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-secondary"
                        style={{ transition: "var(--transition)" }}>
                        <Linkedin className="w-5 h-5 text-primary" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-secondary"
                        style={{ transition: "var(--transition)" }}>
                        <Mail className="w-5 h-5 text-primary" />
                      </a>
                    )}
                  </div>
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-transparent p-6">
                    <h3 className="text-2xl font-bold font-heading text-white">{member.name}</h3>
                    <p className="text-secondary font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-foreground/70">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
