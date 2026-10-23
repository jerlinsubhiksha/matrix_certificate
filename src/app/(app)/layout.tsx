"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UsersRound, 
  FileCheck,
  Mail, 
  BarChart, 
  Database, 
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

const SIDEBAR_NAV = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Events", icon: Calendar, href: "/events" },
  { title: "Coordinators", icon: UsersRound, href: "/coordinators" },
  { title: "Participants", icon: Users, href: "/participants" },
  { title: "Certificates", icon: FileCheck, href: "/certificates" },
  { title: "Email Queue", icon: Mail, href: "/email-queue" },
  { title: "Analytics", icon: BarChart, href: "/analytics" },
  { title: "Logs", icon: Database, href: "/logs" },
  { title: "Settings", icon: Settings, href: "/settings" },
  { title: "Profile", icon: User, href: "/profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { settings, setEvents, setEmailJobs, events, user } = useStore();
  const { role, userProfile, currentUser, logout: contextLogout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      contextLogout();
      router.push('/login');
    } catch (e) {
      console.error('Failed to logout', e);
    }
  };

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  React.useEffect(() => {
    let unsubscribeEvents = () => {};

    const setupSync = async () => {
      try {
        const { db } = await import('@/lib/firebase/client');
        const { collection, onSnapshot } = await import('firebase/firestore');

        if (!db) return;

        // Sync Events in real-time (catch permission errors gracefully)
        unsubscribeEvents = onSnapshot(
          collection(db, "events"), 
          (snapshot) => {
            const eList: any[] = [];
            snapshot.forEach(doc => eList.push({ id: doc.id, ...doc.data() }));
            setEvents(eList);
          },
          (err) => {
            console.warn("Client Firestore live sync skipped (handled via server API):", err.message);
          }
        );
      } catch (e) {
        console.warn("Real-time sync setup skipped", e);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          if (data.events && Array.isArray(data.events)) {
            setEvents(data.events);
          }
        }
      } catch (e) {
        console.error("Failed to fetch events", e);
      }
    };

    const fetchCoordinators = async () => {
      try {
        const response = await fetch('/api/coordinators');
        if (response.ok) {
          const data = await response.json();
          if (data.coordinators) {
             useStore.setState({ coordinators: data.coordinators });
          }
        }
      } catch (e) {
        console.error("Failed to fetch coordinators", e);
      }
    };

    setupSync();
    fetchEvents();
    fetchCoordinators();

    // Poll every 15s to keep events fresh without client-side permission issues
    const pollInterval = setInterval(() => {
      fetchEvents();
    }, 15000);

    return () => {
      unsubscribeEvents();
      clearInterval(pollInterval);
    };
  }, [setEvents]);
  
  React.useEffect(() => {
    const mountTimer = setTimeout(() => setMounted(true), 0);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(timer);
    };
  }, []);

  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  React.useEffect(() => {
    if (!settings?.sessionTimeout || settings.sessionTimeout === 'never') return;
    
    const timeoutMinutes = parseInt(settings.sessionTimeout);
    if (isNaN(timeoutMinutes)) return;
    
    let lastActivity = Date.now();
    const updateActivity = () => { lastActivity = Date.now(); };
    
    // Listen for user interactions
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity, true);
    
    // Check inactivity every minute
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > timeoutMinutes * 60 * 1000) {
        handleLogout();
      }
    }, 60000);
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity, true);
      clearInterval(interval);
    };
  }, [settings?.sessionTimeout, router]);

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
              <img src={settings?.logoUrl ? settings.logoUrl : "/logo.png"} alt="Matrix Logo" className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl animate-pulse" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 text-3xl font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-accent"
            >
              Matrix
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
        
        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 bg-background/60 backdrop-blur-3xl border-r border-border/20 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static shadow-[4px_0_24px_rgba(0,0,0,0.02)]
            ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
            ${collapsed && !mobileOpen ? 'lg:w-20' : 'lg:w-64'}
          `}
        >
          {/* Logo & Toggle */}
          <div className={`flex items-center p-5 shrink-0 border-b border-border/20 ${collapsed && !mobileOpen ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <img src={mounted && settings?.logoUrl ? settings.logoUrl : "/logo.png"} alt="Matrix Logo" className="w-8 h-8 shrink-0 object-contain drop-shadow-sm" />
              {(!collapsed || mobileOpen) && (
                <span className="font-bold text-lg tracking-tight whitespace-nowrap">MATRIX</span>
              )}
            </div>
            
            <button 
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            <button 
              className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 custom-scrollbar">
            {SIDEBAR_NAV.map((item, idx) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <motion.div
                  key={idx}
                  whileHover={{ x: collapsed && !mobileOpen ? 0 : 3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group z-10
                      ${isActive 
                        ? 'text-accent font-semibold' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                      ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}
                    `}
                    title={collapsed ? item.title : undefined}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeSidebarPill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-accent/15 dark:bg-accent/20 border border-accent/30 rounded-xl -z-10 shadow-sm"
                      />
                    )}
                    <item.icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? 'scale-110 text-accent' : 'group-hover:scale-110 group-hover:text-foreground'}`} />
                    {(!collapsed || mobileOpen) && (
                      <span className="text-sm whitespace-nowrap">{item.title}</span>
                    )}
                    
                    {collapsed && !mobileOpen && (
                      <div className="absolute left-14 bg-background/90 backdrop-blur-xl border border-border/40 px-3 py-1.5 rounded-lg text-xs opacity-0 pointer-events-none group-hover:opacity-100 z-50 whitespace-nowrap shadow-xl transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 font-medium">
                        {item.title}
                      </div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <div className="p-4 shrink-0">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all group
                ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}
              `}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              {(!collapsed || mobileOpen) && (
                <span className="text-sm font-semibold whitespace-nowrap">Logout</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
          
          {/* Scroll Progress Bar */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-accent origin-left z-[60]"
            style={{ scaleX }}
          />

          {/* Full-screen animated smoke effect */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-20 dark:opacity-50">
            <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] bg-pink-400/20 dark:bg-pink-600/30 rounded-full blur-[120px] animate-smoke-1" style={{ animation: 'smoke-drift 30s ease-in-out infinite, shimmer-pulse 8s ease-in-out infinite' }} />
            <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-fuchsia-400/20 dark:bg-fuchsia-600/30 rounded-full blur-[140px] animate-smoke-2" style={{ animation: 'smoke-drift-reverse 45s ease-in-out infinite, shimmer-pulse 12s ease-in-out infinite' }} />
            <div className="absolute -bottom-[20%] left-[10%] w-[80vw] h-[80vw] bg-rose-400/20 dark:bg-rose-600/20 rounded-full blur-[150px] animate-smoke-3" style={{ animation: 'smoke-drift 40s ease-in-out infinite reverse, shimmer-pulse 10s ease-in-out infinite' }} />
          </div>
          
          {/* Top Bar */}
          <header className="h-16 shrink-0 border-b border-border/20 bg-background/40 backdrop-blur-2xl flex items-center justify-between px-6 lg:px-10 relative z-20 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">Home</Link>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathSegments.length - 1;
                  let formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
                  
                  // Replace ugly Firebase IDs with actual Event names for a professional look
                  if (segment.length > 15 && events) {
                    const matchedEvent = events.find((e: any) => e.id === segment);
                    if (matchedEvent) {
                      formattedSegment = matchedEvent.name;
                    }
                  }
                  
                  return (
                    <React.Fragment key={href}>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                      {isLast ? (
                         <span className="text-foreground">{formattedSegment}</span>
                      ) : (
                         <Link href={href} className="hover:text-foreground transition-colors">{formattedSegment}</Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-5">
              <ThemeToggle />

              <div className="w-px h-6 bg-border/40 mx-1 hidden sm:block"></div>

              <Link href="/profile" className="flex items-center gap-3 hover:opacity-85 transition-all duration-200 group active:scale-98">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 overflow-hidden shadow-sm group-hover:border-accent/40 group-hover:scale-105 transition-all duration-300">
                   {(user?.photoURL || currentUser?.photoURL) ? (
                     <img src={user?.photoURL || currentUser?.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-4 h-4" />
                   )}
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-semibold leading-none group-hover:text-accent transition-colors">{userProfile?.name || currentUser?.displayName || user?.displayName || currentUser?.email?.split('@')[0] || 'Admin'}</span>
                  <span className="text-xs text-muted-foreground capitalize">{userProfile?.role || role || user?.role || 'Administrator'}</span>
                </div>
              </Link>
            </div>
          </header>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 custom-scrollbar"
          >
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.2);
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.4);
          border: 2px solid transparent;
          background-clip: content-box;
        }
      `}</style>
    </ThemeProvider>
  );
}
