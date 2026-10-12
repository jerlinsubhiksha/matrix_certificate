"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";
import { AbstractBackground } from "@/components/ui/abstract-background";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setGoogleAccessToken } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // Check for redirect sign-in result when returning from Google redirect
  useEffect(() => {
    if (!auth) return;
    let isMounted = true;

    getRedirectResult(auth)
      .then(async (result) => {
        if (!isMounted || !result || !result.user) return;
        setIsLoading(true);

        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          setGoogleAccessToken(credential.accessToken);
        }

        const idToken = await result.user.getIdToken();
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Access Denied");

        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: data.role,
        });

        toast.success(`Welcome back! Logged in as ${data.role}`);
        if (data.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/coordinator/dashboard");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Redirect sign-in error:", err);
        toast.error(err.message || "Failed to log in.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router, setGoogleAccessToken, setUser]);

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (!auth) {
      toast.error("Firebase client is not initialized.");
      setIsLoading(false);
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
      }

      const idToken = await user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Access Denied");

      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: data.role,
      });

      toast.success(`Welcome back! Logged in as ${data.role}`);
      if (data.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/coordinator/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);

      if (error.code === "auth/popup-blocked") {
        toast("Popup blocked by browser. Redirecting to Google...", { icon: "🌐" });
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr: any) {
          console.error("Redirect error:", redirectErr);
          toast.error(redirectErr.message || "Failed to redirect.");
        }
      } else if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        console.log("Sign-in popup closed or cancelled by user");
      } else if (error.code === "auth/unauthorized-domain") {
        const host = typeof window !== "undefined" ? window.location.hostname : "this domain";
        toast.error(`Domain "${host}" is not added in Firebase authorized domains. Please add it in Firebase Console -> Auth -> Settings -> Authorized Domains.`, { duration: 8000 });
      } else {
        toast.error(error.message || "Failed to log in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative z-0 bg-transparent">
      <AbstractBackground />
      <motion.div 
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl bg-background/50 backdrop-blur-2xl border border-border/40 shadow-2xl relative overflow-hidden card-shine"
      >
        <div className="animate-float-gentle">
          <img src="/logo.png" alt="Matrix Logo" className="mb-6 h-16 w-16 object-contain dark:invert rounded-2xl drop-shadow-md" />
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400">
          Certificate management, simplified.
        </h1>
        
        <p className="mb-8 text-sm text-muted-foreground sm:text-base leading-relaxed">
          Generate, distribute, and manage event certificates seamlessly from one dashboard.
        </p>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 text-sm font-semibold shadow-[0_4px_25px_rgba(59,130,246,0.35)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed card-shine"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
        </button>

        <p className="mt-8 text-xs text-muted-foreground/70">
          Secure access restricted to authorized MATRIX coordinators.
        </p>
      </motion.div>
    </div>
  );
}
