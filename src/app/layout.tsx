import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ember Index — Fire Safety Decisions for the Next Giant Leap",
  description:
    "SI-powered dashboard mapping NASA's microgravity combustion data onto the atmospheres crews will actually breathe: ISS, Moon Base, rover, spacesuit. Built for NASA Space Apps 2026: Flame in Freefall.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-200 antialiased">{children}</body>
    </html>
  );
}
