import { useState } from "react";

interface GameButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  clicks: { id: number; x: number; y: number }[];
  coinsPerTap: number;
}

export default function GameButton({ onClick, disabled, clicks, coinsPerTap }: GameButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Проверяем, что клик находится внутри круга
    const rect = e.currentTarget.getBoundingClientRect();
    const radius = rect.width / 2;
    const centerX = rect.left + radius;
    const centerY = rect.top + radius;
    const distanceFromCenter = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    // Если клик вне круга, предотвращаем активное состояние кнопки
    if (distanceFromCenter > radius + 1) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Если клик внутри круга, активируем анимацию
    setIsActive(true);
  };

  const handlePointerUp = () => {
    setIsActive(false);
  };

  const handlePointerLeave = () => {
    setIsActive(false);
  };

  return (
    <div className="mb-6 flex justify-center">
      <button
        onClick={onClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        disabled={disabled}
        className={`relative rounded-full shadow-2xl transition-transform disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
          isActive ? "scale-95" : ""
        }`}
        style={{
          width: "326px",
          height: "326px",
          background: "linear-gradient(180deg, #AC46FF 0%, #0048F2 100%)"
        }}
      >
        {/* Анимация кликов */}
        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-2xl font-bold text-white pointer-events-none animate-ping z-10"
            style={{
              left: click.x,
              top: click.y,
              transform: "translate(-50%, -50%)"
            }}
          >
            +{coinsPerTap}
          </div>
        ))}

        {/* Иконка */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[96px]">🏕️</div>
        </div>

        {/* Эффект свечения */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 rounded-full" />
      </button>
    </div>
  );
}
