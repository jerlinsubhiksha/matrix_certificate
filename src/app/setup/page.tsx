"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import toast from "react-hot-toast";

export default function SetupPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to set up account");
      }

      // If API succeeds, the password is set! Now log them in securely.
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Password set successfully! Logging you in...");
      router.push("/coordinator/dashboard");
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to set up account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-3 mb-10 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              M
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-2xl tracking-tight text-indigo-600 flex items-center gap-2">
                <img src="/logo.png" alt="Matrix Logo" className="w-8 h-8 object-contain" />
                MATRIX
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Coordinator Setup</span>
            </div>
          </Link>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-50" />
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Setup Password</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your whitelisted email and choose a password.</p>
            </div>

            <form onSubmit={handleSetup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="coordinator@matrix.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Set Password & Login"}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Already set your password? Log in
              </Link>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <p className="text-xs font-medium">Secured by Firebase Authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}
