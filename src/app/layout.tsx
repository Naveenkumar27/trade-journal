import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "@/contexts/user-context";
import { TradeProvider } from "@/contexts/trade-context";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

// Load Google fonts and attach to CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});

// Metadata for the Next.js application (used in <head>)
export const metadata: Metadata = {
  title: "Trade-Journal",             
  description: "Mein persönliches Trading-Tagebuch",
};

// RootLayout wraps all pages with global providers and styles
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de"> 
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Toaster for global toast notifications */}
        <Toaster />
        {/* Provide user session context throughout the app */}
        <UserProvider>
          {/* Provide trade data context to all components */}
          <TradeProvider>
            {children} {/* Render page content here */}
          </TradeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
