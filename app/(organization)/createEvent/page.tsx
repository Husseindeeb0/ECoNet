"use client";

import Link from "next/link";
import { createEventAction } from "@/app/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
        >
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                </>
            ) : (
                "Create Event"
            )}
        </button>
    );
}

export default function CreateEventPage() {
    return (
        <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-8">
            <div className="w-full max-w-xl">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4 shadow-lg shadow-purple-500/30">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Create Event
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">Fill in the details to publish your new event.</p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl shadow-purple-500/10">
                    <div className="h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
                    <form action={createEventAction} className="flex flex-col gap-6 p-8">
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                                Event Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="e.g. Annual Developer Conference"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                required
                                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="e.g. San Francisco, CA"
                            />
                        </div>

                        <div>
                            <label htmlFor="startsAt" className="block text-sm font-semibold text-slate-700 mb-2">
                                Start Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                id="startsAt"
                                name="startsAt"
                                required
                                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-semibold text-slate-700 mb-2">
                                Number of Seats <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                min="1"
                                step="1"
                                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="e.g. 100 (leave empty for unlimited)"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Leave empty if you want unlimited seats for this event.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                                Event Description <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                                placeholder="Describe your event... What will attendees experience? What should they expect?"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Provide details about your event to help attendees understand what to expect.
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row-reverse">
                            <SubmitButton />
                            <Link
                                href="/myEvents"
                                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:w-auto"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
