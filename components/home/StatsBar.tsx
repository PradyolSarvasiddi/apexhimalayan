'use client';

import { motion } from 'framer-motion';
import { Counter } from '@/components/ui/motion-wrappers';

export default function StatsBar() {
  const items = [
    { target: 200, suffix: '+', label: 'Expeditions' },
    { target: 8, suffix: '', label: 'Years Experience' },
    { target: 15, suffix: '', label: 'Destinations' },
    { target: 500, suffix: '+', label: 'Riders' },
  ];

  return (
    <div className="stats-bar">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="stat-item"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Counter target={item.target} suffix={item.suffix} className="stat-item__num" />
          <div className="stat-item__label">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
