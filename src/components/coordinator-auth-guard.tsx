"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export function CoordinatorAuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/login");
      } else if (role && role.toLowerCase() !== "coordinator") {
        // If they are admin or something else, redirect to main dashboard
        router.push("/dashboard");
      }
    }
  }, [currentUser, loading, role, router]);

  if (loading || !currentUser || !role || role.toLowerCase() !== "coordinator") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 animate-pulse">Verifying coordinator access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
