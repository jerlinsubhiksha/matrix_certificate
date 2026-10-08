"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";
import { AbstractBackground } from "@/components/ui/abstract-background";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setGoogleAccessToken } = useStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const isAuthenticating = React.useRef(false);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope('https://www.googleapis.com/auth/gmail.send');
  provider.addScope('https://www.googleapis.com/auth/drive.file');

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticating.current) return;
    isAuthenticating.current = true;
    setIsLoading(true);

    if (!auth) {
      toast.error("Firebase not initialized.");
      setIsLoading(false);
      return;
    }
    
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

      if (!res.ok) {
        throw new Error(data.error || "Access Denied");
      }

      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: data.role
      });
      
      toast.success(`Welcome back! Logged in as ${data.role}`);
      
      if (data.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/coordinator/dashboard");
      }
      
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log('Sign-in popup closed or cancelled by user');
      } else {
        console.error("Auth error:", error);
        toast.error(error.message || "Failed to log in.");
      }
    } finally {
      setIsLoading(false);
      isAuthenticating.current = false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative z-0 bg-transparent">
      <AbstractBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[400px] flex flex-col items-center text-center"
      >
        <img src="/logo.png" alt="Matrix Logo" className="mb-8 h-16 w-16 object-contain dark:invert rounded-2xl" />

        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Certificate management, simplified.
        </h1>
        
        <p className="mb-10 text-base text-muted-foreground sm:text-lg">
          Generate, distribute, and manage event certificates from one place.
        </p>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          {isLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="mt-8 text-xs text-muted-foreground/60">
          Secure access restricted to authorized MATRIX coordinators.
        </p>
      </motion.div>
    </div>
  );
}
