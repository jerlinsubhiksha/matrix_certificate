"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// Add a requiredRole property
const SIDEBAR_NAV = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Events", icon: Calendar, href: "/events" },
  { title: "Coordinators", icon: UsersRound, href: "/coordinators", requiredRole: "admin" },
  { title: "Participants", icon: Users, href: "/participants" },
  { title: "Certificates", icon: FileCheck, href: "/certificates" },
  { title: "Email Queue", icon: Mail, href: "/email-queue" },
  { title: "Analytics", icon: BarChart, href: "/analytics" },
  { title: "Logs", icon: Database, href: "/logs", requiredRole: "admin" },
  { title: "Settings", icon: Settings, href: "/settings" },
  { title: "Profile", icon: User, href: "/profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, role, loading, logout, userProfile } = useAuth();

  // Redirect if not logged in or not admin
  React.useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/login");
      } else if (role && role.toLowerCase() !== 'admin') {
        router.push("/coordinator/dashboard");
      }
    }
  }, [currentUser, loading, role, router]);

  // Generate breadcrumb from pathname
  const pathSegments = pathname.split('/').filter(Boolean);

  if (loading || !currentUser || !role || role.toLowerCase() !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
        
        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 bg-card/90 backdrop-blur-xl border-r border-border/40 flex flex-col transition-all duration-300 ease-in-out lg:static 
            ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
            ${collapsed && !mobileOpen ? 'lg:w-20' : 'lg:w-64'}
          `}
        >
          {/* Logo & Toggle */}
          <div className={`flex items-center p-4 shrink-0 border-b border-border/40 ${collapsed && !mobileOpen ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#FFCC00] to-accent flex items-center justify-center text-primary-foreground dark:text-gray-900 font-bold text-sm shadow-sm">
                M
              </div>
              {(!collapsed || mobileOpen) && (
                <span className="font-bold text-lg tracking-tight whitespace-nowrap flex items-center gap-2">
                  <img src="/logo.png" alt="Matrix Logo" className="w-6 h-6 object-contain" />
                  MATRIX
                </span>
              )}
            </div>
            
            {/* Desktop Collapse Toggle */}
            <button 
              className="hidden lg:flex p-1.5 rounded-md hover:bg-card text-muted-foreground hover:text-foreground transition-colors shrink-0"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            {/* Mobile Close */}
            <button 
              className="lg:hidden p-1.5 rounded-md hover:bg-card text-muted-foreground transition-colors shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 custom-scrollbar">
            {SIDEBAR_NAV.filter(item => !item.requiredRole || item.requiredRole === role).map((item, idx) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link 
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group
                    ${isActive 
                      ? 'bg-accent/10 text-accent font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-accent before:rounded-r-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                    }
                    ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}
                  `}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {(!collapsed || mobileOpen) && (
                    <span className="text-sm whitespace-nowrap">{item.title}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && !mobileOpen && (
                    <div className="absolute left-14 bg-card border border-border px-2 py-1 rounded text-xs opacity-0 pointer-events-none group-hover:opacity-100 z-50 whitespace-nowrap shadow-lg transition-opacity">
                      {item.title}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border/40 shrink-0">
            <button 
              onClick={() => logout()}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all group
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
          {/* Subtle background glow */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />
          
          {/* Top Bar */}
          <header className="h-16 shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 relative z-20">
            
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 bg-card rounded-md border border-border text-muted-foreground"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">Home</Link>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathSegments.length - 1;
                  const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
                  
                  return (
                    <React.Fragment key={href}>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                      {isLast ? (
                         <span className="text-foreground font-semibold">{formattedSegment}</span>
                      ) : (
                         <Link href={href} className="hover:text-foreground transition-colors">{formattedSegment}</Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Right: Search, Notifs, Theme, Avatar */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Search */}
              <div className="hidden md:flex relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-1.5 w-48 lg:w-64 text-sm bg-card/50 border border-border/40 rounded-full focus:outline-none focus:border-accent/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-card/80 transition-colors border border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background"></span>
              </button>
              
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Separator */}
              <div className="w-px h-6 bg-border/50 mx-1 hidden sm:block"></div>

              {/* Avatar */}
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0 overflow-hidden relative">
                   <User className="w-5 h-5" />
                   {/* Optional image overlay */}
                   {/* <img src="/avatar.jpg" className="absolute inset-0 w-full h-full object-cover" /> */}
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-semibold leading-none">{userProfile?.name || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{role || 'Loading...'}</span>
                </div>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </ThemeProvider>
  );
}
