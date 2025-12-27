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
  title: "EventHub",
  description: "Your platform for events.",
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
