'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { maskReveal, containerStagger, itemStagger, textReveal } from '@/lib/motion-variants';

export function FadeUp({ children, className = '', style, id }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, id?: string }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '', style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <motion.div
      variants={containerStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <motion.div variants={itemStagger} className={className} style={style}>
      {children}
    </motion.div>
  );
}

export function MaskReveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        variants={maskReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function TextReveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={textReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ target, suffix = '', className = '' }: { target: number, suffix?: string, className?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const duration = 2000;
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, target]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}
