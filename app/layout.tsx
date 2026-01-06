import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoreProvider from "@/redux/StoreProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";
import SocketInitializer from "@/components/socket/SocketInitializer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { DynamicComponents } from "@/components/layout/DynamicComponents";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "ECoNet | Event Networking Platform",
    template: "%s | ECoNet",
  },
  description:
    "ECoNet is your gateway to unforgettable experiences. Discover workshops, conferences, and social gatherings. Connect with organizers, build your professional network, and access exclusive events.",
  applicationName: "ECoNet",
  authors: [{ name: "ECoNet Team" }],
  generator: "Next.js",
  keywords: [
    "events",
    "networking",
    "community",
    "social gatherings",
    "ECoNet",
    "conferences",
    "workshops",
    "tech events",
    "local meetups",
    "online webinars",
    "professional networking",
  ],
  referrer: "origin-when-cross-origin",
  creator: "ECoNet Team",
  publisher: "ECoNet",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      "https://event-hub-pearl-alpha.vercel.app"
  ),
  openGraph: {
    title: "ECoNet | Connect, Network, Grow",
    description:
      "Join ECoNet, the ultimate platform for finding and creating events. Experience seamless booking, interactive organizer profiles, and a vibrant community.",
    url:
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://event-hub-pearl-alpha.vercel.app",
    siteName: "ECoNet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logoCover.png",
        width: 1200,
        height: 630,
        alt: "ECoNet Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ECoNet | Premier Event Networking",
    description:
      "Discover premier events and build your network with ECoNet. Your next great experience awaits.",
    creator: "@ECoNet",
    images: ["/logoCover.png"],
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
            <DynamicComponents />
            <AuthInitializer />
            <SocketInitializer />
            <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
            <ScrollToTop />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Analytics />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
