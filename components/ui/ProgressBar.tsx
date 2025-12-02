'use client';

import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  max: number;
  gradient?: string;
  height?: string;
  className?: string;
}

export default function ProgressBar({
  current,
  max,
  gradient = 'from-yellow-400 to-yellow-500',
  height = 'h-4',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden ${className}`}>
      <motion.div
        className={`bg-gradient-to-r ${gradient} h-full rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
        }}
      />
    </div>
  );
}

