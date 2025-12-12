import { Metadata } from "next";
import { ProfilePage } from "./ProfilePage";
import { getProfile } from "@/api/requests/profile";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Профиль",
  description: "Профиль FillCamp"
};

export default function Page() {
  return <ProfilePage />;
}
