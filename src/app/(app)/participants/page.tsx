"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  UserPlus, 
  Upload,
  Download,
  X,
  Mail,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useStore } from "@/lib/store";

const MOCK_PARTICIPANTS: any[] = [];

export default function ParticipantsPage() {
  const { events } = useStore();
  const activeEvents = events.filter(e => e.status === "Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
      if (lines.length < 2) return; // Need at least header and one row

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      
      const newParticipants = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        const participant: any = {
          id: `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: "Pending" // Default status
        };

        headers.forEach((header, index) => {
          if (values[index]) {
            if (header === 'name' || header === 'full name') participant.name = values[index];
            if (header === 'email' || header === 'email address') participant.email = values[index];
            if (header === 'event' || header === 'event name') participant.event = values[index];
            if (header === 'status') participant.status = values[index];
          }
        });

        // Ensure defaults if missing
        if (!participant.name) participant.name = "Unknown Name";
        if (!participant.email) participant.email = "no-email@example.com";
        if (!participant.event) participant.event = "Imported Event";

        return participant;
      });

      setParticipants(prev => [...newParticipants, ...prev]);
    };
    
    reader.readAsText(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    event: "",
    status: "Pending"
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name || !newParticipant.email) return;

    const selectedEvent = newParticipant.event || (activeEvents.length > 0 ? activeEvents[0].name : "");
    if (!selectedEvent) return;
    
    setParticipants([{ 
      id: `P-${Date.now()}`, 
      ...newParticipant, 
      event: selectedEvent,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    }, ...participants]);
    
    setIsModalOpen(false);
    setNewParticipant({ name: "", email: "", event: "", status: "Pending" });
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const cycleFilter = () => {
    if (statusFilter === null) setStatusFilter("Verified");
    else if (statusFilter === "Verified") setStatusFilter("Pending");
    else if (statusFilter === "Pending") setStatusFilter("Failed");
    else setStatusFilter(null);
  };

  const handleExport = () => {
    if (filteredParticipants.length === 0) return;
    const headers = ["Name", "Email", "Event", "Status", "Date Added"];
    const csvRows = [headers.join(",")];
    
    for (const p of filteredParticipants) {
      csvRows.push([p.name, p.email, p.event, p.status, p.date].map(v => `"${v}"`).join(","));
    }
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "participants.csv");
    a.click();
  };

  const handleDelete = (id: string) => {
    setParticipantToDelete(id);
  };

  const confirmDelete = () => {
    if (participantToDelete) {
      setParticipants(participants.filter(p => p.id !== participantToDelete));
      setParticipantToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-10">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/20 pb-8 relative z-20"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Participants</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Manage and verify event attendees before issuing certificates.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-card/40 backdrop-blur-md border border-border/30 rounded-xl text-sm font-semibold hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]"
          >
            <UserPlus className="w-4 h-4" />
            Add Participant
          </button>
        </div>
      </motion.header>

      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row justify-between gap-4"
      >
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input 
            type="text" 
            placeholder="Search participants by name, email, or event..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card/40 backdrop-blur-3xl border border-border/30 rounded-2xl focus:outline-none focus:border-foreground/30 focus:bg-card/60 transition-all shadow-inner"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={cycleFilter}
            className={`flex items-center gap-2 px-4 py-3 bg-card/40 backdrop-blur-3xl border border-border/30 rounded-2xl text-sm font-medium hover:bg-muted/50 transition-colors ${statusFilter ? 'text-accent border-accent/30 shadow-[0_0_10px_rgba(177,59,255,0.1)]' : 'text-foreground'}`}
          >
            <Filter className="w-4 h-4" />
            {statusFilter ? `Status: ${statusFilter}` : 'Filter Status'}
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-3 bg-card/40 backdrop-blur-3xl border border-border/30 rounded-2xl text-sm font-medium hover:bg-muted/50 transition-colors text-foreground hover:scale-105 active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl overflow-visible shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative"
      >
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border/20 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-5">Participant</th>
                <th className="px-6 py-5">Event</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Added On</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/10">
              <AnimatePresence>
                {filteredParticipants.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-5">
                          <UserPlus className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No participants found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                          Get started by adding participants manually or importing them via CSV.
                        </p>
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add Participant
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredParticipants.map((p, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      key={p.id} 
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center font-bold text-accent border border-accent/10">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {p.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground/80">{p.event}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {p.status === 'Verified' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          {p.status === 'Pending' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                          {p.status === 'Failed' && <X className="w-4 h-4 text-red-500" />}
                          <span className={`font-semibold text-xs px-2 py-1 rounded-full backdrop-blur-md border ${
                            p.status === 'Verified' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            p.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{p.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(p.id)}
                          title="Remove Participant"
                          className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Slide-over Panel (Drawer) for Adding Participant */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-card/80 backdrop-blur-3xl border-l border-border/30 z-[101] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-border/20">
                <h2 className="text-xl font-bold">Add Participant</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAdd} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                  <input 
                    required autoFocus
                    type="text" 
                    value={newParticipant.name}
                    onChange={e => setNewParticipant({...newParticipant, name: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all shadow-inner"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={newParticipant.email}
                    onChange={e => setNewParticipant({...newParticipant, email: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all shadow-inner"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Select Event</label>
                  <select 
                    value={newParticipant.event || (activeEvents.length > 0 ? activeEvents[0].name : "")}
                    onChange={e => setNewParticipant({...newParticipant, event: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all shadow-inner"
                    disabled={activeEvents.length === 0}
                  >
                    {activeEvents.length === 0 ? (
                      <option value="">No active events found</option>
                    ) : (
                      activeEvents.map(e => (
                        <option key={e.id} value={e.name}>{e.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3 mt-4">
                  <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Adding a participant will automatically trigger verification. Certificates are only generated for 'Verified' participants.</p>
                </div>

              </form>
              
              <div className="p-6 border-t border-border/20 flex gap-3 bg-card/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={handleAdd} className="flex-1 py-3 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md">
                  Add Participant
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Beautiful Confirm Delete Modal */}
      <AnimatePresence>
        {participantToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setParticipantToDelete(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col relative"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/50 to-red-500 opacity-50" />
              
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Remove Participant</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Are you sure you want to remove this participant? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex bg-muted/40 p-4 gap-3 border-t border-border/50">
                <button 
                  onClick={() => setParticipantToDelete(null)}
                  className="flex-1 py-3 rounded-xl bg-background border border-border hover:bg-muted font-semibold transition-colors text-foreground"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
