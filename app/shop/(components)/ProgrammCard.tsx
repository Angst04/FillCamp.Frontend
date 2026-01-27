import { cardVariants } from "@/lib/animations";
import { motion } from "motion/react";
import { CustomPortableText } from "@/components/CustomPortableText";
import { useState } from "react";
import { ProgrammModal } from "./ProgrammModal";
import Image from "next/image";
import { useUserQuery } from "@/api/hooks/user/useUserQuery";

export const ProgrammCard = (props: Programm) => {
  const { season, location, lang, description, image } = props;
  const { user } = useUserQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (user?.role === "child") return null;
    else setIsModalOpen(true);
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
        <Image
          src={image.asset.url}
          alt={image.alt || `${season}. ${location}. ${lang}`}
          width={image.asset.metadata.dimensions.width}
          height={image.asset.metadata.dimensions.height}
          className="object-cover rounded-2xl w-full mb-4"
        />
      </motion.div>
      <ProgrammModal isOpen={isModalOpen} handleCloseModal={handleCloseModal} programm={props} />
    </>
  );
};
