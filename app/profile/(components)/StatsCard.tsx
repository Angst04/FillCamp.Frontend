interface StatsCardProps {
  bonusBalance: number;
  gameProgress: number;
}

export default function StatsCard({ bonusBalance, gameProgress }: StatsCardProps) {
  return (
    <div className="flex gap-1 h-[117px]">
      {/* Bonuses Section */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
        <p className="text-4xl font-semibold">{bonusBalance}</p>
        <p className="text-base text-black">бонусов</p>
      </div>

      {/* Game Progress Section */}
      <div className="flex-1 bg-gradient-to-b from-blue-600 to-blue-400 rounded-2xl p-4 flex flex-col justify-between">
        <p className="text-4xl font-semibold text-white">{gameProgress}%</p>
        <p className="text-base text-white">прогресс игры</p>
      </div>
    </div>
  );
}
