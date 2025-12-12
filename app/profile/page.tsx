import { Metadata } from "next";
import { ProfilePage } from "./ProfilePage";
import { getProfile } from "@/api/requests/profile";
import { getAuthHeaders, isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Профиль",
  description: "Профиль FillCamp"
};

export default async function Page() {
  const isLoggedIn = await isAuthenticated();

  if (!isLoggedIn) {
    redirect("/login");
  }

  // Example: Fetch profile data on server with auth headers
  const authHeaders = await getAuthHeaders();
  const profileResponse = await getProfile({ config: { headers: authHeaders } });

  return <ProfilePage initialProfile={profileResponse.data} />;
}
