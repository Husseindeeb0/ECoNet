import Link from "next/link";
import connectDb from "@/lib/connectDb";

// ✅ Adjust these imports to match your actual model filenames/exports
import Event from "@/models/Event";
import User from "@/models/User";

export const dynamic = "force-dynamic";

type MyEventVM = {
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

/**
 * ✅ IMPORTANT: Replace this with your real auth.
 * For now, it’s a safe stub so the page runs.
 */
async function getOrganizerId() {
    // TODO: replace with session user id
    return "user_organizer_1";
}

/**
 * ✅ IMPORTANT: You may need to adjust:
 * - event ownership field (organizerId / ownerId / createdBy)
 * - booking eventId field (eventId / event / event_id)
 * - event datetime field (startsAt / date / startDate)
 */
async function fetchMyEvents(organizerId: string): Promise<MyEventVM[]> {
    await connectDb();

    // 🔧 CHANGE THIS FIELD to match your Event model:
    // organizerId | ownerId | createdBy
    const rawEvents: any[] = await Event.find({ organizerId })
        .sort({ startsAt: -1, createdAt: -1 })
        .lean();

    const ids = rawEvents.map((e) => String(e._id));

    // If you don’t have Booking model yet, comment this block and set bookedCount = 0 below.
    const counts: Array<{ _id: any; count: number }> = await User.aggregate([
        // 🔧 CHANGE THIS FIELD to match your Booking model:
        // eventId | event | event_id
        { $match: { eventId: { $in: ids } } },
        { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);

    const map = new Map<string, number>();
    for (const c of counts) map.set(String(c._id), c.count);

    return rawEvents.map((e) => {
        // 🔧 CHANGE these fields if your schema uses different names:
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

function EventCard({ e }: { e: MyEventVM }) {
    const seatsText = e.capacity != null ? `${e.bookedCount} / ${e.capacity}` : `${e.bookedCount}`;
    const isFull = e.capacity != null && e.bookedCount >= e.capacity;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <Link href={`/events/${e.id}`} className="flex-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={
                            e.coverImageUrl ||
                            "https://images.unsplash.com/photo-1520975682031-a5f2f68e3d99?w=1600&auto=format&fit=crop"
                        }
                        alt={e.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
                            isFull 
                                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" 
                                : "bg-white/90 text-purple-700 backdrop-blur-sm"
                        }`}>
                            {isFull ? "Sold Out" : "Available"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1.5 text-purple-700">
                            <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Intl.DateTimeFormat("en-US", {
                                month: "short",
                                day: "numeric",
                            }).format(new Date(e.startsAt))}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">
                            {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                            }).format(new Date(e.startsAt))}
                        </span>
                    </div>

                    <h3 className="line-clamp-2 text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
                        {e.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="h-4 w-4 shrink-0 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1 font-medium">{e.location}</span>
                    </div>
                </div>
            </Link>

            <div className="border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span>{seatsText} booked</span>
                    </div>

                    <Link
                        href={`/events/${e.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:shadow-purple-500/40"
                    >
                        Manage
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default async function MyEventsPage() {
    const organizerId = await getOrganizerId();
    const events = await fetchMyEvents(organizerId);

    return (
        <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
                            My Events
                        </h1>
                        <p className="mt-3 text-lg text-slate-600">
                            Manage your events and track attendee bookings.
                        </p>
                    </div>

                    <Link
                        href="/createEvent"
                        className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        <span className="mr-2 text-lg leading-none">+</span> Create Event
                    </Link>
                </div>

                <div className="mt-10">
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 py-24 text-center">
                            <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 p-6 shadow-lg">
                                <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-slate-900">No events found</h2>
                            <p className="mt-2 text-base text-slate-600 max-w-sm">
                                Get started by creating your first event. It only takes a few minutes.
                            </p>
                            <Link
                                href="/createEvent"
                                className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40"
                            >
                                Create your first event
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

