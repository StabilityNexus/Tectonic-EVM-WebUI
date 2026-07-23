import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tectonic | Decentralized Stable Money",
  description: "Tectonic is a decentralized stablecoin protocol. Combining reserve backing, equity and redemption triggering, it provides the solid foundation for decentralized money on chain. Its stability properties have been thoroughly researched, mathematically proven and formally verified.",
  keywords: [
    "Tectonic",
    "Stablecoin",
    "EVM",
    "Decentralized Payments",
    "DeFi",
    "Web3",
    "Crypto",
    "Money",
    "Oracle",
    "Stable Coin",
    "Stability",
    "Financial Stability",
    "Decentralized Finance",
    "Finance",
    "USD",
    "EUR",
    "AUD",
    "NZD",
    "RUB",
    "BRL",
    "INR",
    "CNY",
    "ETH",
    "ETC",
    "BNB",
    "POL",
  ],
  openGraph: {
    title: "Tectonic | Decentralized Stable Money",
    description: "Tectonic is a decentralized stablecoin protocol. Combining reserve backing, equity and redemption triggering, it provides the solid foundation for decentralized money on chain. Its stability properties have been thoroughly researched, mathematically proven and formally verified.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tectonic | Decentralized Stable Money",
    description: "Tectonic is a decentralized stablecoin protocol. Combining reserve backing, equity and redemption triggering, it provides the solid foundation for decentralized money on chain. Its stability properties have been thoroughly researched, mathematically proven and formally verified.",
  },
};

import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
