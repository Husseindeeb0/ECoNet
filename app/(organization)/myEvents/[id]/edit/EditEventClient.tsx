"use client";

import { motion } from "framer-motion";
import EventForm from "@/components/events/EventForm";
import { updateEventAction } from "@/app/actions";

export default function EditEventClient({ event }: { event: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl relative z-10"
    >
      <div className="mb-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-4xl bg-linear-to-br from-purple-600 to-blue-600 mb-6 shadow-2xl shadow-purple-500/20"
        >
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-black tracking-tight text-slate-900 dark:text-white"
        >
          Refine Your{" "}
          <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Event
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-lg text-slate-600 dark:text-slate-400 font-medium"
        >
          Keep your attendees informed with the latest updates.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="overflow-hidden rounded-[3rem] border border-slate-100 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl shadow-2xl premium-shadow"
      >
        <div className="h-2 bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
        <EventForm initialData={event} action={updateEventAction} mode="edit" />
      </motion.div>
    </motion.div>
  );
}
