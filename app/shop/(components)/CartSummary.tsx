import Card from '@/components/ui/Card';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  bonusBalance: number;
  className?: string;
}

export default function CartSummary({
  totalItems,
  totalPrice,
  bonusBalance,
  className = '',
}: CartSummaryProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#656565]">Товаров:</span>
        <span className="font-semibold text-[#101010]">
          {totalItems} шт.
        </span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#656565]">
          Ваш баланс:
        </span>
        <span className="font-semibold text-green-600">
          {bonusBalance} бонусов
        </span>
      </div>
      <div className="border-t pt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#101010]">
          Итого:
        </span>
        <span className="text-2xl font-bold text-[#0048F2]">
          {totalPrice}
        </span>
      </div>
    </Card>
  );
}

