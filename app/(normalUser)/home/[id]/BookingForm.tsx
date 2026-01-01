"use client";

import { useState } from "react";
import {
  useBookEventMutation,
  useCancelBookingMutation,
} from "@/redux/features/bookings/bookingsApi";
import { Loader2, CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BookingForm({
  eventId,
  initialBooking,
  isPaid,
  price,
  whishNumber,
}: {
  eventId: string;
  initialBooking?: any;
  isPaid?: boolean;
  price?: number;
  whishNumber?: string;
}) {
  const router = useRouter();
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [bookEvent, { isLoading: isBooking }] = useBookEventMutation();
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (whishNumber) {
      navigator.clipboard.writeText(whishNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Whish number copied!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await bookEvent({ eventId, ...formData, seats: 1 }).unwrap();
      toast.success(
        isPaid
          ? "Request sent successfully! check your bookings"
          : "Booking confirmed! check your bookings"
      );
      if (isPaid) {
        router.push(`?requestSent=true`);
      } else {
        router.push(`?booked=true`);
      }
      router.refresh();
    } catch (error: any) {
      toast.error(
        error.data?.message ||
          `Failed to ${isPaid ? "send request" : "book event"}`
      );
    }
  };

  const handleCancel = async () => {
    if (!initialBooking?._id) return;

    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[280px]">
          <div className="flex items-center gap-2 text-rose-600">
            <XCircle size={18} />
            <h4 className="font-bold">Cancel Booking?</h4>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Are you sure you want to cancel your booking? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              No, Keep it
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await cancelBooking(initialBooking._id).unwrap();
                  toast.success("Booking cancelled successfully");
                  router.push(`?cancelled=true`);
                  router.refresh();
                } catch (error: any) {
                  toast.error(
                    error.data?.message || "Failed to cancel booking"
                  );
                }
              }}
              className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 dark:shadow-rose-900/20 cursor-pointer active:scale-95"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          padding: "16px",
          borderRadius: "24px",
          background: "var(--background)",
          border: "1px solid #fee2e2",
        },
      }
    );
  };

  if (initialBooking && !isResubmitting) {
    const isPending = initialBooking.status === "pending";
    const isRejected = initialBooking.status === "rejected";

    return (
      <div className="space-y-6">
        <div
          className={`rounded-xl border p-4 shadow-sm ${
            isPending
              ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50"
              : isRejected
              ? "bg-red-50 dark:bg-rose-900/10 border-red-200 dark:border-rose-800/50"
              : "bg-green-50 dark:bg-emerald-900/10 border-green-200 dark:border-emerald-800/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isPending
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  : isRejected
                  ? "bg-red-100 dark:bg-rose-900/30 text-red-600 dark:text-rose-400"
                  : "bg-green-100 dark:bg-emerald-900/30 text-green-600 dark:text-emerald-400"
              }`}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isRejected ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
            <h4
              className={`font-semibold ${
                isPending
                  ? "text-amber-900 dark:text-amber-200"
                  : isRejected
                  ? "text-red-900 dark:text-rose-200"
                  : "text-green-900 dark:text-emerald-200"
              }`}
            >
              {isPending
                ? "Request Pending"
                : isRejected
                ? "Request Rejected"
                : "Booking Confirmed"}
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {isPending
              ? "Your request has been sent to the organizer for approval. They will verify your payment and confirm your booking."
              : isRejected
              ? "Your booking request was rejected by the organizer."
              : "You're all set! Your spot has been reserved."}
          </p>
        </div>

        {!isRejected && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="w-full rounded-xl bg-red-50 dark:bg-rose-900/10 px-6 py-3 text-sm font-semibold text-red-600 dark:text-rose-400 border border-red-200 dark:border-rose-900/30 shadow-sm transition-all hover:bg-red-100 dark:hover:bg-rose-900/20 hover:border-red-300 dark:hover:border-rose-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isPending ? "Withdrawing..." : "Cancelling..."}
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                {isPending ? "Withdraw Request" : "Cancel Booking"}
              </>
            )}
          </button>
        )}

        {isRejected && (
          <button
            onClick={async () => {
              // First delete the rejected booking so we can create a new one
              try {
                await cancelBooking(initialBooking._id).unwrap();
                setIsResubmitting(true);
              } catch (err: any) {
                toast.error(err.data?.message || "Failed to reset request");
              }
            }}
            className="w-full rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Loader2
              className={`h-4 w-4 animate-spin ${
                isCancelling ? "block" : "hidden"
              }`}
            />
            Try Again / Resubmit
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="john@example.com"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
          />
        </div>
      </div>

      <div className="space-y-3">
        {isPaid && (
          <>
            <div className="flex flex-col gap-2">
              <div className="rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-100 dark:border-amber-900/20 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <span className="font-black text-sm">1</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">
                      Pay via Whish
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                      Open your Whish app and send the payment to the number
                      below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-0.5 tracking-wider">
                    Whish Number
                  </p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    {whishNumber || "N/A"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer shadow-sm group"
                  title="Copy Whish Number"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3">
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold text-center leading-tight">
                ⚠️ IMPORTANT: Send a request only AFTER you have completed the
                payment.
              </p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isBooking}
          className={`w-full rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            isPaid
              ? "bg-linear-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-500/40 focus:ring-emerald-500"
              : "bg-linear-to-r from-purple-600 to-blue-600 shadow-purple-500/30 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/40 focus:ring-purple-500"
          }`}
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isPaid ? "Sending Request..." : "Booking..."}
            </>
          ) : isPaid ? (
            "Step 2: Send Booking Request"
          ) : (
            "Reserve Your Spot"
          )}
        </button>
      </div>
    </form>
  );
}
