"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Key, 
  ShieldCheck, 
  LogOut,
  Camera,
  Activity,
  Edit3,
  Check,
  X,
  Calendar,
  Layers,
  FileCheck,
  Send,
  Loader2
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, clearUser, events, certificatesGenerated, emailsSent } = useStore();
  const { currentUser, userProfile, role: authRole, logout: authLogout } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive real active profile information
  const activeName = useMemo(() => {
    return (
      userProfile?.name ||
      currentUser?.displayName ||
      user?.displayName ||
      currentUser?.email?.split('@')[0] ||
      "Administrator"
    );
  }, [userProfile, currentUser, user]);

  const activeEmail = useMemo(() => {
    return (
      userProfile?.email ||
      currentUser?.email ||
      user?.email ||
      "admin@matrix.local"
    );
  }, [userProfile, currentUser, user]);

  const activeRole = useMemo(() => {
    const rawRole = userProfile?.role || authRole || user?.role || "Administrator";
    return String(rawRole).charAt(0).toUpperCase() + String(rawRole).slice(1);
  }, [userProfile, authRole, user]);

  const [profileData, setProfileData] = useState({
    name: activeName,
    email: activeEmail
  });

  // Keep state updated when auth / store loads
  useEffect(() => {
    setProfileData({
      name: activeName,
      email: activeEmail
    });
  }, [activeName, activeEmail]);

  const [passwordForm, setPasswordForm] = useState({
    new: "",
    confirm: ""
  });

  // Detect OAuth vs Password provider
  const isGoogleAccount = useMemo(() => {
    return currentUser?.providerData?.some(p => p.providerId === "google.com") ?? false;
  }, [currentUser]);

  const memberSince = useMemo(() => {
    if (currentUser?.metadata?.creationTime) {
      try {
        return new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } catch {
        return "Active";
      }
    }
    return "Active";
  }, [currentUser]);

  const lastSignIn = useMemo(() => {
    if (currentUser?.metadata?.lastSignInTime) {
      try {
        return new Date(currentUser.metadata.lastSignInTime).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return "Current Session";
      }
    }
    return "Current Session";
  }, [currentUser]);

  // Real Workspace Activities
  const recentActivities = useMemo(() => {
    const items = [];

    // 1. Current Session
    items.push({
      title: "Authenticated Session",
      time: lastSignIn,
      desc: `Signed in as ${activeEmail} (${activeRole})`
    });

    // 2. Events status
    if (events && events.length > 0) {
      const latest = events[events.length - 1];
      items.push({
        title: `Active Event: ${latest.name}`,
        time: latest.date || "Scheduled",
        desc: `${latest.participantsCount || 0} participants enrolled`
      });
    } else {
      items.push({
        title: "Workspace Ready",
        time: "Online",
        desc: "Ready to launch new certificate programs"
      });
    }

    // 3. Certificates & Email pipeline
    if (certificatesGenerated > 0 || emailsSent > 0) {
      items.push({
        title: "Dispatch Pipeline",
        time: "Production",
        desc: `${certificatesGenerated} certificates rendered · ${emailsSent} emails sent`
      });
    } else {
      items.push({
        title: "Certificate Dispatch Engine",
        time: "Standby",
        desc: "Google Workspace & PDF rendering engine connected"
      });
    }

    return items;
  }, [lastSignIn, activeEmail, activeRole, events, certificatesGenerated, emailsSent]);

  const handleSaveProfile = async () => {
    setIsEditing(false);
    setIsSaved(true);

    // Save locally
    if (user) {
      setUser({ ...user, displayName: profileData.name });
    }

    // Sync to Firebase if available
    try {
      if (currentUser) {
        const { updateProfile } = await import("firebase/auth");
        await updateProfile(currentUser, { displayName: profileData.name });
      }
      toast.success("Profile updated successfully!");
    } catch (e) {
      console.warn("Could not sync profile name to auth:", e);
      toast.success("Profile saved locally!");
    }

    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordForm.new.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      if (currentUser) {
        const { updatePassword } = await import("firebase/auth");
        await updatePassword(currentUser, passwordForm.new);
        toast.success("Password updated successfully!");
        setIsPasswordModalOpen(false);
        setPasswordForm({ new: "", confirm: "" });
      } else {
        toast.error("You must be logged in to update your password.");
      }
    } catch (err: any) {
      console.error("Password update error:", err);
      if (err?.code === "auth/requires-recent-login") {
        toast.error("Please re-login to change your password for security purposes.");
      } else {
        toast.error(err?.message || "Failed to update password.");
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      if (user) {
        setUser({ ...user, photoURL: url });
      }
      toast.success("Avatar updated!");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      await authLogout();
      clearUser();
      router.push("/login");
    } catch (e) {
      console.error("Logout error:", e);
      clearUser();
      router.push("/login");
    }
  };

  if (!mounted) return null;

  const currentDisplayAvatar = avatarUrl || user?.photoURL || currentUser?.photoURL;

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto pb-10">
      
      {/* Header Profile Cover & Avatar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-16"
      >
        <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-blue-600/20 via-pink-500/10 to-purple-600/20 overflow-hidden relative border border-border/20 shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2" />
        </div>
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Change avatar">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <div className="w-32 h-32 rounded-3xl bg-card border-4 border-background overflow-hidden flex items-center justify-center shadow-xl relative z-10">
              {currentDisplayAvatar ? (
                <img src={currentDisplayAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-muted-foreground/40" />
              )}
            </div>
            <div className="absolute inset-0 z-20 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="pb-4 z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm">
              {profileData.name}
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-foreground/80">{activeRole}</span>
              <span className="text-xs text-muted-foreground">• Joined {memberSince}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute -bottom-12 right-8 flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-5 py-2.5 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile} 
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-md"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-2 px-5 py-2.5 bg-card/90 backdrop-blur-3xl border border-border/40 rounded-xl font-semibold hover:bg-muted/60 transition-colors shadow-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2 space-y-8"
        >
          {/* Personal Info */}
          <div className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6">Account Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profileData.name} 
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl focus:border-accent outline-none shadow-inner" 
                  />
                ) : (
                  <div className="px-4 py-3 bg-background/60 border border-border/20 rounded-xl font-medium">{profileData.name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                <div className="px-4 py-3 bg-background/60 border border-border/20 rounded-xl font-medium text-foreground flex items-center justify-between">
                  <span className="truncate">{profileData.email}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 font-semibold shrink-0 ml-2">Verified</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Role / Permissions</label>
                <div className="px-4 py-3 bg-background/60 border border-border/20 rounded-xl font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>{activeRole}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Member Since</label>
                <div className="px-4 py-3 bg-background/60 border border-border/20 rounded-xl font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{memberSince}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security & Authentication */}
          <div className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Security & Authentication</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-5 bg-background/60 rounded-2xl border border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {isGoogleAccount ? "Google Workspace Single Sign-On" : "Account Password"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isGoogleAccount 
                      ? "Authentication is managed securely by your Google Account." 
                      : `Last active session: ${lastSignIn}`
                    }
                  </p>
                </div>
              </div>

              {isGoogleAccount ? (
                <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold rounded-xl text-xs">
                  Google Verified
                </span>
              ) : (
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-foreground text-background font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  Update Password
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Live Activity & Workspace Status */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-8 shadow-sm h-fit flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-bold">Workspace Status</h3>
            </div>
            
            <div className="space-y-6">
              {recentActivities.map((act, i) => (
                <div key={i} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-24px] last:before:hidden before:w-px before:bg-border/40">
                  <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-background"></div>
                  <h4 className="text-sm font-bold text-foreground">{act.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-1">{act.time}</p>
                  <p className="text-sm text-foreground/80 leading-snug">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-border/20">
            <button 
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold rounded-xl transition-colors border border-red-500/20 active:scale-98"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>
      </div>

      {/* Password Modal (For Email/Password users) */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsPasswordModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <h2 className="text-xl font-bold">Update Account Password</h2>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-1 hover:bg-muted rounded-md text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdatePassword} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">New Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="Minimum 6 characters"
                    value={passwordForm.new}
                    onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Confirm New Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="Re-enter new password"
                    value={passwordForm.confirm}
                    onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsPasswordModalOpen(false)} 
                    className="px-4 py-2 font-medium hover:bg-muted rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmittingPassword}
                    className="px-5 py-2 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    {isSubmittingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
