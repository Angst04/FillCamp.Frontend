"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { cardVariants } from "@/lib/animations";
import { CustomPortableText } from "@/components/CustomPortableText";
import { NewsCardPopup } from "./NewsCardPopup";

export default function NewsCard(props: NewsPost) {
  const { title, description, image, date } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.article
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label={`Read full article: ${title}`}
        onClick={handleCardClick}
      >
        {image && (
          <motion.div
            className="relative w-full h-60 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image src={image.asset.url} alt={title} fill className="object-cover" />
          </motion.div>
        )}
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>

          <div className="mb-4 max-h-40 overflow-hidden relative">
            <CustomPortableText content={description} />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/60 via-white/50 to-transparent pointer-events-none" />
          </div>

          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(date).toLocaleDateString("ru-RU")}</span>
          </div>
        </div>
      </motion.article>
      <NewsCardPopup
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        image={image}
        title={title}
        date={date}
        description={description}
      />
    </>
  );
}
