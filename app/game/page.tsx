import { Metadata } from "next";
import { GamePage } from "./GamePage";
import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Игра",
  description: "Игра FillCamp"
};

export default function Page() {
  return (
    <AuthGuard>
      <GamePage />
    </AuthGuard>
  );
}
