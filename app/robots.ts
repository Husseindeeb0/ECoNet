import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://event-hub-pearl-alpha.vercel.app";

  // This file generates the robots.txt file dynamically
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/", "/admin/", "/private/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
