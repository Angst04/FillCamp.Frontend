"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";
import PageHeader from "@/components/PageHeader";
import { NewsFeed } from "./(components)/NewsFeed";
import AboutCampButton from "./(components)/AboutCampButton";

export const MainPage = ({ news }: MainPageProps) => {
  const { user } = useTelegram();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto px-4 py-6"
    >
      <PageHeader
        title={`Привет, ${user?.first_name || user?.username}!`}
        description="Добро пожаловать в наше сообщество"
        emoji="👋"
      />
      <NewsFeed news={news} />
      <AboutCampButton />
    </motion.div>
  );
};
