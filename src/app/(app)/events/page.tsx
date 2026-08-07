"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CalendarDays, 
  Users, 
  FileCheck, 
  Mail,
  Grid,
  List,
  ChevronDown
} from "lucide-react";

const MOCK_EVENTS = [
  { id: 1, name: "Global Tech Summit 2026", date: "Aug 15, 2026", participants: 1250, certs: 1250, emailStatus: "Completed", creator: "Alice Chen" },
  { id: 2, name: "AI Engineering Bootcamp", date: "Aug 10, 2026", participants: 420, certs: 420, emailStatus: "Completed", creator: "Marcus Johnson" },
  { id: 3, name: "Design Leadership Workshop", date: "Aug 02, 2026", participants: 85, certs: 85, emailStatus: "Completed", creator: "Sarah Miller" },
  { id: 4, name: "Frontend Masters Q3", date: "Jul 28, 2026", participants: 300, certs: 0, emailStatus: "Pending", creator: "Alice Chen" },
  { id: 5, name: "Cybersecurity Basics", date: "Jul 15, 2026", participants: 150, certs: 150, emailStatus: "Failed (3)", creator: "David Kim" },
  { id: 6, name: "Product Strategy 101", date: "Jul 05, 2026", participants: 200, certs: 200, emailStatus: "Completed", creator: "Elena Rodriguez" },
];

export default function EventsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all certification events.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border/60 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-muted-foreground whitespace-nowrap">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border/60 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-muted-foreground whitespace-nowrap">
            Sort: Newest <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        
        <div className="hidden md:flex items-center bg-card border border-border/60 rounded-lg p-1">
          <button 
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all group flex flex-col">
              <div className="p-5 border-b border-border/40 relative">
                <button className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-lg mb-1 pr-6 leading-tight group-hover:text-accent transition-colors">
                  <Link href={`/events/${event.id}`} className="hover:underline">{event.name}</Link>
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {event.date}
                </div>
              </div>
              <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-2 text-sm flex-1">
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Participants</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> {event.participants.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Certificates</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <FileCheck className="w-3.5 h-3.5 text-accent" /> {event.certs.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground text-xs block mb-1">Email Status</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Mail className={`w-3.5 h-3.5 ${event.emailStatus.includes('Completed') ? 'text-green-500' : event.emailStatus.includes('Failed') ? 'text-red-500' : 'text-amber-500'}`} />
                    <span className={event.emailStatus.includes('Completed') ? 'text-green-500' : event.emailStatus.includes('Failed') ? 'text-red-500' : 'text-amber-500'}>
                      {event.emailStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 px-5 py-3 border-t border-border/40 text-xs flex justify-between items-center">
                <span className="text-muted-foreground">By <span className="font-semibold text-foreground">{event.creator}</span></span>
                <Link href={`/events/${event.id}`} className="font-semibold text-accent hover:underline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-xs text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Event Name</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Participants</th>
                  <th className="px-6 py-4 font-medium">Email Status</th>
                  <th className="px-6 py-4 font-medium">Created By</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/40">
                {MOCK_EVENTS.map(event => (
                  <tr key={event.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground group-hover:text-accent transition-colors">
                      <Link href={`/events/${event.id}`}>{event.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{event.date}</td>
                    <td className="px-6 py-4 font-medium">{event.participants.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${event.emailStatus.includes('Completed') ? 'bg-green-500/10 text-green-500' : event.emailStatus.includes('Failed') ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {event.emailStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{event.creator}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
    </div>
  );
}
