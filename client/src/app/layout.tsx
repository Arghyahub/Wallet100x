import type { Metadata } from "next";
import { Merriweather_Sans } from "next/font/google";
import "./globals.css";

const inter = Merriweather_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet100x",
  description: "A crypto wallet organizing all your accounts in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
