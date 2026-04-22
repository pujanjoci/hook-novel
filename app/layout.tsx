import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "hooknovel — Read and Publish Web Novels",
    template: "%s — hooknovel",
  },
  description:
    "A chapter-based platform for reading and publishing web novels. Clean typography, distraction-free reading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
