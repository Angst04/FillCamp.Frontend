import { useMemo } from "react";
import { calculateFinalPrice } from "@/lib/utils";

type TransferType = "both-ways" | "one-way" | "no";

interface UseProgrammPriceCalculationParams {
  selectedShift: Shift | null;
  paymentType: "prepayment" | "full";
  prepaymentPrice: number;
  transfer: TransferType;
  transferPrice: number;
  useBonus: boolean;
  bonusBalance: number;
  bonusWriteOff?: number;
  bonusWriteOffPercent?: number;
  bonusCashBack?: number;
  bonusCashBackPercent?: number;
}

interface UseProgrammPriceCalculationReturn {
  basePrice: number;
  transferCost: number;
  totalPrice: number;
  maxBonusWriteOff: number;
  maxBonusToUse: number;
  finalPrice: number;
  calculateMaxBonusWriteOff: (price: number) => number;
  calculateBonusCashBack: (price: number) => number;
  calculateOrderValues: () => {
    maxBonusWriteOff: number;
    maxBonusToUse: number;
    finalTotal: number;
    bonusUsed: number;
    calculatedBonusCashBack: number;
    baseOrderPrice: number;
  };
}

export const useProgrammPriceCalculation = ({
  selectedShift,
  paymentType,
  prepaymentPrice,
  transfer,
  transferPrice,
  useBonus,
  bonusBalance,
  bonusWriteOff,
  bonusWriteOffPercent,
  bonusCashBack,
  bonusCashBackPercent
}: UseProgrammPriceCalculationParams): UseProgrammPriceCalculationReturn => {
  // Calculate base price from selected shift
  const basePrice = useMemo(() => {
    return selectedShift ? selectedShift.price : 0;
  }, [selectedShift]);

  // Calculate transfer cost based on selected transfer type
  const transferCost = useMemo(() => {
    if (transfer === "both-ways") {
      return transferPrice * 2;
    }
    if (transfer === "one-way") {
      return transferPrice;
    }
    return 0;
  }, [transfer, transferPrice]);

  // Calculate total price (base/prepayment + transfer)
  const totalPrice = useMemo(() => {
    const base = paymentType === "prepayment" ? prepaymentPrice : basePrice;
    return base + transferCost;
  }, [paymentType, prepaymentPrice, basePrice, transferCost]);

  // Calculate maximum bonus write-off with priority for percentage
  const calculateMaxBonusWriteOff = (price: number): number => {
    if (bonusWriteOffPercent != null) {
      return Math.floor(price * (bonusWriteOffPercent / 100));
    }
    return bonusWriteOff ?? 0;
  };

  // Calculate bonus cashback with priority for percentage
  const calculateBonusCashBack = (price: number): number => {
    if (bonusCashBackPercent != null) {
      return Math.floor(price * (bonusCashBackPercent / 100));
    }
    return bonusCashBack ?? 0;
  };

  // Calculate max bonus write-off for current total price
  const maxBonusWriteOff = useMemo(() => {
    return calculateMaxBonusWriteOff(totalPrice);
  }, [totalPrice]);

  // Calculate max bonus to use (limited by balance, total price, and max write-off)
  const maxBonusToUse = useMemo(() => {
    if (!useBonus) {
      return 0;
    }
    return Math.min(bonusBalance, totalPrice, maxBonusWriteOff);
  }, [useBonus, bonusBalance, totalPrice, maxBonusWriteOff]);

  // Calculate final price with bonus applied
  const finalPrice = useMemo(() => {
    return calculateFinalPrice({
      price: totalPrice,
      quantity: 1,
      bonusPoints: maxBonusToUse,
      useBonus
    });
  }, [totalPrice, maxBonusToUse, useBonus]);

  // Calculate all values needed for order creation
  const calculateOrderValues = () => {
    const maxBonusWriteOffValue = calculateMaxBonusWriteOff(totalPrice);
    const maxBonusToUseValue = useBonus
      ? Math.min(bonusBalance, totalPrice, maxBonusWriteOffValue)
      : 0;

    const finalTotal = calculateFinalPrice({
      price: totalPrice,
      quantity: 1,
      bonusPoints: maxBonusToUseValue,
      useBonus
    });

    const bonusUsed = maxBonusToUseValue;
    const calculatedBonusCashBack = calculateBonusCashBack(finalTotal);
    const baseOrderPrice = paymentType === "prepayment" ? prepaymentPrice : basePrice;

    return {
      maxBonusWriteOff: maxBonusWriteOffValue,
      maxBonusToUse: maxBonusToUseValue,
      finalTotal,
      bonusUsed,
      calculatedBonusCashBack,
      baseOrderPrice
    };
  };

  return {
    basePrice,
    transferCost,
    totalPrice,
    maxBonusWriteOff,
    maxBonusToUse,
    finalPrice,
    calculateMaxBonusWriteOff,
    calculateBonusCashBack,
    calculateOrderValues
  };
};
