import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "EasyLMS",
  description: "AI-powered PDF-to-course authoring portal"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fafaf9_32%,#f5f5f4_100%)] text-stone-950 antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}

