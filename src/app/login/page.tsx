"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { currentUser, loading, role } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && !loading && role) {
      if (role.toLowerCase() === 'admin') {
        router.push("/dashboard");
      } else {
        router.push("/coordinator/dashboard");
      }
    }
  }, [currentUser, loading, role, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      // Note: We don't push immediately here because we need to wait for AuthContext to fetch the role.
      // The useEffect above will handle the redirect once the role is loaded!
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to login. Please check credentials.");
      setIsSubmitting(false); // Only reset if failed, so the button stays spinning while redirecting
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
              <span className="font-bold text-2xl tracking-tight text-primary flex items-center gap-2">
                <img src="/logo.png" alt="Matrix Logo" className="w-8 h-8 object-contain" />
                MATRIX
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Certificate System</span>
            </div>
          </Link>

          {/* Login Card */}
          <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-50" />
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to manage your certificates.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@matrix.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                First time logging in? <Link href="/setup" className="text-primary hover:underline font-medium">Set your password</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground opacity-80">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <p className="text-xs font-medium">Secured by Firebase Authentication</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
