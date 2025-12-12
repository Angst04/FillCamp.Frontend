import Card from "@/components/ui/Card";
import UserListItem from "@/components/UserListItem";

interface FriendsListProps {
  referrals: InvitedUser[];
}

export default function FriendsList({ referrals }: FriendsListProps) {
  if (referrals.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Твои друзья</h2>
        <span className="text-xl font-bold text-[#0048F2]">({referrals.length})</span>
      </div>
      <div className="space-y-3">
        {referrals.map((referral) => {
          const fullName = [referral.first_name, referral.last_name].filter(Boolean).join(" ") || "Пользователь";
          return (
            <UserListItem
              key={referral.tg_id}
              name={fullName}
              avatarGradient="from-purple-500 to-blue-600"
              rightContent={
                <p className="font-semibold text-[#408D26] text-sm">+{100}</p>
              }
            />
          );
        })}
      </div>
    </Card>
  );
}
