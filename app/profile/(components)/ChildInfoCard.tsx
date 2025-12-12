import { Users } from "lucide-react";
import Card from "@/components/ui/Card";

interface ChildInfoCardProps {
  parentInfo: LinkedParentInfo | null;
}

export default function ChildInfoCard({ parentInfo }: ChildInfoCardProps) {
  if (!parentInfo) return null;

  const parentName = [parentInfo.first_name, parentInfo.last_name]
    .filter(Boolean)
    .join(" ") || "Родитель";

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{parentName}</p>
            <p className="text-xs text-gray-500">Telegram ID: {parentInfo.telegram_id}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
