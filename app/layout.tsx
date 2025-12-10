import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/context/TelegramProvider";
import Script from "next/script";
import { QueryProvider } from "@/context/QueryProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Лагерь - Mini App",
  description: "Telegram Mini App для лагеря"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <QueryProvider>
          <TelegramProvider>
            <div className="min-h-screen pb-16">{children}</div>
            <Navigation />
          </TelegramProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
