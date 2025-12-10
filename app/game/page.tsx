import { Metadata } from "next";
import { GamePage } from "./GamePage";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Игра",
  description: "Игра FillCamp"
};

export default function Page() {
  return <GamePage />;
}
