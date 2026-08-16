"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  UsersRound, 
  FileCheck, 
  Mail, 
  Clock, 
  XCircle,
  PlusCircle,
  Settings2,
  FolderOpen,
  Send,
  Calendar,
  BarChartIcon,
  Inbox
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const { events, coordinators, certificatesGenerated, emailsSent } = useStore();
  
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  const pendingEmails = Math.floor(emailsSent * 0.1); // Mock data for pending
  const failedEmails = Math.floor(emailsSent * 0.02); // Mock data for failed

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-10"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h4 className="text-sm text-muted-foreground font-medium">Dashboard Overview</h4>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Welcome back, Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all shadow-sm"
          >
            <PlusCircle size={16} />
            New Event
          </Link>
          <Link
            href="/email-queue"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
          >
            <Send size={16} />
            Resume Sending
          </Link>
        </div>
      </motion.header>

      {/* Statistics Row (6 Items) */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Events" value={events.length.toString()} icon={CalendarDays} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Coordinators" value={coordinators.length.toString()} icon={UsersRound} color="text-indigo-500" bg="bg-indigo-500/10" />
        <StatCard title="Certificates" value={certificatesGenerated.toString()} icon={FileCheck} color="text-accent" bg="bg-accent/10" />
        <StatCard title="Emails Sent" value={emailsSent.toString()} icon={Mail} color="text-green-500" bg="bg-green-500/10" />
        <StatCard title="Pending Emails" value={pendingEmails.toString()} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
        <StatCard title="Failed Emails" value={failedEmails.toString()} icon={XCircle} color="text-red-500" bg="bg-red-500/10" />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        
        {/* Left Column (Primary Content) */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Actions */}
          <motion.section variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Quick Actions</h2>
              <span className="px-2 py-1 bg-muted text-[10px] uppercase font-bold tracking-wider text-muted-foreground rounded">Admin</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/events" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-accent hover:bg-accent/5 rounded-xl transition-all group">
                <PlusCircle className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="font-semibold text-sm">Create Event</span>
              </Link>
              <Link href="/coordinators" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-xl transition-all group">
                <Settings2 className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                <span className="font-semibold text-sm">Manage Coordinators</span>
              </Link>
              <Link href="/certificates" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-blue-500 hover:bg-blue-500/5 rounded-xl transition-all group">
                <FolderOpen className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                <span className="font-semibold text-sm">View Certificates</span>
              </Link>
              <Link href="/email-queue" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-amber-500 hover:bg-amber-500/5 rounded-xl transition-all group">
                <Send className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                <span className="font-semibold text-sm">View Email Queue</span>
              </Link>
            </div>
          </motion.section>

          {/* Recent Events Table */}
          <motion.section variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Recent Events</h2>
            </div>
            <div className="overflow-x-auto border border-border/40 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Event Name</th>
                    <th className="px-4 py-3 font-semibold">Coordinator</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                           <Calendar className="w-6 h-6 mb-3 text-muted-foreground/50" />
                           <p className="font-medium text-sm text-foreground mb-1">No events found</p>
                           <p className="text-xs max-w-sm">No events have been created yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    events.slice(0, 5).map((event) => (
                      <tr key={event.id} className="border-t border-border/40 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{event.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{event.coordinator}</td>
                        <td className="px-4 py-3 text-muted-foreground">{event.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-md ${
                            event.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                            event.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/events/${event.id}`} className="text-accent hover:underline text-xs font-medium">View</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>

        {/* Right Column (Secondary Content) */}
        <div className="flex flex-col gap-6">
          {/* Coordinator Activity */}
          <motion.section variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Top Coordinators</h2>
            </div>
            {coordinators.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                 <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                   <UsersRound className="w-5 h-5 text-muted-foreground" />
                 </div>
                 <p className="text-sm font-medium text-foreground mb-1">No coordinators found</p>
                 <p className="text-xs text-muted-foreground max-w-[200px]">Add coordinators to the system to track their activity.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
                {coordinators.map((coord) => (
                  <div key={coord.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/40 hover:border-accent/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                      {coord.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{coord.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{coord.role}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* System Status */}
          <motion.section variants={itemVariants} className="bg-gradient-to-br from-card/80 to-accent/5 backdrop-blur-xl border border-accent/20 rounded-xl p-6 flex flex-col shadow-sm">
            <h2 className="text-lg font-bold mb-2">System Status</h2>
            <p className="text-sm text-muted-foreground mb-6">All services are operating normally.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Certificate Generation</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email Dispatch</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Database Sync</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
      
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-xl bg-card/50 backdrop-blur-md border border-border/50 flex flex-col gap-3 hover:shadow-lg hover:shadow-accent/5 transition-all relative overflow-hidden"
    >
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <span className="text-2xl font-bold relative z-10">{value}</span>
      {/* Subtle glow */}
      <div className={`absolute -bottom-6 -right-6 w-20 h-20 ${bg} rounded-full blur-2xl opacity-50`} />
    </motion.div>
  );
}
