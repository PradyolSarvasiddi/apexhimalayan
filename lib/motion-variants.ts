export const TRANSITION_PREMIUM = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };
export const TRANSITION_SPRING = { type: 'spring', stiffness: 200, damping: 20 };

export const maskReveal = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: TRANSITION_PREMIUM }
};

export const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

export const itemStagger = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_PREMIUM }
};

export const textReveal = {
  hidden: { opacity: 0, y: 20, rotateX: 10 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: TRANSITION_PREMIUM }
};
