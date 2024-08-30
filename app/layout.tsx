import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContextProvider";

const inter = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Ticker | Turn Tokens into Triumph",
  description: "Create, manage, and trade any ERC20 tokens with ease. Our platform offers seamless token creation, network integration, and a user-friendly experience to turn your ideas into winning opportunities.",
  openGraph: {
    title: "Ticker | Turn Tokens into Triumph",
    description: "Create, manage, and trade any ERC20 tokens with ease. Our platform offers seamless token creation, network integration, and a user-friendly experience to turn your ideas into winning opportunities.",
    url: "https://www.ticker.id",
    siteName: "ticker",
    images: [
      {
        url: "https://www.ticker.id/og-image.jpg",
        width: 1200,
        height: 600,
        alt: "Ticker - Turn Tokens into Triumph",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ticker | Turn Tokens into Triumph",
    description: "Create, manage, and trade any ERC20 tokens with ease. Our platform offers seamless token creation, network integration, and a user-friendly experience to turn your ideas into winning opportunities.",
    images: [
      "https://www.ticker.id/og-image.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WalletProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </WalletProvider>
  );
}
