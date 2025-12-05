"use client";

import { motion } from "motion/react";
import { listContainerVariants } from "@/lib/animations";

export interface NewsPost {
  title: string;
  description: string;
  date: string;
  image?: string;
}

interface NewsFeedProps {
  news: NewsPost[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <motion.div variants={listContainerVariants} initial="initial" animate="animate" className="space-y-4">
      <motion.h2
        className="text-xl font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Новости и объявления
      </motion.h2>
    </motion.div>
  );
};

export default NewsFeed;
