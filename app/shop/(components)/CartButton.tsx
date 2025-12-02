'use client';

import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { iconButtonVariants, badgeVariants } from '@/lib/animations';

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
  className?: string;
}

export default function CartButton({
  itemCount,
  onClick,
  className = '',
}: CartButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      variants={iconButtonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`relative bg-[#0048F2] text-white p-4 rounded-full shadow-lg ${className}`}
      aria-label="Открыть корзину"
    >
      <motion.div
        animate={itemCount > 0 ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <ShoppingBag size={28} strokeWidth={2} />
      </motion.div>
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute -top-1 -right-1 bg-[#ED0000] text-white text-xs font-normal rounded-full w-[18px] h-[18px] flex items-center justify-center"
          >
            {itemCount}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

