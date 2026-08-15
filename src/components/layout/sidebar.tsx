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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import clsx from "clsx";

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
  
  const links = type === "admin" ? ADMIN_LINKS : COORDINATOR_LINKS;
  
  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      className="bg-white border-r border-[#E2E8F0] min-h-screen flex flex-col relative z-20 transition-all duration-300"
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0]">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg text-[#0F172A] whitespace-nowrap"
            >
              MATRIX
            </motion.div>
          )}
        </AnimatePresence>
        
        {collapsed && (
          <div className="font-bold text-lg text-[#0F172A] w-full text-center mx-auto">
            M
          </div>
        )}

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-5 bg-white border border-[#E2E8F0] rounded-full p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 z-30"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
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
                      ? "text-blue-700"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-blue-50 rounded-xl"
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
                    className={clsx("relative z-10", isActive ? "text-blue-600" : "text-[#64748B] group-hover:text-[#0F172A]")} 
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

      <div className="p-4 border-t border-[#E2E8F0]">
        <div className={clsx(
          "flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-[#0F172A] truncate">Admin User</p>
              <p className="text-xs text-[#64748B] truncate">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
