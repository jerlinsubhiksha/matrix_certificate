"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";
import toast from "react-hot-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!auth) {
      toast.error("Firebase Auth is not initialized. Please check your configuration.");
      return;
    }
    
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      
      toast.success("Successfully logged in!");
      
      // Set a simple cookie to satisfy middleware (in a real app, use Firebase Admin to set a session cookie)
      document.cookie = "__session=true; path=/; max-age=3600";
      
      // We will redirect to dashboard, but let's decide which one based on the email domain or role later.
      // For now, redirect to /admin/dashboard
      router.push("/admin/dashboard");
      
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Top bar for Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-10 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground dark:text-gray-900 font-bold text-xl shadow-lg">
              M
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-2xl tracking-tight text-primary">MATRIX</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Certificate System</span>
            </div>
          </Link>

          {/* Login Card */}
          <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Subtle top border highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-50" />
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to manage your certificates.</p>
            </div>

            <div className="space-y-4">
              {/* Fake Google Sign-In Button (just UI as requested) */}
              <button 
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border hover:bg-muted transition-colors rounded-xl font-medium shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isLoading ? "Signing in..." : "Continue with Google"}
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground uppercase">Or</span>
                </div>
              </div>
              
              <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity">
                Instant Login as Admin
              </Link>
            </div>
            
          </div>
          
          {/* Security Indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground opacity-80">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <p className="text-xs font-medium">Secured by enterprise-grade encryption</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
