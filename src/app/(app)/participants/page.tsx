"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  UserPlus, 
  Upload,
  Download, 
  X, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  GraduationCap,
  Layers,
  ChevronDown,
  Building2,
  Users,
  Sparkles
} from "lucide-react";
import { useStore, Participant } from "@/lib/store";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const INITIAL_DEMO_PARTICIPANTS: Participant[] = [
  {
    id: "P-101",
    name: "Aravind Sharma",
    email: "aravind.s@example.com",
    event: "Web Development Bootcamp",
    year: "3rd Year",
    department: "Computer Science",
    status: "Verified",
    date: "Oct 10, 2026"
  },
  {
    id: "P-102",
    name: "Sneha Reddy",
    email: "sneha.r@example.com",
    event: "Web Development Bootcamp",
    year: "2nd Year",
    department: "Information Technology",
    status: "Verified",
    date: "Oct 10, 2026"
  },
  {
    id: "P-103",
    name: "Kavitha Rajan",
    email: "kavitha.r@example.com",
    event: "AI & Machine Learning Summit",
    year: "4th Year",
    department: "Artificial Intelligence",
    status: "Verified",
    date: "Oct 09, 2026"
  },
  {
    id: "P-104",
    name: "Rohan Varma",
    email: "rohan.v@example.com",
    event: "AI & Machine Learning Summit",
    year: "1st Year",
    department: "Data Science",
    status: "Pending",
    date: "Oct 09, 2026"
  },
  {
    id: "P-105",
    name: "Meera Krishnan",
    email: "meera.k@example.com",
    event: "Cloud & DevOps Workshop",
    year: "3rd Year",
    department: "Computer Science",
    status: "Verified",
    date: "Oct 08, 2026"
  },
  {
    id: "P-106",
    name: "Deepak Nair",
    email: "deepak.n@example.com",
    event: "Cloud & DevOps Workshop",
    year: "2nd Year",
    department: "Electronics & Comm",
    status: "Pending",
    date: "Oct 08, 2026"
  }
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function ParticipantsPage() {
  const { participants: storeParticipants, events, addParticipant, addParticipants, removeParticipant } = useStore();
  
  // Use store participants, or fallback to demo participants if store is empty
  const allParticipants = useMemo(() => {
    return storeParticipants.length > 0 ? storeParticipants : INITIAL_DEMO_PARTICIPANTS;
  }, [storeParticipants]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "grouped">("table");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic lists of unique events and years
  const availableEvents = useMemo(() => {
    const fromEvents = events.map(e => e.name);
    const fromParticipants = allParticipants.map(p => p.event);
    return Array.from(new Set([...fromEvents, ...fromParticipants])).filter(Boolean);
  }, [events, allParticipants]);

  const availableYears = useMemo(() => {
    const participantYears = allParticipants.map(p => p.year).filter(Boolean) as string[];
    return Array.from(new Set([...YEAR_OPTIONS, ...participantYears]));
  }, [allParticipants]);

  // Handle CSV and Excel file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!jsonData || jsonData.length === 0) {
        toast.error("The spreadsheet is empty.");
        return;
      }

      // Extract a clean default event name from the file name if not present in spreadsheet
      // e.g. "embedded-systems-and-iot-prototyping-certificate" -> "Embedded Systems and IoT Prototyping"
      const fallbackEventName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/-certificate|-cert|-participants/gi, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim() || "Imported Event";

      const newParticipants: Participant[] = [];

      jsonData.forEach((row, index) => {
        let name = "";
        let email = "";
        let event = fallbackEventName;
        let year = "3rd Year";
        let department = "Engineering";
        let registerNumber = "";

        // Check each key case-insensitively
        for (const [rawKey, rawVal] of Object.entries(row)) {
          if (!rawVal) continue;
          const k = rawKey.trim().toLowerCase();
          const val = String(rawVal).replace(/^"|"$/g, '').trim();

          // Match Student Name, Participant Name, Full Name, Name, Attendee
          if (
            k === 'student name' || 
            k === 'student' || 
            k === 'name' || 
            k === 'full name' || 
            k === 'participant name' || 
            k === 'participant' || 
            k === 'candidate name' ||
            k === 'attendee' ||
            k === 'attendee name'
          ) {
            name = val;
          } 
          // Match Email, Student Email, Email Address, Mail
          else if (
            k === 'email' || 
            k === 'email address' || 
            k === 'student email' || 
            k === 'mail' || 
            k === 'e-mail'
          ) {
            email = val;
          }
          // Match Event
          else if (k === 'event' || k === 'event name' || k === 'program' || k === 'workshop') {
            event = val;
          }
          // Match Academic Year
          else if (k === 'year' || k === 'academic year' || k === 'class' || k === 'batch') {
            year = val;
          }
          // Match Department
          else if (k === 'department' || k === 'dept' || k === 'branch' || k === 'major') {
            department = val;
          }
          // Match Register Number
          else if (k === 'reg no' || k === 'register number' || k === 'reg_no' || k === 'roll no' || k === 'id') {
            registerNumber = val;
          }
        }

        if (name && email) {
          newParticipants.push({
            id: `P-${Date.now()}-${index}`,
            name,
            email,
            event,
            year,
            department,
            registerNumber,
            status: "Verified",
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });
        }
      });

      if (newParticipants.length === 0) {
        toast.error("No valid participants found. Please ensure your file has Name/Student Name and Email columns.");
        return;
      }

      addParticipants(newParticipants);
      toast.success(`Successfully imported ${newParticipants.length} participants from ${file.name}!`);
    } catch (err: any) {
      console.error("File upload error:", err);
      toast.error("Failed to parse spreadsheet: " + (err?.message || "Invalid file format"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    event: availableEvents[0] || "Web Development Bootcamp",
    year: "3rd Year",
    department: "Computer Science",
    status: "Verified" as 'Verified' | 'Pending' | 'Failed'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name || !newParticipant.email) return;
    
    addParticipant({ 
      ...newParticipant, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    } as any);
    
    setIsModalOpen(false);
    setNewParticipant({ 
      name: "", 
      email: "", 
      event: availableEvents[0] || "Web Development Bootcamp", 
      year: "3rd Year",
      department: "Computer Science",
      status: "Verified"
    });
  };

  // Filtered participants matching search, event, year, and status
  const filteredParticipants = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allParticipants.filter(p => {
      const pYear = p.year || "3rd Year";
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.email.toLowerCase().includes(q) ||
        p.event.toLowerCase().includes(q) ||
        pYear.toLowerCase().includes(q) ||
        (p.department && p.department.toLowerCase().includes(q)) ||
        (p.registerNumber && p.registerNumber.toLowerCase().includes(q));

      const matchesEvent = selectedEvent === "All" || p.event === selectedEvent;
      const matchesYear = selectedYear === "All" || pYear === selectedYear;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;

      return matchesSearch && matchesEvent && matchesYear && matchesStatus;
    });
  }, [allParticipants, searchQuery, selectedEvent, selectedYear, statusFilter]);

  // Grouped by Event for classified view
  const participantsGroupedByEvent = useMemo(() => {
    const groups: Record<string, Participant[]> = {};
    for (const p of filteredParticipants) {
      if (!groups[p.event]) {
        groups[p.event] = [];
      }
      groups[p.event].push(p);
    }
    return groups;
  }, [filteredParticipants]);

  const handleExport = () => {
    if (filteredParticipants.length === 0) return;
    const headers = ["Name", "Email", "Event", "Year", "Department", "Status", "Date Added"];
    const csvRows = [headers.join(",")];
    
    for (const p of filteredParticipants) {
      csvRows.push([
        p.name, 
        p.email, 
        p.event, 
        p.year || "3rd Year", 
        p.department || "General", 
        p.status, 
        p.date
      ].map(v => `"${v}"`).join(","));
    }
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `participants_${selectedEvent !== 'All' ? selectedEvent.replace(/\s+/g, '_') : 'all'}.csv`);
    a.click();
  };

  const handleDelete = (id: string) => {
    setParticipantToDelete(id);
  };

  const confirmDelete = () => {
    if (participantToDelete) {
      removeParticipant(participantToDelete);
      setParticipantToDelete(null);
    }
  };

  const getYearBadgeColor = (year?: string) => {
    switch (year) {
      case "1st Year":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "2nd Year":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "3rd Year":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "4th Year":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-accent/10 text-accent border-accent/20";
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-12">
      
      {/* Hidden File Input for CSV/Excel Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv,.xlsx,.xls" 
        className="hidden" 
      />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/20 pb-8 relative z-20"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/20 flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> Participant Classification
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-accent to-pink-500 dark:from-blue-400 dark:via-accent dark:to-pink-400 drop-shadow-sm">
            Participants Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Classify attendees by event and academic year, monitor verification status, and manage records.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-card/60 hover:bg-muted/80 backdrop-blur-xl border border-border/40 rounded-xl text-sm font-semibold transition-all shadow-sm hover:scale-[1.02] active:scale-95"
          >
            <Upload className="w-4 h-4 text-accent" />
            Import CSV / Excel
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Participant
          </button>
        </div>
      </motion.header>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Attendees</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{allParticipants.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Across all registered events</p>
        </div>

        <div className="p-5 bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Events</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{availableEvents.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Programs represented</p>
        </div>

        <div className="p-5 bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Issued</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-extrabold text-green-500">
            {allParticipants.filter(p => p.status === 'Verified').length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Certificates delivered</p>
        </div>

        <div className="p-5 bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Academic Tiers</span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{availableYears.length}</p>
          <p className="text-xs text-muted-foreground mt-1">1st through 4th year batches</p>
        </div>
      </div>

      {/* Classification & Search Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-4 p-5 bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Real-time Search Bar */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email, event, academic year, department..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-background/50 border border-border/40 rounded-2xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all text-sm shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Export */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="bg-background/60 p-1 border border-border/30 rounded-xl flex items-center text-xs font-medium">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'grouped' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Group by Event
              </button>
            </div>

            <button 
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-background/60 hover:bg-muted/80 border border-border/40 rounded-xl text-xs font-semibold transition-all text-foreground hover:scale-105 active:scale-95 shadow-sm"
              title="Export Filtered CSV"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              Export
            </button>
          </div>
        </div>

        {/* Classification Filters Row: Event + Year + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/20">
          
          {/* Event Classification Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" /> Classify by Event:
            </label>
            <div className="relative">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background/50 border border-border/40 rounded-xl text-xs font-medium focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="All">All Events ({allParticipants.length})</option>
                {availableEvents.map(evt => {
                  const count = allParticipants.filter(p => p.event === evt).length;
                  return (
                    <option key={evt} value={evt}>
                      {evt} ({count})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Academic Year Classification Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Classify by Year:
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background/50 border border-border/40 rounded-xl text-xs font-medium focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="All">All Academic Years</option>
                {availableYears.map(yr => {
                  const count = allParticipants.filter(p => (p.year || "3rd Year") === yr).length;
                  return (
                    <option key={yr} value={yr}>
                      {yr} ({count})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Verification Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-accent" /> Verification Status:
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background/50 border border-border/40 rounded-xl text-xs font-medium focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="All">All Statuses</option>
                <option value="Verified">Verified Only</option>
                <option value="Pending">Pending Only</option>
                <option value="Failed">Failed Only</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Active Filter Chips & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground">Showing {filteredParticipants.length} of {allParticipants.length} participants</span>
            {(selectedEvent !== "All" || selectedYear !== "All" || statusFilter !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedEvent("All");
                  setSelectedYear("All");
                  setStatusFilter("All");
                  setSearchQuery("");
                }}
                className="text-accent hover:underline font-semibold ml-2"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

      </motion.div>

      {/* Main Content: Grouped by Event View */}
      {viewMode === "grouped" ? (
        <div className="space-y-6">
          {Object.keys(participantsGroupedByEvent).length === 0 ? (
            <div className="p-16 text-center bg-card/40 backdrop-blur-xl border border-border/30 rounded-3xl">
              <UserPlus className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No matching participants</h3>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your event or year filter.</p>
            </div>
          ) : (
            Object.entries(participantsGroupedByEvent).map(([eventName, eventParticipants]) => (
              <motion.div 
                key={eventName}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{eventName}</h2>
                      <p className="text-xs text-muted-foreground">{eventParticipants.length} registered attendees</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Year distribution badges */}
                    {availableYears.map(yr => {
                      const count = eventParticipants.filter(p => (p.year || "3rd Year") === yr).length;
                      if (count === 0) return null;
                      return (
                        <span key={yr} className={`px-2.5 py-1 rounded-full border font-semibold ${getYearBadgeColor(yr)}`}>
                          {yr}: {count}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Event attendees grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {eventParticipants.map(p => (
                    <div 
                      key={p.id}
                      className="p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-accent/30 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center font-bold text-accent border border-accent/10 shrink-0 text-sm mt-0.5">
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-sm truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 shrink-0" /> {p.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getYearBadgeColor(p.year || "3rd Year")}`}>
                              {p.year || "3rd Year"}
                            </span>
                            {p.department && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                {p.department}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          p.status === 'Verified' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          p.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {p.status}
                        </span>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 transition-all"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        /* Table View */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/30 border-b border-border/20 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-5">Participant</th>
                  <th className="px-6 py-5">Event</th>
                  <th className="px-6 py-5">Academic Year</th>
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
                      <td colSpan={6} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-5">
                            <UserPlus className="w-10 h-10 text-muted-foreground/50" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">No participants match your criteria</h3>
                          <p className="text-muted-foreground max-w-sm mx-auto mb-6 text-xs">
                            Try resetting your search query, or select "All Events" and "All Academic Years".
                          </p>
                          <button
                            onClick={() => {
                              setSelectedEvent("All");
                              setSelectedYear("All");
                              setStatusFilter("All");
                              setSearchQuery("");
                            }}
                            className="px-4 py-2 bg-foreground text-background font-semibold text-xs rounded-xl shadow-sm hover:opacity-90"
                          >
                            Reset Filters
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
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        key={p.id} 
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Name & Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center font-bold text-accent border border-accent/10 shrink-0">
                              {p.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                                <Mail className="w-3 h-3 shrink-0" /> {p.email}
                              </p>
                              {p.department && (
                                <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-2.5 h-2.5 shrink-0" /> {p.department}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Event Classification */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-foreground/90 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            {p.event}
                          </span>
                        </td>

                        {/* Year Classification */}
                        <td className="px-6 py-4">
                          <span className={`font-bold text-xs px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${getYearBadgeColor(p.year || "3rd Year")}`}>
                            <GraduationCap className="w-3 h-3" />
                            {p.year || "3rd Year"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {p.status === 'Verified' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {p.status === 'Pending' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                            {p.status === 'Failed' && <X className="w-4 h-4 text-red-500" />}
                            <span className={`font-semibold text-xs px-2 py-0.5 rounded-full border ${
                              p.status === 'Verified' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                              p.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        </td>

                        {/* Date Added */}
                        <td className="px-6 py-4 text-muted-foreground font-medium text-xs">{p.date}</td>

                        {/* Action buttons */}
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
      )}

      {/* Slide-over Drawer for Adding Participant */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[100]"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full md:w-[460px] bg-card/90 backdrop-blur-3xl border-l border-border/30 z-[101] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-border/20">
                <div>
                  <h2 className="text-xl font-bold">Add Participant</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Register a participant with event and academic tier</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAdd} className="flex-1 overflow-y-auto p-6 space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Full Name</label>
                  <input 
                    required autoFocus
                    type="text" 
                    value={newParticipant.name}
                    onChange={e => setNewParticipant({...newParticipant, name: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all text-sm shadow-inner"
                    placeholder="e.g. Jerlin Subhiksha"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={newParticipant.email}
                    onChange={e => setNewParticipant({...newParticipant, email: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all text-sm shadow-inner"
                    placeholder="jerlin@example.com"
                  />
                </div>

                {/* Event Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Participating Event</label>
                  <select 
                    value={newParticipant.event}
                    onChange={e => setNewParticipant({...newParticipant, event: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all text-sm shadow-inner cursor-pointer"
                  >
                    {availableEvents.map(evt => (
                      <option key={evt} value={evt}>{evt}</option>
                    ))}
                  </select>
                </div>

                {/* Academic Year Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Academic Year</label>
                  <select 
                    value={newParticipant.year}
                    onChange={e => setNewParticipant({...newParticipant, year: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all text-sm shadow-inner cursor-pointer"
                  >
                    {YEAR_OPTIONS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Department / Major</label>
                  <input 
                    type="text" 
                    value={newParticipant.department}
                    onChange={e => setNewParticipant({...newParticipant, department: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all text-sm shadow-inner"
                    placeholder="e.g. Computer Science and Engineering"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Verification Status</label>
                  <select 
                    value={newParticipant.status}
                    onChange={e => setNewParticipant({...newParticipant, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-xl focus:border-accent outline-none transition-all text-sm shadow-inner cursor-pointer"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3 mt-4">
                  <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Participants added will be classified immediately across your event statistics, dashboards, and certificate generation queues.
                  </p>
                </div>

              </form>
              
              <div className="p-6 border-t border-border/20 flex gap-3 bg-card/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-colors text-sm">
                  Cancel
                </button>
                <button type="button" onClick={handleAdd} className="flex-1 py-3 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md text-sm">
                  Save Participant
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
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
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Remove Participant</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Are you sure you want to remove this participant from the directory?
                </p>
              </div>
              
              <div className="flex bg-muted/40 p-4 gap-3 border-t border-border/50">
                <button 
                  onClick={() => setParticipantToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-background border border-border hover:bg-muted font-semibold transition-colors text-foreground text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md active:scale-95 text-xs"
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
