'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideIn, scaleIn, staggerContainer, staggerItem } from '@/lib/animations/variants';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'stagger';
  staggerItems?: boolean;
  custom?: 'forward' | 'backward';
}

export const AnimatedContainer = ({
  children,
  className = '',
  variant = 'fade',
  staggerItems = false,
  custom = 'forward',
}: AnimatedContainerProps) => {
  const getVariants = () => {
    const baseVariants = {
      fade: fadeIn,
      slide: slideIn,
      scale: scaleIn,
      stagger: staggerContainer,
    };

    if (custom === 'backward' && variant === 'slide') {
      // Only apply directional changes to slide animations
      return {
        ...slideIn,
        hidden: {
          ...slideIn.hidden,
          x: slideIn.hidden.x ? -slideIn.hidden.x : 0,
        },
        exit: {
          ...slideIn.exit,
          x: slideIn.exit.x ? -slideIn.exit.x : 0,
        },
      };
    }

    return baseVariants[variant];
  };

  if (staggerItems) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={staggerContainer}
          className={className}
        >
          {React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={staggerItem}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={getVariants()}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}; 