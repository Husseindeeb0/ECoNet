"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  FileText,
  UserCircle,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  useSignupMutation,
  useVerifyEmailMutation,
  useLazyCheckSessionQuery,
} from "@/redux/features/auth/authApi";
import { useAppSelector } from "@/redux/store";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // API Mutations
  const [signup, { isLoading: signupLoading, error: signupError }] =
    useSignupMutation();
  const [verifyEmail, { isLoading: verifying }] = useVerifyEmailMutation();
  const [checkSession] = useLazyCheckSessionQuery();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "organizer",
    description: "",
  });

  // Verification state
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verificationError, setVerificationError] = useState("");

  // Track when we're redirecting after successful auth
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Local validation errors
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Destructure formData to exclude confirmPassword before sending to API
      const { confirmPassword, ...signupData } = formData;
      const result = await signup(signupData);

      if (result.data?.success) {
        setShowVerification(true);
      }
    } catch(error) {
      console.error(error);
    }
  };

  // Handle Verification
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    setVerificationError("");

    try {
      await verifyEmail({ email: formData.email, code }).unwrap();

      // Update session to get authenticated state
      await checkSession();

      setIsRedirecting(true);
    } catch (error: any) {
      setVerificationError(
        error.data?.message || (error as any)?.message || "Verification failed"
      );
    }
  };

  // Auto-submit verification when filled
  useEffect(() => {
    if (
      otp.every((digit) => digit !== "") &&
      !verificationError &&
      !verifying
    ) {
      handleVerify();
    }
  }, [otp]);

  if (signupLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl mb-4">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {isRedirecting
              ? "Setting up your account..."
              : "Creating your account..."}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRedirecting
              ? "Redirecting you to the dashboard"
              : "Please wait while we register specific details"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          {showVerification ? (
            // ================= VERIFICATION VIEW =================
            <div className="text-center">
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-block p-3 bg-blue-100 rounded-full mb-4"
                >
                  <Mail className="w-8 h-8 text-blue-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Verify Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={handleVerify}>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((data, index) => (
                    <input
                      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-slate-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-slate-800 dark:text-white"
                      type="text"
                      name="otp"
                      maxLength={1}
                      key={index}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </div>

                {verificationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {verificationError}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={verifying || otp.some((d) => d === "")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </form>

              <button
                onClick={() => setShowVerification(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline cursor-pointer"
              >
                Change email / Back
              </button>
            </div>
          ) : (
            // ================= SIGNUP VIEW =================
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-block p-3 bg-linear-to-br from-purple-500 to-blue-500 rounded-full mb-4"
                >
                  <UserCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Join ECoNet today
                </p>
              </div>

              {/* Error Message */}
              {signupError && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {typeof signupError === "string"
                    ? signupError
                    : (signupError as any)?.data?.message ||
                      (signupError as any)?.message ||
                      "Signup failed"}
                </motion.div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:text-white ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-slate-700"
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:text-white ${
                        validationErrors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-slate-700"
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:text-white ${
                        validationErrors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-slate-700"
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:text-white ${
                        validationErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-slate-700"
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Type
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:text-white"
                  >
                    <option value="user">Normal User</option>
                    <option value="organizer">Organizer</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.role === "organizer"
                      ? "As an organizer, you can create and manage events"
                      : "As a normal user, you can browse and book events"}
                  </p>
                </div>

                {/* Description Field (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none dark:bg-slate-800 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={signupLoading}
                  className="w-full bg-linear-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {signupLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
