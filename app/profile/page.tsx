import type { Metadata } from "next";

import Profile from "./Profile";

export const metadata: Metadata = {
  title: "Профиль",
  description: "Профиль пользователя",
};

export default async function ProfilePage() {
  return <Profile />;
}
