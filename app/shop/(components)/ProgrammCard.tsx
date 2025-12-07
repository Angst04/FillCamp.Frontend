import { cardVariants } from "@/lib/animations";
import { motion } from "motion/react";
import { CustomPortableText } from "@/components/CustomPortableText";

export const ProgrammCard = (props: Programm) => {
  const { season, place, lang, description, shifts, prepaymentPrice, transferPrice } = props;
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <h3 className="text-lg font-bold mb-4">{`${season}. ${place}. ${lang}`}</h3>
      <CustomPortableText content={description} />
    </motion.div>
  );
};
