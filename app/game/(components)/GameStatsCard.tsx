import { LucideIcon } from "lucide-react";

interface GameStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  backgroundColor?: string;
}

export default function GameStatsCard({ icon: Icon, label, value, backgroundColor = "#FFFFFF" }: GameStatsCardProps) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor,
        boxShadow: "2px 1px 6.7px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div className="flex items-center space-x-2 mb-1">
        <Icon size={12} style={{ color: "#0048F2" }} />
        <span className="text-xs font-heading" style={{ color: "#0048F2" }}>
          {label}
        </span>
      </div>
      <p className="text-[28px] font-semibold" style={{ color: "#101010" }}>
        {value}
      </p>
    </div>
  );
}
