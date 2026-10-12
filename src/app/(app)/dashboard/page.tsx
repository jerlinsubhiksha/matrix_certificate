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
import { Card3D } from "@/components/ui/card-3d";

export default function DashboardPage() {
  const { events, coordinators, emailJobs, user } = useStore();
  
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  const realCertificates = emailJobs.filter(j => j.status === 'Completed').length;
  const realEmailsSent = emailJobs.filter(j => j.status === 'Completed').length;
  const pendingEmails = emailJobs.filter(j => ['Pending', 'Generating', 'Sending'].includes(j.status)).length;
  const failedEmails = emailJobs.filter(j => j.status === 'Failed').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-10"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col gap-1 border-b border-border/40 pb-6">
        <h4 className="text-sm text-muted-foreground font-medium">Dashboard Overview</h4>
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Welcome back, {user?.displayName || 'User'}</h1>
      </motion.header>

      {/* Statistics Row (6 Items) */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Events" value={events.length.toString()} icon={CalendarDays} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Coordinators" value={coordinators.length.toString()} icon={UsersRound} color="text-indigo-500" bg="bg-indigo-500/10" />
        <StatCard title="Certificates" value={realCertificates.toString()} icon={FileCheck} color="text-accent" bg="bg-accent/10" />
        <StatCard title="Emails Sent" value={realEmailsSent.toString()} icon={Mail} color="text-green-500" bg="bg-green-500/10" />
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
              <Card3D maxRotate={7} depth={15} className="w-full">
                <Link href="/events" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-accent hover:bg-accent/5 rounded-2xl transition-all duration-300 group card-shine smooth-spring hover:shadow-lg w-full">
                  <PlusCircle className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-accent group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                  <span className="font-semibold text-sm group-hover:text-accent transition-colors">Create Event</span>
                </Link>
              </Card3D>
              <Card3D maxRotate={7} depth={15} className="w-full">
                <Link href="/coordinators" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-2xl transition-all duration-300 group card-shine smooth-spring hover:shadow-lg w-full">
                  <Settings2 className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-indigo-500 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                  <span className="font-semibold text-sm group-hover:text-indigo-500 transition-colors">Manage Coordinators</span>
                </Link>
              </Card3D>
              <Card3D maxRotate={7} depth={15} className="w-full">
                <Link href="/certificates" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-blue-500 hover:bg-blue-500/5 rounded-2xl transition-all duration-300 group card-shine smooth-spring hover:shadow-lg w-full">
                  <FolderOpen className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-blue-500 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                  <span className="font-semibold text-sm group-hover:text-blue-500 transition-colors">View Certificates</span>
                </Link>
              </Card3D>
              <Card3D maxRotate={7} depth={15} className="w-full">
                <Link href="/email-queue" className="flex flex-col items-center justify-center p-6 bg-background/50 border border-border/50 hover:border-amber-500 hover:bg-amber-500/5 rounded-2xl transition-all duration-300 group card-shine smooth-spring hover:shadow-lg w-full">
                  <Send className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-amber-500 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                  <span className="font-semibold text-sm group-hover:text-amber-500 transition-colors">View Email Queue</span>
                </Link>
              </Card3D>
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
          <motion.section variants={itemVariants} className="bg-gradient-to-br from-card/80 to-accent/5 backdrop-blur-xl border border-accent/20 rounded-xl p-6 flex flex-col shadow-sm card-shine">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">System Status</h2>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">All services are operating normally.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-background/40 border border-border/20 transition-all hover:border-accent/30">
                <span className="text-muted-foreground">Certificate Generation</span>
                <span className="text-green-500 font-medium flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-background/40 border border-border/20 transition-all hover:border-accent/30">
                <span className="text-muted-foreground">Email Dispatch</span>
                <span className="text-green-500 font-medium flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-background/40 border border-border/20 transition-all hover:border-accent/30">
                <span className="text-muted-foreground">Database Sync</span>
                <span className="text-green-500 font-medium flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </span>
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
    <Card3D maxRotate={9} depth={20} className="w-full">
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 flex flex-col gap-3 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/15 transition-all relative overflow-hidden card-shine group h-full"
      >
        <div className="flex items-center justify-between relative z-10" style={{ transform: "translateZ(12px)" }}>
          <h3 className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
          <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <span className="text-2xl font-black relative z-10 tracking-tight" style={{ transform: "translateZ(20px)" }}>{value}</span>
        {/* Subtle glowing ambient aura */}
        <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${bg} rounded-full blur-2xl opacity-40 group-hover:opacity-90 transition-opacity duration-300`} />
      </motion.div>
    </Card3D>
  );
}
