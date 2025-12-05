"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";
import PageHeader from "@/components/PageHeader";
import NewsFeed, { type NewsPost } from "./(components)/NewsFeed";
import AboutCampButton from "./(components)/AboutCampButton";

// Моковые данные для примера
const mockNews: NewsPost[] = [
  {
    id: 1,
    title: "Открытие летнего сезона 2025!",
    content:
      "Мы рады объявить об открытии нового летнего сезона! Приглашаем всех желающих присоединиться к нашим программам и активностям.",
    image: "https://images.unsplash.com/photo-1533417177250-34e0c7ce7ec5?w=800&h=400&fit=crop",
    date: "2025-11-01",
    views: 234
  },
  {
    id: 2,
    title: "Новые активности и программы",
    content:
      "В этом сезоне мы подготовили для вас множество новых активностей: спортивные мероприятия, творческие мастерские, образовательные программы и многое другое!",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&h=400&fit=crop",
    date: "2025-10-28",
    views: 189
  },
  {
    id: 3,
    title: "Специальное предложение для друзей",
    content:
      "Приведи друга и получи бонусы! Участвуй в реферальной программе и зарабатывай баллы, которые можно потратить в нашем магазине.",
    date: "2025-10-25",
    views: 156
  }
];

export default function Home() {
  const { user } = useTelegram();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto px-4 py-6"
    >
      <PageHeader title={`Привет, ${user?.first_name}!`} description="Добро пожаловать в наше сообщество" emoji="👋" />
      <NewsFeed news={mockNews} />
      <AboutCampButton />
    </motion.div>
  );
}
