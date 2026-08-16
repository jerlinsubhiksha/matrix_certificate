"use client";

import React from "react";
import { Search, Bell, HelpCircle, User, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopHeader() {
  const { userProfile, role } = useAuth();
  const pathname = usePathname();
  const allSegments = pathname.split('/').filter(Boolean);
  const pathSegments = allSegments.filter(s => s !== "coordinator");

  return (
    <header className="h-16 shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 relative z-20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground lg:ml-2">
        <Link href="/coordinator/dashboard" className="hover:text-foreground transition-colors">Home</Link>
        {pathSegments.map((segment, index) => {
          const actualIndex = allSegments.indexOf(segment);
          const href = `/${allSegments.slice(0, actualIndex + 1).join('/')}`;
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

      <div className="flex items-center gap-3 lg:gap-4">
        {/* Command Palette Mock */}
        <div className="hidden md:flex relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-1.5 w-48 lg:w-64 text-sm bg-card/50 border border-border/40 rounded-full focus:outline-none focus:border-accent/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <button className="relative p-2 rounded-full hover:bg-card/80 transition-colors border border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background"></span>
        </button>

        <ThemeToggle />

        <div className="w-px h-6 bg-border/50 mx-1 hidden sm:block"></div>

        <Link href="/coordinator/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0 overflow-hidden relative">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-semibold leading-none">{userProfile?.name || 'Coordinator'}</span>
            <span className="text-[10px] text-muted-foreground uppercase">{role || 'Loading...'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
