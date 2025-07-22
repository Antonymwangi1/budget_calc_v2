"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  loadingFallback = <Loader /> // Default loading fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <>{loadingFallback}</>;

  return <>{user ? children : null}</>;
}
