import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import EditEventClient from "./EditEventClient";

async function getEvent(id: string) {
  await connectDb();
  try {
    const event = await Event.findById(id).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    return null;
  }
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) {
    notFound();
  }

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)] dark:hidden pointer-events-none"></div>

      <EditEventClient event={event} />
    </main>
  );
}
