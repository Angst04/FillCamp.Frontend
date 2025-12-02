'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cardVariants, counterVariants } from '@/lib/animations';

interface BalanceDisplayProps {
  icon: LucideIcon;
  label: string;
  amount: number;
  gradient?: string;
  className?: string;
}

export default function BalanceDisplay({
  icon: Icon,
  label,
  amount,
  gradient = 'from-yellow-400 to-orange-500',
  className = '',
}: BalanceDisplayProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`bg-gradient-to-r ${gradient} rounded-2xl p-4 text-white flex items-center justify-between ${className}`}
    >
      <motion.div
        className="flex items-center space-x-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div whileHover={{ rotate: 15, scale: 1.2 }}>
          <Icon size={24} />
        </motion.div>
        <span className="font-semibold">{label}</span>
      </motion.div>
      <motion.span
        className="text-2xl font-bold"
        variants={counterVariants}
        animate="increase"
        key={amount}
      >
        {amount.toLocaleString()}
      </motion.span>
    </motion.div>
  );
}

