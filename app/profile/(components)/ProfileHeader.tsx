import { User } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  username?: string;
  photoUrl?: string;
}

export default function ProfileHeader({ firstName, lastName, username, photoUrl }: ProfileHeaderProps) {
  return (
    <div className="flex items-start gap-6 mb-6">
      <div className="w-36 h-36 bg-white rounded-[28px] flex items-center justify-center flex-shrink-0">
        {photoUrl ? (
          <Image src={photoUrl} alt="Profile" width={144} height={144} className="rounded-[28px]" />
        ) : (
          <User size={60} className="text-gray-400" />
        )}
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-[28px] font-bold leading-tight">{firstName}</h1>
        <h1 className="text-[28px] font-bold leading-tight">{lastName}</h1>
        {username && <p className="text-gray-500 mt-1">@{username}</p>}
      </div>
    </div>
  );
}
