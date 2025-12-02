import { User } from "lucide-react";

interface Child {
    id: number;
    name: string;
    bonusBalance: number;
}

interface ParentInfoCardProps {
    childrenList: Child[];
}

export default function ParentInfoCard({ childrenList }: ParentInfoCardProps) {
    if (!childrenList || childrenList.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            {childrenList.map((child) => (
                <div
                    key={child.id}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-pink-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <User size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-normal">{child.name}</p>
                            <p className="text-xs text-gray-500">
                                Бонусы: {child.bonusBalance}
                            </p>
                        </div>
                    </div>
                    <button className="text-sm text-blue-600 font-normal">
                        Подробнее
                    </button>
                </div>
            ))}
        </div>
    );
}

