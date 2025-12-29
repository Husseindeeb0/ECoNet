import { Hero } from "@/components/landing-page/hero";
import { Mission } from "@/components/landing-page/mission";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Features } from "@/components/landing-page/features";
import { PlatformPurpose } from "@/components/landing-page/platform-purpose";
import { CTA } from "@/components/landing-page/cta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ECoNet | Welcome to the Future of Event Networking",
  description:
    "Start your journey with ECoNet. Explore our mission, discover how we connect communities, and join the revolution in event management and networking.",
  openGraph: {
    title: "Welcome to ECoNet | Event Networking Redefined",
    description:
      "Join ECoNet today. The ultimate platform for discovering events, connecting with organizers, and building your professional network.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome to ECoNet | Event Networking Redefined",
    description:
      "Start your journey with ECoNet. Join the revolution in event management and networking.",
    images: ["/logo.png"],
  },
};

export default function Home() {
  return (
    <main className="bg-transparent font-sans text-slate-900 dark:text-slate-200 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100">
      <Hero />
      <Mission />
      <HowItWorks />
      <Features />
      <PlatformPurpose />
      <CTA />
    </main>
  );
}
