"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CalendarDays, 
  Users, 
  FileCheck, 
  Grid,
  List,
  X,
  Sparkles
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function EventsPage() {
  const { events, addEvent } = useStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [newEvent, setNewEvent] = useState({
    name: "",
    coordinator: "Admin",
    date: "",
    status: "Draft" as const,
    participantsCount: 0
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date) return;
    addEvent(newEvent);
    setIsModalOpen(false);
    setNewEvent({ ...newEvent, name: "", date: "", participantsCount: 0 });
  };

  if (!mounted) return null;

  const filteredEvents = events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-10 relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-[-100px] right-[-20%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 
            className="text-5xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]"
          >
            Events
          </h1>
          <p className="text-sm font-medium text-muted-foreground/80 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Manage and track all certification events.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Create Event</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background/40 backdrop-blur-2xl border border-border/50 rounded-xl focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/50 transition-all text-sm font-medium shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-background/40 backdrop-blur-2xl border border-border/50 rounded-xl text-sm font-semibold hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground hover:border-accent/30 whitespace-nowrap shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        <div className="hidden md:flex items-center bg-background/40 backdrop-blur-2xl border border-border/50 rounded-xl p-1.5 shadow-sm">
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all duration-300 ${view === 'grid' ? 'bg-accent text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all duration-300 ${view === 'list' ? 'bg-accent text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {filteredEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-background/30 backdrop-blur-3xl border border-border/40 rounded-3xl flex flex-col items-center justify-center py-32 text-center shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-20" />
              <CalendarDays className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No events found</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
              Create your first event to start generating and distributing certificates in style.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-8 py-3 bg-accent text-white font-bold rounded-xl hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredEvents.map(event => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  key={event.id} 
                  className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 group flex flex-col shadow-sm hover:shadow-md"
                >
                  {/* Neon Glow Behind Card on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                  
                  <div className="p-6 border-b border-border/50 relative z-10 bg-card">
                    <div className="pr-24">
                      <h3 className="font-extrabold text-xl mb-2 leading-tight text-foreground transition-all duration-300 line-clamp-2">
                        <Link href={`/coordinator/events/${event.id}`} className="transition-colors hover:text-accent">{event.name}</Link>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <CalendarDays className="w-4 h-4 text-accent/70" />
                        {event.date}
                      </div>
                    </div>
                    
                    {/* Glowing Status Badge */}
                    <span className={`absolute top-5 right-5 px-2.5 py-1 text-[10px] uppercase font-black tracking-widest rounded-lg border shadow-sm ${
                      event.status === 'Active' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                      event.status === 'Completed' 
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-4 text-sm flex-1 relative z-10 bg-card">
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50 group-hover:bg-muted/50 transition-colors">
                      <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider block mb-1">Participants</span>
                      <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                        <Users className="w-4 h-4 text-blue-500" /> {event.participantsCount}
                      </div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50 group-hover:bg-muted/50 transition-colors">
                      <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider block mb-1">Certificates</span>
                      <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                        <FileCheck className="w-4 h-4 text-accent" /> {event.status === 'Completed' ? event.participantsCount : 0}
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/10 px-6 py-4 border-t border-border text-xs flex justify-between items-center relative z-10 gap-4">
                    <span className="text-muted-foreground font-medium truncate">By <span className="font-bold text-foreground">{event.coordinator}</span></span>
                    <Link href={`/coordinator/events/${event.id}`} className="font-bold text-accent hover:text-accent/80 transition-colors whitespace-nowrap">View Details &rarr;</Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-background/40 backdrop-blur-2xl border border-border/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/20 border-b border-border/40 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Event Name</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Participants</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Created By</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border/20">
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="hover:bg-muted/10 transition-colors group cursor-pointer" onClick={() => window.location.href = `/coordinator/events/${event.id}`}>
                      <td className="px-8 py-5 font-bold text-foreground group-hover:text-accent group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">
                        {event.name}
                      </td>
                      <td className="px-8 py-5 text-muted-foreground font-medium">{event.date}</td>
                      <td className="px-8 py-5 font-bold">{event.participantsCount}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                          event.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.2)]' :
                          event.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-muted-foreground font-medium">{event.coordinator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-background/90 backdrop-blur-3xl border border-border/50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Neon accent line at top */}
              <div className="h-1 w-full bg-gradient-to-r from-accent to-blue-500" />
              
              <div className="p-8 border-b border-border/20 flex justify-between items-center bg-muted/10">
                <h2 className="text-2xl font-extrabold tracking-tight">Create New Event</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/80 rounded-xl text-muted-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-8 flex flex-col gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Event Name</label>
                  <input 
                    required autoFocus
                    type="text" 
                    value={newEvent.name}
                    onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all font-medium text-sm shadow-inner"
                    placeholder="e.g. Annual Tech Symposium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
                  <input 
                    required
                    type="date" 
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all font-medium text-sm shadow-inner"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Expected Participants</label>
                  <input 
                    type="number" min="0"
                    value={newEvent.participantsCount}
                    onChange={e => setNewEvent({...newEvent, participantsCount: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all font-medium text-sm shadow-inner"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</label>
                  <select 
                    value={newEvent.status}
                    onChange={e => setNewEvent({...newEvent, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all font-medium text-sm shadow-inner cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="mt-6 flex justify-end gap-4 pt-4 border-t border-border/20">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-bold hover:bg-muted/50 rounded-xl transition-colors text-muted-foreground">
                    Cancel
                  </button>
                  <button type="submit" className="px-8 py-2.5 bg-accent text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all">
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
