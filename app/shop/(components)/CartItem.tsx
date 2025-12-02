'use client';

import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { listItemVariants, counterVariants } from '@/lib/animations';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <motion.div
      variants={listItemVariants}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4"
    >
      <motion.div
        className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl"
        whileHover={{ scale: 1.1 }}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </motion.div>
      <div className="flex-1">
        <h3 className="font-semibold text-[#101010]">
          {name}
        </h3>
        <p className="text-sm text-[#656565]">
          {price} бонусов
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={() => onUpdateQuantity(id, -1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          aria-label="Уменьшить количество"
        >
          <Minus size={16} />
        </motion.button>
        <motion.span
          className="w-8 text-center font-semibold"
          variants={counterVariants}
          animate="increase"
          key={quantity}
        >
          {quantity}
        </motion.span>
        <motion.button
          onClick={() => onUpdateQuantity(id, 1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 bg-[#0048F2] text-white rounded-full flex items-center justify-center"
          aria-label="Увеличить количество"
        >
          <Plus size={16} />
        </motion.button>
      </div>
      <motion.button
        onClick={() => onRemove(id)}
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="text-[#ED0000]"
        aria-label="Удалить из корзины"
      >
        <Trash2 size={20} />
      </motion.button>
    </motion.div>
  );
}

