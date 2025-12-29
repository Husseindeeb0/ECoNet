import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ECoNet | Event Networking Platform",
    short_name: "ECoNet",
    description:
      "Connect, Network, Grow. The ultimate platform for finding and creating events.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/logoCover.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
