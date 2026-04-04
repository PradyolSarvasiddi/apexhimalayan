"use client"

import React from 'react';
import { motion } from "framer-motion";

// --- Types ---
interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

// --- Data (Apex Himalayan Rides - Himalayan Riders) ---
const testimonials: Testimonial[] = [
  {
    text: "Conquering Khardung La with the Apex team was an absolute dream. The bikes were top-notch and the road assistance was flawless.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Alex Thompson",
    role: "Solo Rider",
  },
  {
    text: "The best managed Spiti Valley tour I've ever been part of. Their local knowledge of the terrain is unparalleled.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Bilal Ahmed",
    role: "Adv Enthusiast",
  },
  {
    text: "Highest passes, highest safety standards. They had oxygen and an expert mechanic for every mile of the Ladakh circuit.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Saman Malik",
    role: "Pro Tourer",
  },
  {
    text: "Stunning camps in Sarchu and Pang. They really know where the magic happens in these mountains. Highly recommend.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sana Sheikh",
    role: "Photographer",
  },
  {
    text: "Unforgettable 12-day journey. From permits to high-altitude prep, everything was handled professionally and with heart.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Zainab Hussain",
    role: "Trekker",
  },
  {
    text: "If you want an authentic Himalayan experience with zero stress, Apex Himalayan Rides is the only choice. Humble crew.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Aliza Khan",
    role: "Group Lead",
  },
  {
    text: "The crew's passion for the Himalayas is infectious. Best trip of my life, every mile was a new discovery.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Farhan Siddiqui",
    role: "Bullet Rider",
  },
  {
    text: "Premium bikes, expert mechanics, and hidden trails that typical tours miss. Simply incredible value.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Hassan Ali",
    role: "Moto-blogger",
  },
  {
    text: "A perfect balance of grit and luxury. Can't wait to ride with them again next season across the Spiti circuit.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Briana Patton",
    role: "Adventure Racer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <motion.li 
                key={`${index}-${i}`}
                aria-hidden={index === 1 ? "true" : "false"}
                tabIndex={index === 1 ? -1 : 0}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  boxShadow: "var(--shadow-rust)",
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                className="p-8 rounded-[2rem] border border-border/80 shadow-[var(--shadow-card)] w-full bg-bg-card transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-accent-orange/30 overflow-hidden" 
              >
                <blockquote className="m-0 p-0">
                  <p className="text-text-secondary leading-relaxed font-medium m-0 transition-colors duration-300 italic">
                    "{text}"
                  </p>
                  <footer className="flex items-center gap-4 mt-8">
                    <img
                      width={48}
                      height={48}
                      src={image}
                      alt={`Avatar of ${name}`}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-border/50 group-hover:ring-accent-gold/50 transition-all duration-300 ease-in-out"
                    />
                    <div className="flex flex-col">
                      <cite className="font-black not-italic tracking-tight leading-5 text-text-primary uppercase text-sm">
                        {name}
                      </cite>
                      <span className="text-[10px] leading-5 tracking-[0.2em] font-bold text-accent-gold/80 uppercase mt-0.5">
                        {role}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </motion.li>
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  );
};

export const TestimonialsSectionV2 = () => {
  return (
    <section 
      aria-labelledby="testimonials-heading"
      className="bg-transparent py-32 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full px-0 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mb-24 text-center px-4">
          <div className="flex justify-center">
            <div className="border border-border/60 py-1.5 px-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold bg-bg-secondary/50 backdrop-blur-sm">
              Voices of Riders
            </div>
          </div>

          <h2 id="testimonials-heading" className="text-4xl md:text-6xl font-black tracking-tight mt-6 text-text-primary uppercase">
            TRUSTED BY EXPLORERS
          </h2>
          <p className="mt-6 text-text-secondary text-lg leading-relaxed max-w-lg mx-auto">
            Discover why hundreds of riders from across the globe choose Apex Himalayan Rides for their mountain expeditions.
          </p>
        </div>

        <div 
          className="flex justify-center gap-8 mt-20 [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,1)_15%,rgba(0,0,0,1)_85%,transparent)] max-h-[800px] overflow-hidden px-4 md:px-8"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} className="flex-1 max-w-[400px]" duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block flex-1 max-w-[400px]" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block flex-1 max-w-[400px]" duration={17} />
        </div>
      </motion.div>
    </section>
  );
};
