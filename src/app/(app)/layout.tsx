"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Search,
  Bell,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStore } from "@/lib/store";

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
  const { settings } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
                <Link 
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative group
                    ${isActive 
                      ? 'bg-accent/10 text-accent font-semibold shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                    ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}
                  `}
                  title={collapsed ? item.title : undefined}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-accent rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {(!collapsed || mobileOpen) && (
                    <span className="text-sm whitespace-nowrap">{item.title}</span>
                  )}
                  
                  {collapsed && !mobileOpen && (
                    <div className="absolute left-14 bg-background/80 backdrop-blur-xl border border-border/40 px-3 py-1.5 rounded-lg text-xs opacity-0 pointer-events-none group-hover:opacity-100 z-50 whitespace-nowrap shadow-xl transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 font-medium">
                      {item.title}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 shrink-0">
            <Link 
              href="/login"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all group
                ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}
              `}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              {(!collapsed || mobileOpen) && (
                <span className="text-sm font-semibold whitespace-nowrap">Logout</span>
              )}
            </Link>
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
                  const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
                  
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
              <div className="hidden md:flex relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-1.5 w-48 lg:w-64 text-sm bg-background/50 border border-border/30 rounded-full focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted-foreground/50 shadow-inner"
                />
              </div>
              
              <button className="relative p-2 rounded-full hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border-2 border-background"></span>
              </button>
              
              <ThemeToggle />

              <div className="w-px h-6 bg-border/40 mx-1 hidden sm:block"></div>

              <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 overflow-hidden shadow-sm">
                   <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-semibold leading-none">Admin</span>
                </div>
              </Link>
            </div>
          </header>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 custom-scrollbar"
          >
            {children}
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
