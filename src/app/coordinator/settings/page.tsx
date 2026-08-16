"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Mail, 
  Shield, 
  Bell, 
  CreditCard,
  Save,
  Check,
  KeyRound,
  Smartphone,
  Clock,
  Zap,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";
import { useStore, AppSettings } from "@/lib/store";

const TABS = [
  { id: "general", label: "General", icon: Building2 },
  { id: "email", label: "Email config", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const { settings: globalSettings, updateSettings, certificatesGenerated } = useStore();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaved, setIsSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for edits before saving
  const [local, setLocal] = useState<AppSettings | null>(null);

  useEffect(() => {
    setLocal(globalSettings);
  }, [globalSettings]);

  if (!local) return null;

  const handleSave = () => {
    updateSettings(local);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const update = (key: keyof AppSettings, value: any) => {
    setLocal(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update("logoUrl", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto pb-10">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 relative z-20"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Settings</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Manage your workspace preferences and configurations.</p>
        </div>
        
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 font-semibold rounded-xl transition-all shadow-md
            ${isSaved ? 'bg-green-500 text-white scale-105' : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95'}
          `}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? "Saved" : "Save Changes"}
        </button>
      </motion.header>

      {/* Main Content Area - Split Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full md:w-64 shrink-0 flex flex-col gap-2"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors w-full text-left z-10 ${
                activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-card/60 backdrop-blur-3xl border border-border/40 rounded-2xl shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-accent' : ''}`} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-8 lg:p-10 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-1">Workspace Profile</h3>
                  <p className="text-sm text-muted-foreground">This is your organization's public profile.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Workspace Name</label>
                    <input 
                      type="text" 
                      value={local.workspaceName} 
                      onChange={e => update("workspaceName", e.target.value)}
                      className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Support Email</label>
                    <input 
                      type="email" 
                      value={local.supportEmail} 
                      onChange={e => update("supportEmail", e.target.value)}
                      className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-border/20">
                    <h4 className="text-sm font-bold mb-4">Branding</h4>
                    <div className="flex items-center gap-6 group">
                      <div 
                        onClick={() => logoInputRef.current?.click()}
                        className="w-24 h-24 bg-background/80 rounded-2xl border border-border/40 flex items-center justify-center overflow-hidden relative cursor-pointer group-hover:border-accent/50 group-hover:shadow-lg transition-all duration-300"
                      >
                        <img src={local.logoUrl || "/logo.png"} alt="Workspace Logo" className="w-16 h-16 object-contain z-10 group-hover:scale-110 transition-transform duration-500" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <ImageIcon className="w-8 h-8 text-muted-foreground absolute" />
                        
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs font-bold text-foreground">Change</span>
                        </div>
                      </div>
                      <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
                      <button 
                        onClick={() => logoInputRef.current?.click()}
                        className="px-5 py-2.5 bg-muted hover:bg-foreground hover:text-background rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 border border-border/40 hover:border-transparent hover:shadow-md"
                      >
                        Upload new logo
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "email" && (
              <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-1">Email Configuration</h3>
                  <p className="text-sm text-muted-foreground">Setup SMTP and sender details for certificate delivery.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Sender Name</label>
                    <input 
                      type="text" 
                      value={local.senderName} 
                      onChange={e => update("senderName", e.target.value)}
                      className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">SMTP Host</label>
                      <input 
                        type="text" 
                        value={local.smtpHost} 
                        onChange={e => update("smtpHost", e.target.value)}
                        className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Port</label>
                      <input 
                        type="text" 
                        value={local.smtpPort} 
                        onChange={e => update("smtpPort", e.target.value)}
                        className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-border/20">
                    <div>
                      <h4 className="font-semibold">Require TLS</h4>
                      <p className="text-xs text-muted-foreground mt-1">Encrypt email transmission</p>
                    </div>
                    <CustomToggle checked={local.requireTls} onChange={(v) => update("requireTls", v)} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /> Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage access controls and authentication protocols.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-border/20 group hover:border-accent/30 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Two-Factor Authentication (2FA)</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Require an extra security step when logging in.</p>
                      </div>
                    </div>
                    <CustomToggle checked={local.twoFactorAuth} onChange={(v) => update("twoFactorAuth", v)} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-border/20 group hover:border-accent/30 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Session Timeout</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Automatically log out inactive users.</p>
                      </div>
                    </div>
                    <select 
                      value={local.sessionTimeout}
                      onChange={e => update("sessionTimeout", e.target.value)}
                      className="bg-background border border-border/40 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-accent"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button className="flex items-center gap-2 text-sm font-semibold text-accent hover:opacity-80 transition-opacity">
                      <KeyRound className="w-4 h-4" /> Manage API Keys
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Bell className="w-5 h-5 text-accent" /> Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Control when and how you receive alerts.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-border/20 group hover:border-accent/30 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm">Email Alerts for Completed Batches</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Receive a summary when a certificate dispatch completes.</p>
                    </div>
                    <CustomToggle checked={local.emailAlerts} onChange={(v) => update("emailAlerts", v)} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-border/20 group hover:border-accent/30 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm">System Updates & Feature News</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Get notified about new platform features.</p>
                    </div>
                    <CustomToggle checked={local.systemUpdates} onChange={(v) => update("systemUpdates", v)} />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}

// Custom Apple-style Toggle Component
function CustomToggle({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div 
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
      onClick={() => onChange(!checked)}
    >
      <motion.div 
        className="w-5 h-5 bg-white rounded-full shadow-md"
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ originX: checked ? 1 : 0 }}
        animate={{ x: checked ? 24 : 0 }}
      />
    </div>
  );
}
