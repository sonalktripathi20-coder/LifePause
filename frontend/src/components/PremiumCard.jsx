import React from 'react';
import { motion } from 'framer-motion';

export const PremiumCard = ({ children, className = '', hoverGlow = 'cyan', delay = 0 }) => {
  const glowClasses = {
    cyan: 'hover:shadow-glow-cyan hover:border-brand-neon/30',
    indigo: 'hover:shadow-glow-indigo hover:border-brand-accent/30',
    alert: 'hover:shadow-glow-alert hover:border-brand-alert/30',
    none: ''
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass rounded-2xl p-6 transition-all duration-300 ${glowClasses[hoverGlow]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PremiumCard;
