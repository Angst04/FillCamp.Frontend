import { cardVariants } from "@/lib/animations";
import { motion } from "motion/react";
import { CustomPortableText } from "@/components/CustomPortableText";
import { useState } from "react";
import { ProgrammModal } from "./ProgrammModal";

export const ProgrammCard = (props: Programm) => {
  const { season, location, lang, description } = props;
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
        <h3 className="text-lg font-bold mb-4">{`${season}. ${location}. ${lang}`}</h3>
        <CustomPortableText content={description} />
      </motion.div>
      <ProgrammModal isOpen={isModalOpen} handleCloseModal={handleCloseModal} programm={props} />
    </>
  );
};
