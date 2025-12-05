import { Users } from "lucide-react";

interface LinkedAccount {
  id: number;
  name: string;
}

interface ChildInfoCardProps {
  linkedAccount?: LinkedAccount;
}

export default function ChildInfoCard({ linkedAccount }: ChildInfoCardProps) {
  if (!linkedAccount) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-pink-300 rounded-full flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-normal">{linkedAccount.name}</p>
            <p className="text-xs text-gray-500">ID: {linkedAccount.id}</p>
          </div>
        </div>
        <button className="text-sm text-blue-600 font-normal">Подробнее</button>
      </div>
    </div>
  );
}
