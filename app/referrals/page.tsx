import { Metadata } from "next";
import { ReferralsPage } from "./ReferralsPage";

export const metadata: Metadata = {
  title: "Пригласи друзей",
  description: "Пригласи друзей и получи бонусы"
};

export default function Page() {
  return <ReferralsPage />;
}
