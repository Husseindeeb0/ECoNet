import { MetadataRoute } from "next";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://event-hub-pearl-alpha.vercel.app";

  const routes = ["", "/about", "/login", "/signup"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  // Fetch dynamic event routes
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDb();
    const events = await Event.find({})
      .select("_id updatedAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    eventRoutes = events.map((event) => ({
      url: `${baseUrl}/home/${event._id.toString()}`,
      lastModified: event.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to generate event sitemap:", error);
  }

  return [...routes, ...eventRoutes];
}
