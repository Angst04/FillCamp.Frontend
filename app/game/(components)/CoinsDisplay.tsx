interface CoinsDisplayProps {
  coins: number;
}

export default function CoinsDisplay({ coins }: CoinsDisplayProps) {
  return (
    <div className="bg-white rounded-[35px] p-8 mb-6 text-center">
      <div className="flex items-center justify-center space-x-3 mb-2">
        <span className="text-3xl">🏆</span>
        <p className="text-[40px] font-bold font-heading" style={{ color: "#ED0000" }}>
          {coins.toLocaleString()}
        </p>
      </div>
      <p className="text-xl font-heading" style={{ color: "#101010" }}>
        бонусов
      </p>
    </div>
  );
}
