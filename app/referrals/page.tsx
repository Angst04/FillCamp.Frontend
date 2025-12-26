import { Metadata } from "next";
import { ReferralsPage } from "./ReferralsPage";
import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Пригласи друзей",
  description: "Пригласи друзей и получи бонусы"
};

export default function Page() {
  return (
    <AuthGuard>
      <ReferralsPage />
    </AuthGuard>
  );
}
