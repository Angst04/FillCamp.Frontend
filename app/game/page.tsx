import type { Metadata } from "next";

import Game from "./Game";

export const metadata: Metadata = {
  title: "Игра",
  description: "Игра TapCamp",
};

export default async function GamePage() {
  return <Game />;
}
