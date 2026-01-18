import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { motion } from "motion/react";
import { fadeInVariants } from "@/lib/animations";
import { useState } from "react";
import { useTelegram } from "@/context/TelegramProvider";
import { calculateFinalPrice } from "@/lib/utils";
import { CustomPortableText } from "@/components/CustomPortableText";
import { usePostOrderMutation } from "@/api/hooks/shop/usePostOrderMutation";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";
import { useQueryClient } from "@tanstack/react-query";

interface ProgrammModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  programm: Programm;
}

type TransferType = "both-ways" | "one-way" | "no";

export const ProgrammModal = ({ isOpen, handleCloseModal, programm }: ProgrammModalProps) => {
  const { season, location, lang, description, shifts, prepaymentPrice, transferPrice, bonusWriteOff, bonusCashBack } =
    programm;
  const [useBonus, setUseBonus] = useState(false);
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [paymentType, setPaymentType] = useState<"prepayment" | "full">("full");
  const [transfer, setTransfer] = useState<TransferType>("no");
  const { webApp } = useTelegram();
  const { data: profile } = useGetProfileQuery();
  const { mutate: createOrder, isPending } = usePostOrderMutation();
  const queryClient = useQueryClient();

  const bonusBalance = profile?.data?.bonus_balance ?? 0;

  const selectedShift = shifts && shifts.length > 0 ? shifts[selectedShiftIndex] : null;
  const basePrice = selectedShift ? selectedShift.price : 0;

  // Calculate transfer cost based on selected transfer type
  const transferCost = transfer === "both-ways" ? transferPrice * 2 : transfer === "one-way" ? transferPrice : 0;

  const totalPrice = (paymentType === "prepayment" ? prepaymentPrice : basePrice) + transferCost;

  const purchase = async () => {
    if (!selectedShift) {
      if (webApp) {
        webApp.showPopup({
          title: "Ошибка",
          message: "Пожалуйста, выберите смену для продолжения."
        });
      }
      return;
    }

    const maxBonusToUse = useBonus ? Math.min(bonusBalance, totalPrice, bonusWriteOff) : 0;

    const finalTotal = calculateFinalPrice({
      price: totalPrice,
      quantity: 1,
      bonusPoints: maxBonusToUse,
      useBonus
    });

    const bonusUsed = maxBonusToUse;

    createOrder(
      {
        params: {
          items: [
            {
              programm: {
                season,
                place: location,
                lang,
                description: `${season}. ${location}. ${lang}`,
                shifts: selectedShift,
                prepaymentPrice: paymentType === "prepayment" ? prepaymentPrice : basePrice,
                transferPrice: transferCost,
                bonusCashBack
              },
              quantity: 1
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
          setUseBonus(false);
          setSelectedShiftIndex(0);
          setPaymentType("full");
          setTransfer("no");
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

  const maxBonusToUseForDisplay = useBonus ? Math.min(bonusBalance, totalPrice, bonusWriteOff) : 0;
  const finalPrice = calculateFinalPrice({
    price: totalPrice,
    quantity: 1,
    bonusPoints: maxBonusToUseForDisplay,
    useBonus
  });

  return (
    <Modal
      closeOnBackdropClick
      closeOnEscape
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="xl"
      className="max-h-[70vh] flex flex-col overflow-y-auto scrollbar-hide"
      backdropClassName="bg-black/70"
    >
      <motion.div variants={fadeInVariants} initial="initial" animate="animate" className="flex flex-col gap-6">
        {/* Programm Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{`${season}. ${location}. ${lang}`}</h1>
          {description && (
            <div className="text-base md:text-lg leading-relaxed">
              <CustomPortableText content={description} />
            </div>
          )}

          {/* Shift Selection */}
          {shifts && shifts.length > 0 && (
            <div className="flex flex-col gap-2">
              <label htmlFor="shift-select" className="text-sm font-medium text-gray-700">
                Выберите смену:
              </label>
              <select
                id="shift-select"
                value={selectedShiftIndex}
                onChange={(e) => setSelectedShiftIndex(Number(e.target.value))}
                className="w-full p-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all cursor-pointer hover:border-gray-400"
              >
                {shifts.map((shift, index) => (
                  <option key={index} value={index}>
                    {shift.label} - {shift.price} ₽
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Type Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Тип оплаты:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentType("prepayment")}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  paymentType === "prepayment"
                    ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-medium text-gray-900">Предоплата</span>
                  <span className="text-sm font-bold text-[var(--color-secondary)]">{prepaymentPrice} ₽</span>
                </div>
              </button>
              <button
                onClick={() => setPaymentType("full")}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  paymentType === "full"
                    ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-medium text-gray-900">Полная оплата</span>
                  <span className="text-sm font-bold text-[var(--color-secondary)]">{basePrice} ₽</span>
                </div>
              </button>
            </div>
          </div>

          {/* Transfer */}

          <div className="flex flex-col gap-2">
            <label htmlFor="transfer-select" className="text-sm font-medium text-gray-700">
              Трансфер:
            </label>
            <select
              id="transfer-select"
              value={transfer}
              onChange={(e) => setTransfer(e.target.value as TransferType)}
              className="w-full p-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all cursor-pointer hover:border-gray-400"
            >
              <option value="both-ways">До {programm.location} и обратно</option>
              <option value="one-way">В одну сторону</option>
              <option value="no">Без трансфера</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Buy Button */}
      <div className="pt-4 mt-4 pb-8">
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
        <Button variant="primary" onClick={purchase} disabled={isPending || !selectedShift}>
          {isPending ? "Обработка..." : "Купить"}
        </Button>
      </div>
    </Modal>
  );
};
