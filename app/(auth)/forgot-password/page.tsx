"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await axios.post("/api/auth/forgot-password", { email });
      setStatus("success");
      setTimeout(() => {
        window.location.href = `/reset-password?email=${encodeURIComponent(
          email
        )}`;
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email to receive a reset code
          </p>
        </div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
              <p className="font-semibold">Reset code sent!</p>
              <p className="text-sm mt-1">
                Check your email for the 6-digit code.
              </p>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                Redirecting...
              </p>
            </div>
            {/* No "Back to Login" needed here as we auto-redirect */}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {status !== "success" && (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center justify-center gap-2 text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
