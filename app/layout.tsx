import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiFind",
  description: "Find and book top service providers near you",
};

// CRITICAL: This MUST have 'export default' at the start
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}