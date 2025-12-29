import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed | ECoNet",
  description:
    "Browse the latest popular events and experiences curated just for you.",
  openGraph: {
    title: "Discover Events | ECoNet",
    description:
      "Browse the latest popular events and experiences curated just for you.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Events | ECoNet",
    description:
      "Browse the latest popular events and experiences curated just for you.",
    images: ["/logo.png"],
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
