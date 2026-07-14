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
  title: "Tectonic | The Future of Decentralized Payments",
  description: "Tectonic is a fully collateralized stablecoin protocol built for the EVM ecosystem. Combining reserve-backed stability, equity participation, and automatic trigger redemptions.",
  keywords: ["Tectonic", "Stablecoin", "EVM", "Decentralized Payments", "DeFi", "Web3", "Crypto"],
  openGraph: {
    title: "Tectonic | Decentralized Payments",
    description: "A fully collateralized stablecoin protocol built for the EVM ecosystem.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tectonic | The Future of Decentralized Payments",
    description: "A fully collateralized stablecoin protocol built for the EVM ecosystem.",
  },
};

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
        {children}
      </body>
    </html>
  );
}
