interface StatsCardProps {
  bonusBalance: number;
}

export default function StatsCard({ bonusBalance }: StatsCardProps) {
  return (
    <div className="flex gap-1 h-[117px]">
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
        <p className="text-4xl font-semibold">{bonusBalance}</p>
        <p className="text-base text-black">бонусов</p>
      </div>
    </div>
  );
}
