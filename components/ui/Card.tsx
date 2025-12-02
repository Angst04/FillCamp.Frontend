'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cardVariants } from '@/lib/animations';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

