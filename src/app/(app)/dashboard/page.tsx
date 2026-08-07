"use client";

import React from "react";
import Link from "next/link";
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

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-10">
      
      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-border/40 pb-6">
        <h4 className="text-sm text-muted-foreground font-medium">Dashboard Overview</h4>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
      </header>

      {/* Statistics Row (6 Items) - Empty State */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Events" value="0" icon={CalendarDays} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Coordinators" value="0" icon={UsersRound} color="text-indigo-500" bg="bg-indigo-500/10" />
        <StatCard title="Certificates Generated" value="0" icon={FileCheck} color="text-accent" bg="bg-accent/10" />
        <StatCard title="Emails Sent" value="0" icon={Mail} color="text-green-500" bg="bg-green-500/10" />
        <StatCard title="Pending Emails" value="0" icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
        <StatCard title="Failed Emails" value="0" icon={XCircle} color="text-red-500" bg="bg-red-500/10" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        
        {/* Left Column (Primary Content) */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Actions */}
          <section className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Quick Actions</h2>
              <span className="px-2 py-1 bg-muted text-[10px] uppercase font-bold tracking-wider text-muted-foreground rounded">Admin</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/events" className="flex flex-col items-center justify-center p-6 bg-muted/30 border border-border/50 hover:border-accent hover:bg-accent/5 rounded-xl transition-all group">
                <PlusCircle className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="font-semibold text-sm">Create Event</span>
              </Link>
              <Link href="/coordinators" className="flex flex-col items-center justify-center p-6 bg-muted/30 border border-border/50 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-xl transition-all group">
                <Settings2 className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                <span className="font-semibold text-sm">Manage Coordinators</span>
              </Link>
              <Link href="/certificates" className="flex flex-col items-center justify-center p-6 bg-muted/30 border border-border/50 hover:border-blue-500 hover:bg-blue-500/5 rounded-xl transition-all group">
                <FolderOpen className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                <span className="font-semibold text-sm">View Certificates</span>
              </Link>
              <Link href="/email-queue" className="flex flex-col items-center justify-center p-6 bg-muted/30 border border-border/50 hover:border-amber-500 hover:bg-amber-500/5 rounded-xl transition-all group">
                <Send className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                <span className="font-semibold text-sm">View Email Queue</span>
              </Link>
            </div>
          </section>

          {/* Recent Events Table - Empty State */}
          <section className="bg-card border border-border/50 rounded-xl p-6">
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
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                         <Calendar className="w-6 h-6 mb-3 text-muted-foreground/50" />
                         <p className="font-medium text-sm text-foreground mb-1">No events found</p>
                         <p className="text-xs max-w-sm">No events have been created yet.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Email Delivery & Generation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certificate Generation Progress - Empty State */}
            <section className="bg-card border border-border/50 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[250px]">
              <div className="w-full flex items-center justify-between mb-auto">
                <h2 className="text-lg font-bold">Certificate Generation</h2>
              </div>
              <div className="flex flex-col items-center justify-center mb-auto pt-6">
                 <FileCheck className="w-8 h-8 text-muted-foreground/50 mb-3" />
                 <p className="text-sm font-medium text-foreground mb-1">No active tasks</p>
                 <p className="text-xs text-muted-foreground">There are no batches currently generating.</p>
              </div>
            </section>

            {/* Email Delivery Status - Empty State */}
            <section className="bg-card border border-border/50 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[250px]">
              <div className="w-full flex items-center justify-between mb-auto">
                <h2 className="text-lg font-bold">Email Delivery Status</h2>
              </div>
              <div className="flex flex-col items-center justify-center mb-auto pt-6">
                 <div className="flex items-center gap-2 mb-3">
                   <Mail className="w-8 h-8 text-muted-foreground/50" />
                 </div>
                 <p className="text-sm font-medium text-foreground mb-1">No data available</p>
                 <p className="text-xs text-muted-foreground">Send your first batch to see delivery metrics.</p>
              </div>
            </section>
          </div>
          
        </div>

        {/* Right Column (Secondary Content) */}
        <div className="flex flex-col gap-6">
          
          {/* Coordinator Activity - Empty State */}
          <section className="bg-card border border-border/50 rounded-xl p-6 flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Coordinator Activity</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
               <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                 <UsersRound className="w-5 h-5 text-muted-foreground" />
               </div>
               <p className="text-sm font-medium text-foreground mb-1">No coordinators found</p>
               <p className="text-xs text-muted-foreground max-w-[200px]">Add coordinators to the system to track their activity.</p>
            </div>
          </section>

          {/* Recent Activity Feed - Empty State */}
          <section className="bg-card border border-border/50 rounded-xl p-6 flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Recent Activity</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
               <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                 <Inbox className="w-5 h-5 text-muted-foreground" />
               </div>
               <p className="text-sm font-medium text-foreground mb-1">No recent activity</p>
               <p className="text-xs text-muted-foreground max-w-[200px]">System events and logs will appear here.</p>
            </div>
          </section>

        </div>
      </div>
      
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border/50 flex flex-col gap-3 hover:border-accent/30 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
