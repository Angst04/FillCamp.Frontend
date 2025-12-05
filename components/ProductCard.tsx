"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { cardVariants, iconButtonVariants } from "@/lib/animations";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  onAddToCart: () => void;
  className?: string;
}

export default function ProductCard({
  name,
  description,
  price,
  image,
  onAddToCart,
  className = ""
}: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`bg-white rounded-xl shadow-[2px_1px_14px_0px_rgba(0,0,0,0.15)] overflow-hidden ${className}`}
    >
      <motion.div
        className="relative w-full h-44 overflow-hidden"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3 }}
      >
        <Image src={image} alt={name} fill className="object-cover rounded-t-xl" />
      </motion.div>
      <div className="p-2.5">
        <h3 className="font-bold text-[#101010] text-base mb-1">{name}</h3>
        <p className="text-xs text-[#656565] mb-3 line-clamp-2 leading-tight">{description}</p>
        <div className="flex items-center justify-between">
          <motion.span className="font-semibold text-[#0048F2] text-base" initial={{ scale: 1 }} animate={{ scale: 1 }}>
            {price}
          </motion.span>
          <motion.button
            onClick={onAddToCart}
            variants={iconButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="bg-white shadow-[2px_1px_14px_0px_rgba(0,0,0,0.15)] p-2 rounded-full"
            aria-label="Добавить в корзину"
          >
            <Plus size={20} className="text-[#0048F2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
