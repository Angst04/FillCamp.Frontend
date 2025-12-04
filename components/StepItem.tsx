"use client";

import { motion } from "motion/react";
import { listItemVariants } from "@/lib/animations";

interface StepItemProps {
  number: number;
  title: string;
  description: string;
  color?: string;
  bgColor?: string;
  className?: string;
}

export default function StepItem({
  number,
  title,
  description,
  color = "text-blue-600",
  bgColor = "bg-blue-100",
  className = ""
}: StepItemProps) {
  return (
    <motion.div
      variants={listItemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ x: 4 }}
      className={`flex items-start space-x-3 ${className}`}
    >
      <motion.div
        className={`w-8 h-8 ${bgColor} ${color} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {number}
      </motion.div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}
