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
      className="h-full max-h-full"
      backdropClassName="bg-black/70"
    >
      <div className="h-full overflow-y-auto relative">
        <div className="relative w-full h-64 overflow-hidden  mb-6">
          <Image src={image.asset.url} alt={title} fill className="object-cover rounded-2xl" />
        </div>
        <div className="px-6 pb-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">{title}</h1>
          <div className="flex items-center space-x-1 mb-6 text-gray-600">
            <Calendar size={16} />
            <span>{new Date(date).toLocaleDateString("ru-RU")}</span>
          </div>
          <div className="prose prose-lg max-w-none">
            <CustomPortableText content={description} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
