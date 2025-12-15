import { Metadata } from "next";
import { redirect } from "next/navigation";
import { GamePage } from "./GamePage";
import { getAuthSession } from "@/lib/auth";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Игра",
  description: "Игра FillCamp"
};

export default async function Page() {
  const session = await getAuthSession();

  // Redirect parents to home page
  if (session.role === "parent") {
    redirect("/");
  }

  return <GamePage />;
}
