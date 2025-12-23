"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ShopHeader from "./(components)/ShopHeader";
import { motion } from "motion/react";
import { pageVariants, listContainerVariants } from "@/lib/animations";
import { MerchCard } from "./(components)/MerchCard";
import { LessonCard } from "./(components)/LessonCard";
import { ProgrammCard } from "./(components)/ProgrammCard";
import { Award, Filter } from "lucide-react";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";
import { Dropdown } from "@/components/Dropdown";

export const ShopPage = ({ merch, lessons, programms }: ShopPageProps) => {
  const [category, setCatery] = useState<Category>("merch");
  const [selectedLocation, setSelectedLocation] = useState<string>("Все");
  const { data: profile } = useGetProfileQuery();
  const uniqueLocations = [...new Set(programms.map((item) => item.location))];

  const filteredProgramms =
    selectedLocation !== "Все" ? programms.filter((item) => item.location === selectedLocation) : programms;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto px-4 py-6 pb-20 min-h-screen"
    >
      {/* Заголовок и Корзина */}
      <div className="flex items-start justify-between mb-6">
        <ShopHeader title="Магазин 🛍️" description="Обменяй бонусы на призы" />
      </div>

      {/* Баланс */}
      <motion.div
        className="bg-white rounded-[18px] p-4 flex items-center justify-between mb-6 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
            <Award size={26} className="text-[#ED0000]" />
          </motion.div>
          <span className="font-bold text-[#101010] text-xl">Ваш баланс:</span>
        </div>
        <motion.span
          className="text-[32px] font-bold text-[#ED0000]"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {profile?.data?.bonus_balance ?? 0}
        </motion.span>
      </motion.div>

      {/* Селектор категорий */}
      <motion.div className="flex items-center justify-center mb-6 gap-2">
        <Button
          variant={category === "merch" ? "primary" : "secondary"}
          onClick={() => setCatery("merch")}
          className="w-full"
        >
          Мерч
        </Button>
        <Button
          variant={category === "lessons" ? "primary" : "secondary"}
          onClick={() => setCatery("lessons")}
          className="w-full"
        >
          Уроки
        </Button>
        <Button
          variant={category === "programms" ? "primary" : "secondary"}
          onClick={() => setCatery("programms")}
          className="w-full"
        >
          Программы
        </Button>
      </motion.div>
      {category === "programms" && (
        <Dropdown>
          <Dropdown.Trigger>
            <Filter size={20} />
            {selectedLocation}
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onSelect={() => setSelectedLocation("Все")}>Все</Dropdown.Item>
            {uniqueLocations.map((location) => (
              <Dropdown.Item key={location} onSelect={() => setSelectedLocation(location)}>
                {location}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/* Каталог товаров */}
      {category === "merch" ? (
        <motion.div
          variants={listContainerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-4"
        >
          {merch.map((item) => (
            <MerchCard key={item.title} {...item} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={listContainerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4"
        >
          {category === "lessons" && lessons.map((item) => <LessonCard key={item.title} {...item} />)}
          {category === "programms" &&
            filteredProgramms.map((item, index) => (
              <ProgrammCard key={`${item.season}-${item.location}-${item.lang}-${index}`} {...item} />
            ))}
        </motion.div>
      )}
    </motion.div>
  );
};
