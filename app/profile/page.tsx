import { Metadata } from "next";
import { ProfilePage } from "./ProfilePage";
import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Профиль",
  description: "Профиль FillCamp"
};

export default function Page() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
