import { motion } from "motion/react";
import { cardVariants } from "@/lib/animations";
import { useState } from "react";
import { LessonModal } from "./LessonModal";

export const LessonCard = (props: Lesson) => {
  const { title, description, price } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer"
        onClick={handleCardClick}
      >
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <p className="text-sm font-bold text-[var(--color-secondary)]">{price} ₽</p>
      </motion.div>
      <LessonModal isOpen={isModalOpen} handleCloseModal={handleCloseModal} lesson={props} />
    </>
  );
};
