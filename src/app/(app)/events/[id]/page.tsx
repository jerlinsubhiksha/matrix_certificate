"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CalendarDays, 
  Users, 
  FileCheck, 
  Mail,
  Edit,
  Trash2,
  Clock,
  ArrowUpRight,
  FileText,
  Activity as ActivityIcon,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock3
} from "lucide-react";

const TABS = ["Overview", "Participants", "Certificates", "Email Queue", "Activity"];

// Removed dummy data to reflect a clean slate
const PARTICIPANTS: any[] = [];
const CERTIFICATES: any[] = [];
const EMAIL_QUEUE: any[] = [];
const ACTIVITY: any[] = [];

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [eventDetails, setEventDetails] = useState({
    id: id,
    name: "Unknown Event",
    date: "TBD",
    status: "Draft",
    createdBy: "Unknown",
    createdDate: "TBD",
    template: "Standard Template",
    emailSubject: "Your Certificate",
    emailBody: "Hi {Participant Name},\n\nAttached is your certificate.\n\nBest,\nThe Team",
    stats: {
      participants: 0,
      certificates: 0,
      emailsSent: 0,
      bounces: 0
    }
  });

  const handleDelete = () => {
    // Mock delete logic
    router.push("/admin/events"); // redirect back to events list
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Event Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{eventDetails.name}</h1>
            <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded ${eventDetails.status === 'Completed' ? 'bg-green-500/10 text-green-500' : eventDetails.status === 'Active' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {eventDetails.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {eventDetails.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Created by {eventDetails.createdBy}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-4 py-2 bg-card border border-border/60 hover:bg-muted/50 rounded-lg text-sm font-semibold transition-colors">
            <Edit className="w-4 h-4" /> Edit Event
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Participants</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold">{eventDetails.stats.participants.toLocaleString()}</span>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center text-accent">
            <span className="text-xs font-semibold uppercase tracking-wider">Certificates</span>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{eventDetails.stats.certificates.toLocaleString()}</span>
            <span className="text-sm font-medium text-muted-foreground mb-1">/ {eventDetails.stats.participants.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-accent rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center text-green-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Emails Sent</span>
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{eventDetails.stats.emailsSent.toLocaleString()}</span>
            <span className="text-sm font-medium text-muted-foreground mb-1">/ {eventDetails.stats.certificates.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '99%' }}></div>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center text-red-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Bounce Rate</span>
            <ActivityIcon className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold">{(eventDetails.stats.bounces / eventDetails.stats.emailsSent * 100).toFixed(2)}%</span>
          <span className="text-xs text-muted-foreground">{eventDetails.stats.bounces} failed deliveries</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border/40 custom-scrollbar bg-background/50">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(""); }}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative
                ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}
              `}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 bg-background/20 flex flex-col">
          
          {/* ===================== OVERVIEW TAB ===================== */}
          {activeTab === "Overview" && (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Event Details</h3>
                  <div className="bg-background border border-border/40 rounded-lg p-5 space-y-4 shadow-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Event Name</span>
                      <span className="font-semibold text-foreground/90">{eventDetails.name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Event Date</span>
                      <span className="font-semibold text-foreground/90">{eventDetails.date}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Created By</span>
                      <span className="font-semibold text-foreground/90">{eventDetails.createdBy} <span className="text-muted-foreground font-normal">on {eventDetails.createdDate}</span></span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Design</h3>
                  <Link href={`/admin/templates/1/editor`} className="block">
                    <div className="bg-background border border-border/40 rounded-lg p-5 flex items-center justify-between group cursor-pointer hover:border-accent/40 transition-colors shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 text-accent rounded-lg"><FileText className="w-6 h-6"/></div>
                        <div>
                          <span className="font-semibold block text-foreground/90">{eventDetails.template}</span>
                          <span className="text-xs text-muted-foreground">PDF Document Template</span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Configuration</h3>
                <div className="bg-background border border-border/40 rounded-lg p-5 flex flex-col h-full min-h-[300px] shadow-sm">
                  <div className="mb-4">
                    <span className="text-xs text-muted-foreground block mb-1">Subject Line</span>
                    <span className="font-semibold text-foreground/90">{eventDetails.emailSubject}</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs text-muted-foreground block mb-1">Email Body</span>
                    <div className="flex-1 bg-muted/20 border border-border/40 rounded-md p-4 text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                      {eventDetails.emailBody}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== PARTICIPANTS TAB ===================== */}
          {activeTab === "Participants" && (
            <div className="flex flex-col h-full">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search participants..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border/50 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Add Participant
                  </button>
                </div>
              </div>
              <div className="border border-border/40 rounded-xl overflow-hidden bg-background">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 border-b border-border/40 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Date Added</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {PARTICIPANTS.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                              <Users className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="font-semibold text-foreground/80 mb-1">No participants yet</p>
                            <p className="text-sm text-muted-foreground max-w-sm">Add participants manually or import a CSV to get started.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      PARTICIPANTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                        <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-medium">{p.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">{p.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'Attended' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{p.date}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><MoreVertical className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== CERTIFICATES TAB ===================== */}
          {activeTab === "Certificates" && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between gap-4 mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Search certificates by ID or Name..." className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg text-sm font-semibold shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all">
                  Generate Missing
                </button>
              </div>
              <div className="border border-border/40 rounded-xl overflow-hidden bg-background">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 border-b border-border/40 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Certificate ID</th>
                      <th className="px-6 py-4 font-semibold">Recipient</th>
                      <th className="px-6 py-4 font-semibold">Issue Date</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {CERTIFICATES.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mb-4">
                              <FileCheck className="w-8 h-8 text-accent/50" />
                            </div>
                            <p className="font-semibold text-foreground/80 mb-1">No certificates generated</p>
                            <p className="text-sm text-muted-foreground max-w-sm">Click 'Generate Missing' to create certificates for your participants.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      CERTIFICATES.map(c => (
                        <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                          <td className="px-6 py-4 font-medium">{c.recipient}</td>
                          <td className="px-6 py-4 text-muted-foreground">{c.issueDate}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold">{c.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <button className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"><Eye className="w-4 h-4"/></button>
                            <button className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Download className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== EMAIL QUEUE TAB ===================== */}
          {activeTab === "Email Queue" && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between gap-4 mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Search emails..." className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border/50 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
                  <Filter className="w-4 h-4" /> Filter by Status
                </button>
              </div>
              <div className="border border-border/40 rounded-xl overflow-hidden bg-background">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 border-b border-border/40 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Recipient</th>
                      <th className="px-6 py-4 font-semibold">Subject</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {EMAIL_QUEUE.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500/5 flex items-center justify-center mb-4">
                              <Mail className="w-8 h-8 text-blue-500/50" />
                            </div>
                            <p className="font-semibold text-foreground/80 mb-1">Queue is empty</p>
                            <p className="text-sm text-muted-foreground max-w-sm">No emails have been dispatched for this event yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      EMAIL_QUEUE.map(eq => (
                        <tr key={eq.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-medium">{eq.recipient}</td>
                          <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{eq.subject}</td>
                          <td className="px-6 py-4 flex items-center gap-2">
                            {eq.status === 'Sent' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {eq.status === 'Failed' && <XCircle className="w-4 h-4 text-red-500" />}
                            {eq.status === 'Pending' && <Clock3 className="w-4 h-4 text-blue-500" />}
                            <span className={`text-xs font-semibold ${eq.status === 'Sent' ? 'text-green-500' : eq.status === 'Failed' ? 'text-red-500' : 'text-blue-500'}`}>
                              {eq.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{eq.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== ACTIVITY TAB ===================== */}
          {activeTab === "Activity" && (
            <div className="flex flex-col max-w-3xl mx-auto w-full py-4">
              <h3 className="text-xl font-bold mb-8 text-foreground/90">Event Timeline</h3>
              
              {ACTIVITY.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center bg-background border border-border/40 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ActivityIcon className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="font-semibold text-foreground/80 mb-1">No recent activity</p>
                  <p className="text-sm text-muted-foreground max-w-sm">Event history and audit logs will appear here.</p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/60 before:to-transparent">
                  {ACTIVITY.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-background p-4 rounded-xl border border-border/40 shadow-sm hover:border-accent/30 transition-colors">
                          <div className="flex flex-col mb-1">
                            <span className="font-bold text-foreground/90">{item.action}</span>
                            <span className="text-xs text-muted-foreground">{item.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground/80 mt-2">{item.details}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border border-border/50 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-6">Edit Event</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">Event Name</label>
                <input 
                  type="text" 
                  value={eventDetails.name}
                  onChange={e => setEventDetails({...eventDetails, name: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">Event Date</label>
                <input 
                  type="text" 
                  value={eventDetails.date}
                  onChange={e => setEventDetails({...eventDetails, date: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">Status</label>
                <select 
                  value={eventDetails.status}
                  onChange={e => setEventDetails({...eventDetails, status: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2 rounded-xl border border-border/50 font-semibold hover:bg-muted/50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition-opacity">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border border-border/50 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center">
             <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
               <Trash2 className="w-8 h-8" />
             </div>
             <h2 className="text-xl font-bold mb-2 text-foreground">Delete Event?</h2>
             <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">Are you sure you want to delete <span className="font-semibold text-foreground/80">"{eventDetails.name}"</span>? This action cannot be undone and will remove all associated certificates and logs.</p>
             <div className="flex gap-3 justify-center">
                <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2.5 rounded-xl border border-border/50 font-semibold hover:bg-muted/50 transition-colors">Cancel</button>
                <button onClick={handleDelete} className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">Yes, Delete</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
