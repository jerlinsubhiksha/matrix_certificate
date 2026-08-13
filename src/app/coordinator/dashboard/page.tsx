"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Award, ShieldAlert } from "lucide-react";

const STATS = [
  { label: "Assigned Events", value: "3", icon: Calendar, color: "blue" },
  { label: "Participants", value: "428", icon: Users, color: "indigo" },
  { label: "Certificates Generated", value: "312", icon: Award, color: "emerald" },
  { label: "Pending Approval", value: "27", icon: ShieldAlert, color: "amber" },
];

export default function CoordinatorDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] tracking-tight">Welcome back, Sarah 👋</h1>
        <p className="text-[#64748B] mt-2">Here's what needs your attention today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
                <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-[#0F172A]">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-[#0F172A] mb-6">My Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Matrix Hackathon 2026", date: "12-14 Aug 2026", status: "Active", progress: 72 },
            { name: "Design Workshop", date: "15 Sep 2026", status: "Upcoming", progress: 0 },
          ].map((event, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-[#0F172A]">{event.name}</h4>
                  <p className="text-sm text-[#64748B] mt-1">{event.date}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${event.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  {event.status}
                </span>
              </div>
              
              <div className="mt-auto pt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#64748B]">Certificate Progress</span>
                  <span className="font-medium text-[#0F172A]">{event.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${event.progress}%` }} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
