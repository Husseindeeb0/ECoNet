import Link from "next/link";

export default function InvitePage({ params }: { params: { id: string } }) {
    return (
        <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-zinc-50/50 p-4 sm:p-8">
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Event Created!</h1>
                    <p className="mt-2 text-zinc-600">Your event is ready. Share the ID below to invite attendees.</p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
                    <div className="mb-6">
                        <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
                            Event ID Invitation
                        </label>
                        <div className="mt-2 flex items-center justify-center rounded-xl bg-zinc-50 px-4 py-3 font-mono text-xl font-bold tracking-widest text-zinc-900">
                            {params.id}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/events/${params.id}`}
                            className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                        >
                            View Event Details
                        </Link>
                        <Link
                            href="/myEvents"
                            className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2"
                        >
                            Back to My Events
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
