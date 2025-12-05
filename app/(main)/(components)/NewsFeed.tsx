"use client";

import { motion } from "motion/react";
import { listContainerVariants } from "@/lib/animations";
import NewsCard from "@/components/NewsCard";

export const NewsFeed = ({ news }: MainPageProps) => {
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
      {news.map((post) => (
        <NewsCard
          key={post.title}
          title={post.title}
          description={post.description}
          image={post.image}
          date={post.date}
        />
      ))}
    </motion.div>
  );
};
