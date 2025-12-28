import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoreProvider from "@/redux/StoreProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";
import SocketInitializer from "@/components/socket/SocketInitializer";
import AIChat from "@/components/ai/AIChat";
import ScrollToTop from "@/components/layout/ScrollToTop";
import VantaBackground from "@/components/ui/VantaBackground";

import { ThemeProvider } from "@/components/ui/ThemeProvider";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "ECoNet | Connecting Communities",
    template: "%s | ECoNet",
  },
  description: "ECoNet is the ultimate Event Connect Network. Discover workshops, conferences, and social gatherings. Connect with organizers and build your professional network.",
  applicationName: "ECoNet",
  authors: [{ name: "ECoNet Team" }],
  generator: "Next.js",
  keywords: ["events", "networking", "community", "social", "ECoNet", "Event Connect Network", "conferences", "workshops", "ticketing", "online events"],
  referrer: "origin-when-cross-origin",
  creator: "ECoNet Team",
  publisher: "ECoNet",
  metadataBase: new URL("https://eventhub.com"), // Replace with actual domain when deployed
  openGraph: {
    title: "ECoNet | Event Connect Network",
    description: "Join ECoNet to discover premier events and connect with a thriving community.",
    url: "https://eventhub.com",
    siteName: "ECoNet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECoNet | Event Connect Network",
    description: "Discover premier events and build your network with ECoNet.",
    creator: "@ECoNet",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <ThemeProvider defaultTheme="light" storageKey="eventhub-theme">
            <VantaBackground />
            <AuthInitializer />
            <SocketInitializer />
            <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
            <ScrollToTop />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <AIChat />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
