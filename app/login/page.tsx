import { LoginPage } from "./LoginPage";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F0F0E9] flex flex-col items-center px-5 pb-24">
      {/* Logo */}
      <div className="mt-12 mb-16 w-full max-w-[345px] aspect-[345/173] relative">
        <Image src={Logo} alt="FillCamp Logo" fill className="object-contain" priority />
      </div>
      <Suspense>
        <LoginPage />
      </Suspense>
    </div>
  );
}
