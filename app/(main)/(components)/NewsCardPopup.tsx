import { CustomPortableText } from "@/components/CustomPortableText";
import { Modal } from "@/components/ui/Modal";
import { Calendar } from "lucide-react";
import Image from "next/image";

export const NewsCardPopup = ({
  isModalOpen,
  handleCloseModal,
  image,
  title,
  date,
  description
}: NewsCardPopupProps) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      size="xl"
      className="max-h-[90vh] flex flex-col"
      backdropClassName="bg-black/70"
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="relative w-full h-64 overflow-hidden mb-6">
          <Image src={image.asset.url} alt={title} fill className="object-cover rounded-2xl" />
        </div>

        <div className="pb-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">{title}</h1>
          <div className="flex items-center space-x-1 mb-6 text-gray-600">
            <Calendar size={16} />
            <span>{new Date(date).toLocaleDateString("ru-RU")}</span>
          </div>
          <CustomPortableText content={description} />
        </div>
      </div>
    </Modal>
  );
};
