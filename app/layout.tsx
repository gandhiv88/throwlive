import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Throwball Score Tracker",
  description: "ThrowLive: A realtime throwball score tracker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const buildMarker = "Build: 2026-01-18T00:00:00Z"; // Replace with commit hash or CI var if needed
  console.log("BUILD MARKER", buildMarker);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <ThemeProvider>{children}</ThemeProvider>
        <footer className="w-full text-center text-xs text-gray-400 py-2 select-none pointer-events-none">
          {buildMarker}
        </footer>
      </body>
    </html>
  );
}
