"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Award, ShieldCheck, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";

const STATS = [
  { label: "Certificates", value: "12,482", trend: "+12.4%", icon: Award, color: "blue" },
  { label: "Active Events", value: "24", trend: "+4 this month", icon: TrendingUp, color: "indigo" },
  { label: "Coordinators", value: "18", trend: null, icon: Users, color: "slate" },
  { label: "Verification", value: "8,942", trend: "+18.2%", icon: ShieldCheck, color: "emerald" },
];

export default function AdminDashboard() {
  const { user } = useStore();
  const [stats, setStats] = useState([
    { label: "Certificates", value: "...", trend: null, icon: Award, color: "blue" },
    { label: "Active Events", value: "...", trend: null, icon: TrendingUp, color: "indigo" },
    { label: "Coordinators", value: "...", trend: null, icon: Users, color: "slate" },
    { label: "Verification", value: "...", trend: null, icon: ShieldCheck, color: "emerald" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!db) return;
        
        // In a real app with large collections, getCountFromServer is very efficient
        const certsSnap = await getCountFromServer(collection(db, "certificates"));
        const eventsSnap = await getCountFromServer(collection(db, "events"));
        const usersSnap = await getCountFromServer(collection(db, "users"));
        
        setStats([
          { label: "Certificates", value: certsSnap.data().count.toString(), trend: "0%", icon: Award, color: "blue" },
          { label: "Active Events", value: eventsSnap.data().count.toString(), trend: "0%", icon: TrendingUp, color: "indigo" },
          { label: "Coordinators", value: usersSnap.data().count.toString(), trend: "0%", icon: Users, color: "slate" },
          { label: "Verification", value: certsSnap.data().count.toString(), trend: "0%", icon: ShieldCheck, color: "emerald" },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats from Firestore", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] tracking-tight">
          Good morning, {user?.displayName || "Admin"} 👋
        </h1>
        <p className="text-[#64748B] mt-2">Here's what's happening with MATRIX certifications today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
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
                <div className={clsx(
                  "p-2 rounded-lg",
                  stat.color === 'blue' && "bg-blue-50 text-blue-600",
                  stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                  stat.color === 'slate' && "bg-slate-50 text-slate-600",
                  stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                )}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-[#0F172A]">{stat.value}</h3>
                {stat.trend && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ArrowUpRight size={12} />
                    {stat.trend}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] h-96 flex flex-col">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Certificate Activity</h3>
          <div className="flex-1 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-center">
            <span className="text-[#64748B] text-sm">Chart Component Placeholder (Recharts)</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0F172A]">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                  <Award size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Batch Approved</p>
                  <p className="text-xs text-[#64748B] mt-0.5">Matrix Hackathon 2026 • 248 certs</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
