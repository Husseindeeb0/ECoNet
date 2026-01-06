"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ImageKitUpload from "@/components/imageKit/ImageKitUpload";
import SpeakerManagement from "@/components/events/SpeakerManagement";
import {
  ISpeaker as Speaker,
  IScheduleItem as ScheduleItem,
} from "@/types/event";
import ScheduleManagement from "@/components/events/ScheduleManagement";
import CategorySelect from "@/components/events/CategorySelect";
import { DEFAULT_CATEGORIES } from "@/lib/utils";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  MapPin,
  Video,
  DollarSign,
  Phone,
  Image as ImageIcon,
  FileText,
  Users,
  Clock,
  Globe,
  Trash,
} from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";

interface EventFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

function SubmitButton({
  mode,
  isLoading,
}: {
  mode: "create" | "edit";
  isLoading: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isLoading}
      className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto premium-button-purple min-w-[160px]"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {mode === "create" ? "Creating..." : "Saving..."}
        </>
      ) : mode === "create" ? (
        "Create Event"
      ) : (
        "Save Changes"
      )}
    </motion.button>
  );
}

import {
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/redux/features/events/eventsApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function EventForm({ initialData, mode }: EventFormProps) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImageUrl || ""
  );
  // ... (rest of state definitions)
  const [coverImageFileId, setCoverImageFileId] = useState(
    initialData?.coverImageFileId || ""
  );
  const [speakers, setSpeakers] = useState<Speaker[]>(
    initialData?.speakers || []
  );
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    initialData?.schedule || []
  );
  const [isOnline, setIsOnline] = useState(initialData?.isOnline || false);
  const [isPaid, setIsPaid] = useState(initialData?.isPaid || false);
  const [price, setPrice] = useState(initialData?.price?.toString() || "0");
  const [whishNumber, setWhishNumber] = useState(
    initialData?.whishNumber || ""
  );

  const isDefaultCategory =
    initialData?.category &&
    (DEFAULT_CATEGORIES as readonly string[]).includes(initialData?.category);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    isDefaultCategory
      ? initialData.category!
      : initialData?.category
      ? "Other"
      : DEFAULT_CATEGORIES[0]
  );

  const [customCategory, setCustomCategory] = useState(
    isDefaultCategory ? "" : initialData?.category || ""
  );

  const deleteFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const meetingLink = formData.get("meetingLink") as string;
    const startsAt = formData.get("startsAt") as string;
    const endsAt = formData.get("endsAt") as string;
    const capacityStr = formData.get("capacity") as string;
    const description = formData.get("description") as string;
    const liveStreamUrl = formData.get("liveStreamUrl") as string;

    const category =
      selectedCategory === "Other" ? customCategory : selectedCategory;

    const capacity =
      capacityStr && capacityStr.trim() !== ""
        ? parseInt(capacityStr, 10)
        : undefined;

    const eventData = {
      title,
      location: isOnline ? "Online" : location,
      isOnline,
      meetingLink: isOnline ? meetingLink : undefined,
      startsAt,
      endsAt: endsAt || undefined,
      capacity,
      description,
      category,
      coverImageUrl,
      coverImageFileId,
      organizerId: (user as any)?.userId || (user as any)?._id || "",
      speakers: speakers.length > 0 ? speakers : undefined,
      schedule: schedule.length > 0 ? schedule : undefined,
      isPaid,
      price: isPaid ? parseFloat(price) || 0 : 0,
      whishNumber: isPaid ? whishNumber : undefined,
      liveStreamUrl: liveStreamUrl || undefined,
    };

    try {
      if (mode === "create") {
        const result = await createEvent(eventData as any).unwrap();
        if (result.success) {
          toast.success("Event created successfully!");
          router.push(`/myEvents/${result.event._id}/success?type=create`);
        }
      } else {
        const result = await updateEvent({
          id: initialData._id,
          ...eventData,
        } as any).unwrap();
        if (result) {
          toast.success("Event updated successfully!");
          router.push(`/myEvents/${initialData._id}/success?type=edit`);
        }
      }
    } catch (error: any) {
      console.error("Failed to save event:", error);
      toast.error(error?.data?.message || "Failed to save event");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(initialData._id).unwrap();
      toast.success("Event deleted successfully");
      router.push("/myEvents");
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      toast.error(error?.data?.message || "Failed to delete event");
    }
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.custom(
      (t) => (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`
              w-full max-w-md pointer-events-auto
              flex flex-col gap-4 p-6 rounded-3xl shadow-2xl
              bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl
              border border-red-100 dark:border-red-900/30
            `}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <Trash className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  Delete Event?
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  This action cannot be undone. All data will be permanently
                  lost.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  handleDelete();
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Yes, Delete it
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      ),
      {
        duration: Infinity, // User must interact
        position: "top-center",
      }
    );
  };

  const formatDateForInput = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="p-8 sm:p-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {mode === "edit" && (
          <input type="hidden" name="eventId" value={initialData?._id} />
        )}
        <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
        <input type="hidden" name="coverImageFileId" value={coverImageFileId} />

        {/* 1. Title */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <FileText className="w-4 h-4" />
            </motion.div>
            General Information
          </h3>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group"
          >
            <label
              htmlFor="title"
              className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
            >
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={initialData?.title}
              className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-900 dark:text-white"
              placeholder="What's the name of your event?"
            />
          </motion.div>
        </motion.section>

        {/* 2. Format & Location */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Globe className="w-4 h-4" />
            </motion.div>
            Event Format
          </h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4 p-5 rounded-3xl border-2 border-purple-100 dark:border-slate-800 bg-purple-50/30 dark:bg-slate-800/30"
          >
            <div className="flex items-center h-5">
              <input
                id="isOnline"
                name="isOnline"
                type="checkbox"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                className="h-6 w-6 rounded-lg border-purple-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 dark:bg-slate-700"
              />
            </div>
            <label htmlFor="isOnline" className="cursor-pointer">
              <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                This is an online event
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Attendees will join via a meeting link
              </span>
            </label>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isOnline ? (
              <motion.div
                key="physical"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="group"
              >
                <label
                  htmlFor="location"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
                >
                  Physical Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required={!isOnline}
                    defaultValue={
                      initialData?.location === "Online"
                        ? ""
                        : initialData?.location
                    }
                    className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pl-12 pr-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-900 dark:text-white"
                    placeholder="e.g. Beirut Digital District, Lebanon"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="online"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="group">
                  <label
                    htmlFor="meetingLink"
                    className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Meeting Link
                  </label>
                  <div className="relative">
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      id="meetingLink"
                      name="meetingLink"
                      required={isOnline}
                      defaultValue={initialData?.meetingLink}
                      className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pl-12 pr-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-900 dark:text-white"
                      placeholder="e.g. https://zoom.us/j/12345678"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <label
              htmlFor="liveStreamUrl"
              className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
            >
              YouTube Live Stream Link{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              id="liveStreamUrl"
              name="liveStreamUrl"
              defaultValue={initialData?.liveStreamUrl}
              className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-900 dark:text-white"
              placeholder="Embed a live stream for remote viewers"
            />
          </motion.div>
        </motion.section>

        {/* 3. Pricing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <DollarSign className="w-4 h-4" />
            </motion.div>
            Pricing Details
          </h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="p-6 rounded-3xl border-2 border-emerald-100 dark:border-emerald-900/20 bg-emerald-50/30 dark:bg-emerald-900/10"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center h-5">
                <input
                  id="isPaid"
                  name="isPaid"
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="h-6 w-6 rounded-lg border-emerald-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-700"
                />
              </div>
              <label htmlFor="isPaid" className="cursor-pointer">
                <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  This is a paid event
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Enable ticket sales via Whish Money
                </span>
              </label>
            </div>

            <AnimatePresence>
              {isPaid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6"
                >
                  <div className="group">
                    <label
                      htmlFor="price"
                      className="block text-[10px] font-black uppercase text-emerald-600 mb-1.5 ml-1"
                    >
                      Ticket Price ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required={isPaid}
                        min="1"
                        step="0.01"
                        className="block w-full rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-900 pl-12 pr-5 py-4 text-base font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label
                      htmlFor="whishNumber"
                      className="block text-[10px] font-black uppercase text-emerald-600 mb-1.5 ml-1"
                    >
                      Whish Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="tel"
                        id="whishNumber"
                        name="whishNumber"
                        value={whishNumber}
                        onChange={(e) => setWhishNumber(e.target.value)}
                        required={isPaid}
                        className="block w-full rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-900 pl-12 pr-5 py-4 text-base font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="70123456"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* 4. Categorization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Categorization
          </h3>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <CategorySelect
              categories={DEFAULT_CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              customCategory={customCategory}
              onCustomCategoryChange={setCustomCategory}
            />
          </motion.div>
        </motion.section>

        {/* 5. Timing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.25, type: "spring" }}
            >
              <Clock className="w-4 h-4" />
            </motion.div>
            Timing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <label
                htmlFor="startsAt"
                className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
              >
                Start Date & Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="datetime-local"
                  id="startsAt"
                  name="startsAt"
                  required
                  defaultValue={formatDateForInput(initialData?.startsAt)}
                  className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pl-12 pr-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-900 dark:text-white"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <label
                htmlFor="endsAt"
                className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
              >
                End Date & Time{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 opacity-50" />
                <input
                  type="datetime-local"
                  id="endsAt"
                  name="endsAt"
                  defaultValue={formatDateForInput(initialData?.endsAt)}
                  className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pl-12 pr-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-900 dark:text-white"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 6. Capacity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Users className="w-4 h-4" />
            </motion.div>
            Audience Capacity
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="group"
          >
            <label
              htmlFor="capacity"
              className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
            >
              Available Slots{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              min="1"
              defaultValue={initialData?.capacity}
              className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-900 dark:text-white"
              placeholder="Unlimited if left empty"
            />
          </motion.div>
        </motion.section>

        {/* 7. Poster */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.35, type: "spring" }}
            >
              <ImageIcon className="w-4 h-4" />
            </motion.div>
            Event Visuals
          </h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-800 p-8 transition-all hover:border-purple-200 dark:hover:border-purple-900 bg-slate-50/30 dark:bg-slate-900/30"
          >
            <ImageKitUpload
              onSuccess={(res) => {
                setCoverImageUrl(res.url);
                setCoverImageFileId(res.fileId);
              }}
              defaultImage={coverImageUrl}
            />
          </motion.div>
        </motion.section>

        {/* 8. Description */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <FileText className="w-4 h-4" />
            </motion.div>
            Full Description
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
          >
            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={initialData?.description}
              className="block w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4 text-base font-medium transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 resize-none text-slate-900 dark:text-white"
              placeholder="Tell people more about the event journey..."
            />
          </motion.div>
        </motion.section>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* 9. Speakers & Schedule */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="space-y-12"
        >
          <SpeakerManagement speakers={speakers} onChange={setSpeakers} />
          <input
            type="hidden"
            name="speakers"
            value={JSON.stringify(speakers)}
          />

          <ScheduleManagement schedule={schedule} onChange={setSchedule} />
          <input
            type="hidden"
            name="schedule"
            value={JSON.stringify(schedule)}
          />
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col gap-6 sm:flex-row-reverse items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-10"
        >
          <SubmitButton mode={mode} isLoading={isCreating || isUpdating} />
          <Link
            href="/myEvents"
            className="text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            Discard Changes
          </Link>
        </motion.div>
      </form>
      {mode === "edit" && (
        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
          <input type="hidden" name="eventId" value={initialData?._id} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/20">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <Trash className="w-5 h-5" />
                Delete Event
              </h3>
              <p className="text-sm text-red-600/70 dark:text-red-400/70">
                Once you delete this event, there is no going back. Please be
                certain.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="px-6 py-3 rounded-xl bg-white dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold border-2 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
