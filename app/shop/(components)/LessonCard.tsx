import { motion } from "motion/react";
import { cardVariants } from "@/lib/animations";

export const LessonCard = (props: Lesson) => {
  const { title, description, price } = props;
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <p className="text-sm text-gray-500">{price}</p>
    </motion.div>
  );
};
