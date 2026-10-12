"use client";

import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";

export function TopHeader() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <span>Dashboard</span>
        <span>/</span>
        <span className="font-medium text-[#0F172A]">Overview</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Command Palette Mock */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] transition-colors w-64">
          <Search size={16} />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-sans bg-white border border-gray-200 rounded text-gray-500">
            ⌘K
          </kbd>
        </button>

        <div className="h-4 w-px bg-gray-200 mx-2" />

        <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="relative text-[#64748B] hover:text-[#0F172A] transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
