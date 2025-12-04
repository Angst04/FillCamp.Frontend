"use client";

import Image from "next/image";
import { Calendar, Eye } from "lucide-react";
import { motion } from "motion/react";
import { cardVariants } from "@/lib/animations";

interface NewsCardProps {
  title: string;
  content: string;
  image?: string;
  date: string;
  views?: number;
  className?: string;
}

export default function NewsCard({ title, content, image, date, views, className = "" }: NewsCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
      {image && (
        <motion.div
          className="relative w-full h-48 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image src={image} alt={title} fill className="object-cover" />
        </motion.div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{content}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(date).toLocaleDateString("ru-RU")}</span>
          </div>
          {views !== undefined && (
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{views}</span>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
