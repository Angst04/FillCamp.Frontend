import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { motion } from "motion/react";
import { fadeInVariants } from "@/lib/animations";
import { useState } from "react";
import { Minus, PlusIcon } from "lucide-react";
import { useTelegram } from "@/context/TelegramProvider";
import { calculateFinalPrice } from "@/lib/utils";
import { usePostOrderMutation } from "@/api/hooks/shop/usePostOrderMutation";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";
import { useQueryClient } from "@tanstack/react-query";

interface MerchModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  merch: Merch;
}

export const MerchModal = ({ isOpen, handleCloseModal, merch }: MerchModalProps) => {
  const { title, price, image } = merch;
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
              merch: {
                title,
                price,
                image: image.asset.url
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
        onSuccess: (data: PostOrdersResponse | undefined) => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          setQuantity(1);
          setUseBonus(false);
          handleCloseModal();

          // Если есть payment_url, перенаправляем на страницу оплаты
          if (data?.payment_url) {
            if (webApp) {
              webApp.openLink(data.payment_url);
            } else {
              window.location.href = data.payment_url;
            }
          } else {
            // Показываем успех только после ответа сервера (для оплаты бонусами)
            if (webApp) {
              webApp.showPopup({
                title: "Успех! 🎉",
                message: "Покупка успешно совершена!"
              });
            }
          }
        },
        onError: (error: any) => {
          // Правильная обработка ошибок сервера
          const errorMessage =
            error?.error?.detail || error?.message || "Не удалось совершить покупку. Попробуйте еще раз.";
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

  const maxBonusWriteOff = price * quantity;

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
      <motion.div
        variants={fadeInVariants}
        initial="initial"
        animate="animate"
        className="flex flex-row justify-between"
      >
        {/* Product Image */}
        <div className="relative w-1/2 aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <Image src={image.asset.url} alt={image.alt || title} fill className="object-cover rounded-2xl" priority />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-right">{title}</h1>
          <div className="flex flex-col gap-2">
            <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] text-right">{price} ₽</p>

            <div className="flex flex-row items-center justify-end gap-4">
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
          <label className="w-full flex items-center justify-between cursor-pointer group hover:opacity-80 transition-opacity">
            <input
              type="checkbox"
              className="w-5 h-5 border-2 border-gray-600 rounded-full cursor-pointer accent-[var(--color-secondary)] checked:bg-[var(--color-secondary)] checked:border-[var(--color-secondary)] transition-all"
              checked={useBonus}
              disabled={bonusBalance <= 0}
              onChange={() => setUseBonus(!useBonus)}
            />
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-700 select-none text-right">
                Использовать баллы? ({bonusBalance})
              </span>
              <span className="text-right text-xs">Можно списать до <span className="text-[var(--color-primary)]">{maxBonusWriteOff}</span> баллов</span></div>
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
