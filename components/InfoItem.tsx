"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { listItemVariants } from "@/lib/animations";

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

export default function InfoItem({
  icon: Icon,
  label,
  value,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100",
  className = ""
}: InfoItemProps) {
  return (
    <motion.div
      variants={listItemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ x: 4 }}
      className={`flex items-center space-x-3 ${className}`}
    >
      <motion.div
        className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}
        whileHover={{ scale: 1.15, rotate: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Icon size={20} className={iconColor} />
      </motion.div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </motion.div>
  );
}
