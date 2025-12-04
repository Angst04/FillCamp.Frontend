"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { cardVariants } from "@/lib/animations";

interface GradientCardProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
}

export default function GradientCard({
  children,
  gradient = "from-blue-500 to-purple-600",
  className = ""
}: GradientCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 text-white ${className}`}
    >
      {children}
    </motion.div>
  );
}
