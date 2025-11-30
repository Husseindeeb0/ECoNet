import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getEvent(id: string) {
    await connectDb();
    try {
        const event = await Event.findById(id).lean();
        if (!event) return null;
        return { ...event, _id: event._id.toString() };
    } catch (error) {
        return null;
    }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const event = await getEvent(resolvedParams.id);

    if (!event) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="relative h-96 w-full bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={
                        event.coverImageUrl ||
                        "https://images.unsplash.com/photo-1520975682031-a5f2f68e3d99?w=1600&auto=format&fit=crop"
                    }
                    alt={event.title}
                    className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-zinc-900/90 to-transparent p-8 sm:p-12">
                    <div className="mx-auto w-full max-w-5xl">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{event.title}</h1>
                        <div className="mt-4 flex flex-wrap items-center gap-6 text-zinc-300">
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                    {new Intl.DateTimeFormat("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                    }).format(new Date(event.startsAt))}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-zinc-900">About this event</h2>
                        <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                            {/* Placeholder description since it's not in the model yet */}
                            Join us for an unforgettable experience at {event.location}. This event brings together people from all walks of life to celebrate, learn, and connect. Don't miss out on this opportunity to be part of something special.
                        </p>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-zinc-900">Registration</h3>
                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Price</span>
                                    <span className="font-medium text-zinc-900">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Spots remaining</span>
                                    <span className="font-medium text-zinc-900">
                                        {event.capacity ? event.capacity - (event.bookedCount || 0) : "Unlimited"}
                                    </span>
                                </div>
                                <button className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md">
                                    Reserve a Spot
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
