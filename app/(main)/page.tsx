import type { Metadata } from "next";

import Home from "./Home";

export const metadata: Metadata = {
  title: "Главная страница",
  description: "Главная страница FillCamp",
};

export default async function HomePage() {
  return <Home />;
}
