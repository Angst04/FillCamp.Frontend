"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ShopHeader from "./(components)/ShopHeader";
import { motion } from "motion/react";
import { pageVariants, listContainerVariants } from "@/lib/animations";
import { MerchCard } from "./(components)/MerchCard";
import { LessonCard } from "./(components)/LessonCard";
import { ProgrammCard } from "./(components)/ProgrammCard";
import { Award, Languages, MapPin, Snowflake } from "lucide-react";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";
import { Dropdown } from "@/components/Dropdown";

export const ShopPage = ({ merch, lessons, programms }: ShopPageProps) => {
  const [category, setCatery] = useState<Category>("merch");
  const [selectedLocation, setSelectedLocation] = useState<string | "Все">("Все");
  const [selectedSeason, setSelectedSeason] = useState<string | "Все">("Все");
  const [selectedFormat, setSelectedFormat] = useState<string | "Все">("Все");
  const { data: profile } = useGetProfileQuery();

  const toKey = (value: string) => value.trim().toLowerCase();

  const uniqueLocations = Array.from(
    new Map(programms.map((item) => [toKey(item.location), item.location.trim()])).values()
  );
  const uniqueSeasons = Array.from(
    new Map(programms.map((item) => [toKey(String(item.season)), String(item.season).trim()])).values()
  );
  const uniqueFormats = Array.from(new Map(programms.map((item) => [toKey(item.lang), item.lang.trim()])).values());

  const handleResetFilters = () => {
    setSelectedLocation("Все");
    setSelectedSeason("Все");
    setSelectedFormat("Все");
  };

  const filteredProgramms = programms.filter((item) => {
    const matchesLocation = selectedLocation === "Все" || toKey(item.location) === toKey(selectedLocation);
    const matchesSeason = selectedSeason === "Все" || toKey(String(item.season)) === toKey(String(selectedSeason));
    const matchesFormat = selectedFormat === "Все" || toKey(item.lang) === toKey(selectedFormat);
    return matchesLocation && matchesSeason && matchesFormat;
  });

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
        <div className="flex flex-wrap mb-6">
          <div className="flex-1 min-w-[200px]">
            <Dropdown>
              <Dropdown.Trigger className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-medium truncate">{selectedLocation}</span>
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
          </div>

          <div className="flex-1 min-w-[200px]">
            <Dropdown>
              <Dropdown.Trigger className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Snowflake size={18} />
                </div>
                <span className="text-sm font-medium truncate">{selectedSeason}</span>
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={() => setSelectedSeason("Все")}>Все</Dropdown.Item>
                {uniqueSeasons.map((season) => (
                  <Dropdown.Item key={season} onSelect={() => setSelectedSeason(season)}>
                    {season}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Dropdown>
              <Dropdown.Trigger className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Languages size={18} />
                </div>
                <span className="text-sm font-medium truncate">{selectedFormat}</span>
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={() => setSelectedFormat("Все")}>Все</Dropdown.Item>
                {uniqueFormats.map((format) => (
                  <Dropdown.Item key={format} onSelect={() => setSelectedFormat(format)}>
                    {format}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="w-full">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleResetFilters}
              disabled={selectedLocation === "Все" && selectedSeason === "Все" && selectedFormat === "Все"}
              aria-label="Сбросить все фильтры"
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>
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
            (filteredProgramms.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <p className="text-[#101010] font-bold">По выбранным фильтрам программ не найдено</p>
                <p className="text-sm text-black/60 mt-1">Попробуйте изменить фильтры или сбросить их.</p>
              </div>
            ) : (
              filteredProgramms.map((item, index) => (
                <ProgrammCard key={`${item.season}-${item.location}-${item.lang}-${index}`} {...item} />
              ))
            ))}
        </motion.div>
      )}
    </motion.div>
  );
};
