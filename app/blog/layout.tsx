import type { Metadata } from "next";

// Define your base metadata
export const metadata: Metadata = {
  title: "Ticker Blog | Turn Tokens into Triumph",
  description: "Create, manage, and trade any ERC20 tokens with ease. Our platform offers seamless token creation, network integration, and a user-friendly experience to turn your ideas into winning opportunities.",
  openGraph: {
    title: "Ticker Blog | Turn Tokens into Triumph",
    description: "Create, manage, and trade any ERC20 tokens with ease. Our platform offers seamless token creation, network integration, and a user-friendly experience to turn your ideas into winning opportunities.",
    url: "https://www.ticker.id/blog",
    siteName: "ticker",
    images: [
      {
        url: "https://www.ticker.id/og-image.jpg",
        width: 1200,
        height: 600,
        alt: "Ticker Blog - Turn Tokens into Triumph",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ticker Blog | Turn Tokens into Triumph",
    description: "Create, manage, and trade any ERC20 tokens with ease. Our platform offers seamless token creation, network integration, and a user-friendly experience to turn your ideas into winning opportunities.",
    images: [
      "https://www.ticker.id/og-image.jpg",
    ],
  },
};

// Default layout component
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>{children}</div>
  );
}
