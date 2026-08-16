"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Award, 
  FileBadge, 
  FileSignature, 
  History, 
  Settings, 
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const ADMIN_LINKS = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Coordinators", href: "/admin/coordinators", icon: Users },
  { name: "Participants", href: "/admin/participants", icon: FileBadge },
  { name: "Templates", href: "/admin/templates", icon: FileSignature },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const COORDINATOR_LINKS = [
  { name: "Overview", href: "/coordinator/dashboard", icon: LayoutDashboard },
  { name: "My Events", href: "/coordinator/events", icon: Calendar },
  { name: "Participants", href: "/coordinator/participants", icon: Users },
  { name: "Certificates", href: "/coordinator/certificates", icon: Award },
  { name: "Activity", href: "/coordinator/activity", icon: History },
];

export function Sidebar({ type }: { type: "admin" | "coordinator" }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { userProfile, role, logout } = useAuth();
  
  const userName = userProfile?.name || "User";
  
  const links = type === "admin" ? ADMIN_LINKS : COORDINATOR_LINKS;
  
  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      className="bg-card/90 backdrop-blur-xl border-r border-border/40 min-h-screen flex flex-col relative z-20 transition-all duration-300"
    >
      <div className={`h-16 flex items-center px-4 border-b border-border/40 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#FFCC00] to-accent flex items-center justify-center text-primary-foreground dark:text-gray-900 font-bold text-sm shadow-sm">
            M
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-lg text-foreground whitespace-nowrap flex items-center gap-2"
              >
                <img src="/logo.png" alt="Matrix Logo" className="w-6 h-6 object-contain" />
                MATRIX
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-md hover:bg-card text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link key={link.name} href={link.href}>
                <div
                  className={clsx(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 group",
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-accent/10 rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon 
                    size={20} 
                    className={clsx("relative z-10", isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground")} 
                  />
                  
                  {!collapsed && (
                    <span className="relative z-10">{link.name}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/40 space-y-2">
        <Link href={`/${type === "admin" ? "admin" : "coordinator"}/profile`} className={clsx(
          "flex items-center gap-3 p-2 rounded-xl hover:bg-card/50 cursor-pointer transition-colors",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold flex-shrink-0 uppercase">
            {userName.charAt(0)}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{role || type}</p>
            </div>
          )}
        </Link>
        <button 
          onClick={() => logout()}
          className={clsx(
            "w-full flex items-center gap-3 p-2 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all group",
            collapsed ? "justify-center" : ""
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          {!collapsed && (
            <span className="text-sm font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
