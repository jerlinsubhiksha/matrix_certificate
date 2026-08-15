"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Award, ShieldAlert } from "lucide-react";

const STATS = [
  { label: "Assigned Events", value: "0", icon: Calendar, color: "blue" },
  { label: "Participants", value: "0", icon: Users, color: "indigo" },
  { label: "Certificates Generated", value: "0", icon: Award, color: "emerald" },
  { label: "Pending Approval", value: "0", icon: ShieldAlert, color: "amber" },
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
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white border border-[#E2E8F0] rounded-2xl">
            <Calendar className="w-8 h-8 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No events assigned yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
