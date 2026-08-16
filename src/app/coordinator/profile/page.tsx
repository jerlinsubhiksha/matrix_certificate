"use client";

import React, { useState, useEffect, useRef } from "react";
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
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { userProfile, currentUser, logout, role } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    setMounted(true);
    if (userProfile || currentUser) {
      setProfileData({
        name: userProfile?.name || currentUser?.displayName || "Coordinator",
        email: userProfile?.email || currentUser?.email || ""
      });
    }
  }, [userProfile, currentUser]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    // Mock save password
    setIsPasswordModalOpen(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
    alert("Password updated successfully!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto pb-10">
      
      {/* Header Profile Cover & Avatar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-16"
      >
        <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-accent/20 via-blue-500/10 to-purple-500/20 overflow-hidden relative border border-border/20">
          {/* Abstract background shapes */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <div className="w-32 h-32 rounded-3xl bg-card border-4 border-background overflow-hidden flex items-center justify-center shadow-xl relative z-10">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-muted-foreground/30" />
              )}
            </div>
            <div className="absolute inset-0 z-20 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="pb-4 z-10">
            <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">
              {profileData.name}
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-1.5 mt-1 capitalize">
              <ShieldCheck className="w-4 h-4 text-green-500" /> {role || "Coordinator"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute -bottom-12 right-8 flex items-center gap-3">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveProfile} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]">
                <Check className="w-4 h-4" /> Save
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-card backdrop-blur-3xl border border-border/30 rounded-xl font-semibold hover:bg-muted/50 transition-colors shadow-sm">
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
          <div className="bg-card backdrop-blur-3xl border border-border/30 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xl font-bold mb-6">Personal Information</h3>
            
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
                  <div className="px-4 py-3 bg-background/50 rounded-xl font-medium">{profileData.name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={profileData.email} 
                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl focus:border-accent outline-none shadow-inner" 
                  />
                ) : (
                  <div className="px-4 py-3 bg-background/50 rounded-xl font-medium">{profileData.email}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Security */}
          <div className="bg-card backdrop-blur-3xl border border-border/30 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h3 className="text-xl font-bold mb-6">Security</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Key className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold">Password</h4>
                  <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 bg-foreground text-background font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Update Password
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card backdrop-blur-3xl border border-border/30 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-fit"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold">Recent Activity</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { title: "Logged in", time: "Just now", desc: "From IP 192.168.1.1 (Mac OS)" },
              { title: "Updated Event", time: "2 hours ago", desc: "Edited 'Advanced React Patterns'" },
              { title: "Generated Certificates", time: "Yesterday", desc: "Batch of 45 certificates issued." },
            ].map((activity, i) => (
              <div key={i} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-24px] last:before:hidden before:w-px before:bg-border/40">
                <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-accent ring-4 ring-background"></div>
                <h4 className="text-sm font-bold">{activity.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 mb-1">{activity.time}</p>
                <p className="text-sm text-foreground/80">{activity.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-6 border-t border-border/20">
            <button 
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold rounded-xl transition-colors border border-red-500/20"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>
      </div>

      {/* Password Modal */}
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
                <h2 className="text-xl font-bold">Update Password</h2>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-1 hover:bg-muted rounded-md text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdatePassword} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Current Password</label>
                  <input 
                    required type="password" 
                    value={passwordForm.current}
                    onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">New Password</label>
                  <input 
                    required type="password" 
                    value={passwordForm.new}
                    onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Confirm New Password</label>
                  <input 
                    required type="password" 
                    value={passwordForm.confirm}
                    onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 font-medium hover:bg-muted rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Update Password
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
