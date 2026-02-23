import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni - AI Story Generator",
  description:
    "Turn your photos into compelling social media stories with AI-powered comic-book style narratives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
