import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "EventHub - Discover and Manage Events",
  description: "Discover and book events happening around you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="" suppressHydrationWarning={true}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
