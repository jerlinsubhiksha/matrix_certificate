"use client";

import React, { useState, useEffect } from "react";
import { useStore, EmailJob, QueueStatus } from "@/lib/store";
import { 
  Mail, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2,
  Trash2,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EmailQueuePage() {
  const { emailJobs, events, clearEmailJobs } = useStore();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<QueueStatus | 'All'>('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredJobs = emailJobs.filter(job => {
    const matchesSearch = job.participantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.participantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).reverse(); // Show newest first

  const getStatusIcon = (status: QueueStatus) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Sending': 
      case 'Generating': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'Pending': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'Failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'Completed': return <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">Sent</span>;
      case 'Sending': return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">Sending</span>;
      case 'Generating': return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20">Generating</span>;
      case 'Pending': return <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border">Queued</span>;
      case 'Failed': return <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">Failed</span>;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Email Queue</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track and manage outgoing certificate emails.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={clearEmailJobs}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
          <Link 
            href="/certificates"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 active:scale-95 transition-all text-sm shadow-md"
          >
            <Mail className="w-4 h-4" /> New Dispatch
          </Link>
        </div>
      </header>

      {/* Filters & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm shadow-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-accent appearance-none text-sm shadow-sm cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* Quick Stat */}
        <div className="bg-background border border-border rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
          <span className="text-sm font-semibold text-muted-foreground">Total Processed</span>
          <span className="font-bold text-accent bg-accent/10 px-2 py-0.5 rounded text-sm">{emailJobs.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Mail className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No dispatch history found.</p>
                      <p className="text-sm mt-1">Generated certificates will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const event = events.find(e => e.id === job.eventId);
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={job.id} 
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{job.participantName}</span>
                          <span className="text-xs text-muted-foreground">{job.participantEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {event?.name || 'Unknown Event'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          {getStatusBadge(job.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(job.timestamp).toLocaleString(undefined, { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
