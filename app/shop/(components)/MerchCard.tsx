import { cardVariants } from "@/lib/animations";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { MerchModal } from "./MerchModal";
import { useUserQuery } from "@/api/hooks/user/useUserQuery";

export const MerchCard = (props: Merch) => {
  const { title, price, image } = props;
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
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-2xl shadow-sm p-6"
      onClick={handleCardClick}
    >
      <Image
        src={image.asset.url}
        alt={title}
        width={image.asset.metadata.dimensions.width}
        height={image.asset.metadata.dimensions.height}
        className="object-cover rounded-2xl w-full mb-4"
      />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm font-bold text-[var(--color-secondary)]">{price}</p>
      <MerchModal isOpen={isModalOpen} handleCloseModal={handleCloseModal} merch={props} />
    </motion.div>
  );
};
