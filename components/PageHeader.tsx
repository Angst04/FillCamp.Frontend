"use client";

import { motion } from "motion/react";

interface PageHeaderProps {
  title: string;
  description?: string;
  emoji?: string;
  centered?: boolean;
  className?: string;
  textColor?: string;
}

export default function PageHeader({
  title,
  description,
  emoji,
  centered = false,
  className = "",
  textColor = "text-black"
}: PageHeaderProps) {
  const alignClass = centered ? "text-center" : "";

  return (
    <motion.div
      className={`mb-6 ${alignClass} ${className} ${textColor}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="text-2xl font-bold mb-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        {title}{" "}
        {emoji && (
          <motion.span
            className="inline-block"
            animate={{
              rotate: [0, 10, -10, 10, 0]
            }}
            transition={{
              duration: 0.5,
              delay: 0.3
            }}
          >
            {emoji}
          </motion.span>
        )}
      </motion.h1>
      {description && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
