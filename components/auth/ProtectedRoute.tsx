"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import Loading from "@/components/ui/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only redirect if we're done loading AND definitely not authenticated
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      }
      setIsChecking(false);
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-transparent z-50">
        <Loading message="Verifying your session..." />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
