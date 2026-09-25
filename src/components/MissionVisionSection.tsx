"use client";

import { motion } from "framer-motion";

interface MissionVisionSectionProps {
  missionText?: string;
  visionText?: string;
}

export default function MissionVisionSection({
  missionText = "Reaping souls for Christ through the gospel of grace and love, building a community of empowered believers.",
}: MissionVisionSectionProps) {
  const visionItems = [
    {
      number: "1",
      title: "REACHING OUT",
      subtitle: "TO THE WORLD WITH THE GOSPEL OF GRACE AND LOVE",
    },
    {
      number: "2",
      title: "RAISING CHRISTIANS",
      subtitle: "TO BE RELEVANT AND EXCELLENT IN THEIR GENERATION",
    },
    {
      number: "3",
      title: "RECRUITING",
      subtitle: "LABORERS FOR THE LORD",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Main Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#1b4e2e] via-[#143d23] to-[#0e2c19] text-white border border-[#2d7045]/40"
        >
          {/* Decorative background wave / circles effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Banner */}
          <div className="relative pt-10 pb-8 px-6 text-center border-b border-emerald-800/40 bg-gradient-to-r from-emerald-950/40 via-emerald-900/30 to-emerald-950/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-block uppercase tracking-widest text-xs font-semibold px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
                Gracelove Chapel
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-wide">
                OUR <span className="text-[#facc15] font-black drop-shadow-md">3R</span> VISION
              </h2>
            </motion.div>
          </div>

          <div className="p-6 sm:p-10 md:p-12 space-y-10">
            {/* Mission Highlight Box */}
            {missionText && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-emerald-950/50 border border-emerald-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-inner text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-secondary font-bold text-sm tracking-wider uppercase mb-1">
                    Our Mission
                  </h3>
                  <p className="text-emerald-100 text-lg leading-relaxed">
                    {missionText}
                  </p>
                </div>
              </motion.div>
            )}

            {/* The 3R Pillars List */}
            <div className="space-y-6 md:space-y-8">
              {visionItems.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
                >
                  <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    {/* Circle Badge with Number */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#facc15] bg-[#143d23] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <span className="text-2xl sm:text-3xl font-black text-[#facc15]">
                        {item.number}
                      </span>
                    </div>

                    {/* Vertical Divider Accent on Desktop */}
                    <div className="hidden sm:block w-1 h-14 bg-gradient-to-b from-[#facc15] to-emerald-600/50 rounded-full flex-shrink-0" />

                    {/* Content Text */}
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xl sm:text-2xl font-extrabold tracking-wide text-white group-hover:text-[#facc15] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-base sm:text-lg font-medium text-emerald-100/90 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Divider between items */}
                  {index < visionItems.length - 1 && (
                    <div className="my-3 sm:my-4 border-b border-emerald-800/30 w-full" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Accent Footer */}
          <div className="py-4 px-6 bg-emerald-950/80 text-center border-t border-emerald-800/30">
            <p className="text-xs text-emerald-300/70 uppercase tracking-widest font-semibold">
              Reaching • Raising • Recruiting
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
