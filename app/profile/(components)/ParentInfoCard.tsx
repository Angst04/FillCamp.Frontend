import { User } from "lucide-react";
import Card from "@/components/ui/Card";

interface ParentInfoCardProps {
  childrenList: LinkedChildInfo[];
}

export default function ParentInfoCard({ childrenList }: ParentInfoCardProps) {
  if (!childrenList || childrenList.length === 0) {
    return (
      <Card>
        <p className="text-sm text-gray-500 text-center">Нет привязанных детей</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {childrenList.map((child, index) => (
          <div key={child.telegram_id}>
            {index > 0 && <div className="border-t border-gray-100 my-4" />}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {[child.first_name, child.last_name].filter(Boolean).join(" ") || "Ребенок"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Telegram ID: {child.telegram_id}
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Бонусы: {child.bonus_balance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
