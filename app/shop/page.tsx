import type { Metadata } from "next";

import Shop from "./Shop";

export const metadata: Metadata = {
  title: "Магазин",
  description: "Магазин товаров FillCamp",
};

export default async function HomePage() {
  return <Shop />;
}
