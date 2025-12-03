import type { Metadata } from "next";

import Referals from "./Referals";

export const metadata: Metadata = {
  title: "Рефералы",
  description: "Реферальная программа FillCamp",
};

export default async function ReferalsPage() {
  return <Referals />;
}
