"use client";

import { useState, useEffect } from "react";
import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { X, Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageKitUpload from "@/components/imageKit/ImageKitUpload";

import { UserProfile } from "@/types";

interface EditProfileFormProps {
  user: UserProfile;
  onClose: () => void;
}

export default function EditProfileForm({
  user,
  onClose,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    description: user.description || "",
    imageUrl: user.imageUrl || "",
    imageFileId: user.imageFileId || "",
  });

  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10 rounded-t-3xl">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar"
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            {/* Left Column: Image Upload */}
            <div className="flex flex-col items-center md:w-1/3 space-y-4">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 self-start md:self-center">
                Profile Picture
              </span>
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-slate-50 dark:ring-slate-800 shadow-lg group">
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div className="relative z-10 w-full h-full">
                  <ImageKitUpload
                    onSuccess={(res) =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: res.url,
                        imageFileId: res.fileId,
                      }))
                    }
                    defaultImage={formData.imageUrl}
                    aspectRatio="aspect-square"
                  />
                </div>
              </div>
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: "",
                      imageFileId: "",
                    }))
                  }
                  className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-full transition-all"
                >
                  Remove Picture
                </button>
              )}
            </div>

            {/* Right Column: Inputs */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Short Bio
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none placeholder:text-slate-400"
                    placeholder="Tell the community a bit about yourself..."
                  />
                </div>
              </div>

              {/* Status Messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30"
                  >
                    Failed to update profile. Please try again.
                  </motion.div>
                )}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-900/30 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !!successMessage}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
