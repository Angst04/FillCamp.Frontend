import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { motion } from "motion/react";
import { fadeInVariants } from "@/lib/animations";
import { useState } from "react";
import { Minus, PlusIcon } from "lucide-react";
import { useTelegram } from "@/context/TelegramProvider";
import { calculateFinalPrice } from "@/lib/utils";
import { usePostOrderMutation } from "@/api/hooks/shop/usePostOrderMutation";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";
import { useQueryClient } from "@tanstack/react-query";

interface LessonModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  lesson: Lesson;
}

export const LessonModal = ({ isOpen, handleCloseModal, lesson }: LessonModalProps) => {
  const { title, description, price } = lesson;
  const [quantity, setQuantity] = useState(1);
  const [useBonus, setUseBonus] = useState(false);
  const { webApp } = useTelegram();
  const { data: profile } = useGetProfileQuery();
  const { mutate: createOrder, isPending } = usePostOrderMutation();
  const queryClient = useQueryClient();

  const bonusBalance = profile?.data?.bonus_balance ?? 0;

  const purchase = async () => {
    const finalTotal = calculateFinalPrice({
      price,
      quantity,
      bonusPoints: bonusBalance,
      useBonus
    });

    const bonusUsed = useBonus ? Math.min(bonusBalance, price * quantity) : 0;

    createOrder(
      {
        params: {
          items: [
            {
              lesson: {
                title,
                description,
                price
              },
              quantity
            }
          ],
          pay_with_bonus: useBonus,
          price: finalTotal,
          bonuses: bonusUsed
        },
        config: {}
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          setQuantity(1);
          setUseBonus(false);
          handleCloseModal();
          // Показываем успех только после ответа сервера
          if (webApp) {
            webApp.showPopup({
              title: "Успех! 🎉",
              message: "Покупка успешно совершена!"
            });
          }
        },
        onError: (error: any) => {
          // Правильная обработка ошибок сервера
          const errorMessage = error?.error?.detail || error?.message || "Не удалось совершить покупку. Попробуйте еще раз.";
          if (webApp) {
            webApp.showPopup({
              title: "Ошибка",
              message: errorMessage
            });
          }
        }
      }
    );
  };

  const handleQuantityChange = (delta: number) => {
    if (quantity + delta < 1) return;
    if (quantity + delta > 10) return;
    setQuantity(quantity + delta);
  };

  const isMax = quantity >= 10;
  const isMin = quantity <= 1;

  const finalPrice = calculateFinalPrice({
    price,
    quantity,
    bonusPoints: bonusBalance,
    useBonus
  });

  return (
    <Modal
      closeOnBackdropClick
      closeOnEscape
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="xl"
      className="max-h-[85vh] flex flex-col"
      backdropClassName="bg-black/70"
    >
      <motion.div variants={fadeInVariants} initial="initial" animate="animate" className="flex flex-col gap-6">
        {/* Lesson Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-base md:text-lg text-gray-600 leading-relaxed">{description}</p>}
          <div className="flex flex-row items-center justify-between">
            <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)]">{price} ₽</p>

            <div className="flex flex-row items-center gap-4">
              <Button variant="icon" onClick={() => handleQuantityChange(-1)} className="w-15" disabled={isMin}>
                <Minus size={16} className="mx-auto" />
              </Button>
              <span className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)]">{quantity}</span>
              <Button variant="icon" onClick={() => handleQuantityChange(1)} className="w-15" disabled={isMax}>
                <PlusIcon size={16} className="mx-auto" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buy Button */}
      <div className="pt-4 mt-4">
        <div className="flex flex-row items-end justify-between border border-gray-300 bg-gray-50/50 rounded-xl p-5 gap-4">
          <label className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
            <input
              type="checkbox"
              className="w-5 h-5 border-2 border-gray-600 rounded-full cursor-pointer accent-[var(--color-secondary)] checked:bg-[var(--color-secondary)] checked:border-[var(--color-secondary)] transition-all"
              checked={useBonus}
              onChange={() => setUseBonus(!useBonus)}
            />
            <span className="text-base font-medium text-gray-700 select-none">
              Использовать баллы? ({bonusBalance})
            </span>
          </label>
        </div>
        <div className="text-right p-4">
          <span className="text-2xl font-bold text-[var(--color-secondary)]">
            Итого: <span className="text-3xl">{finalPrice} ₽</span>
          </span>
        </div>
        <Button variant="primary" onClick={purchase} disabled={isPending}>
          {isPending ? "Обработка..." : "Купить"}
        </Button>
      </div>
    </Modal>
  );
};
