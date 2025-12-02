import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/context/TelegramProvider";
import Navigation from "@/components/Navigation";
import Script from "next/script";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Лагерь - Mini App",
    description: "Telegram Mini App для лагеря",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <Script
                    src="https://telegram.org/js/telegram-web-app.js"
                    strategy="beforeInteractive"
                />
            </head>
            <body
                className={`${inter.variable} antialiased`}
                suppressHydrationWarning
            >
                <TelegramProvider>
                    <div className="min-h-screen pb-16">{children}</div>
                    <Navigation />
                </TelegramProvider>
            </body>
        </html>
    );
}
