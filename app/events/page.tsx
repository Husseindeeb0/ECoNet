import Link from "next/link";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import User from "@/models/User";

export const dynamic = "force-dynamic";

type EventVM = {
    id: string;
    title: string;
    location: string;
    startsAt: string; // ISO
    coverImageUrl?: string;
    capacity?: number;
    bookedCount: number;
};

function toISO(d: any) {
    if (!d) return new Date().toISOString();
    if (typeof d === "string") return new Date(d).toISOString();
    return (d as Date).toISOString();
}

async function fetchAllEvents(): Promise<EventVM[]> {
    await connectDb();

    const rawEvents: any[] = await Event.find({})
        .sort({ startsAt: 1 }) // Ascending order for upcoming events
        .lean();

    const ids = rawEvents.map((e) => String(e._id));

    // Assuming User model is used for bookings/attendees as per MyEventsPage logic
    const counts: Array<{ _id: any; count: number }> = await User.aggregate([
        { $match: { eventId: { $in: ids } } },
        { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);

    const map = new Map<string, number>();
    for (const c of counts) map.set(String(c._id), c.count);

    return rawEvents.map((e) => {
        const title = e.title ?? e.name ?? "Untitled event";
        const location = e.location ?? e.venue ?? "TBA";
        const startsAt = toISO(e.startsAt ?? e.date ?? e.startDate);
        const coverImageUrl = e.coverImageUrl ?? e.imageUrl ?? e.image;
        const capacity = e.capacity ?? e.maxSeats ?? undefined;

        const id = String(e._id);
        const bookedCount = map.get(id) ?? 0;

        return { id, title, location, startsAt, coverImageUrl, capacity, bookedCount };
    });
}

function EventCard({ e }: { e: EventVM }) {
    const seatsText = e.capacity != null ? `${e.bookedCount} / ${e.capacity}` : `${e.bookedCount}`;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link href={`/events/${e.id}`} className="flex-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={
                            e.coverImageUrl ||
                            "https://images.unsplash.com/photo-1520975682031-a5f2f68e3d99?w=1600&auto=format&fit=crop"
                        }
                        alt={e.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                            {new Intl.DateTimeFormat("en-US", {
                                month: "short",
                                day: "numeric",
                            }).format(new Date(e.startsAt))}
                        </span>
                        <span>•</span>
                        <span>
                            {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                            }).format(new Date(e.startsAt))}
                        </span>
                    </div>

                    <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700">
                        {e.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{e.location}</span>
                    </div>
                </div>
            </Link>

            <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {seatsText} booked
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function EventsPage() {
    const events = await fetchAllEvents();

    return (
        <main className="min-h-[calc(100vh-56px)] bg-zinc-50/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Explore Events</h1>
                        <p className="mt-2 text-base text-zinc-600">
                            Discover and book events happening around you.
                        </p>
                    </div>
                </div>

                <div className="mt-10">
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 py-24 text-center">
                            <div className="rounded-full bg-zinc-100 p-4">
                                <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="mt-4 text-lg font-semibold text-zinc-900">No events found</h2>
                            <p className="mt-2 text-sm text-zinc-500 max-w-sm">
                                Check back later for new events.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                            {events.map((e) => (
                                <EventCard key={e.id} e={e} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
