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
  Clock3,
  Save
} from "lucide-react";
import { useStore } from "@/lib/store";

const TABS = ["Overview", "Participants", "Certificates", "Email Queue", "Activity"];

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { events, emailJobs, deleteEvent, updateEvent } = useStore();
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const realEvent = events.find(e => e.id === id);

  const [editForm, setEditForm] = useState({
    name: realEvent?.name || "",
    date: realEvent?.date || "",
    status: realEvent?.status || "Active"
  });

  const [isEditingEmailConfig, setIsEditingEmailConfig] = useState(false);
  const [emailConfigForm, setEmailConfigForm] = useState({
    subject: realEvent?.emailSubject || `Your Certificate for ${realEvent?.name}`,
    body: realEvent?.emailBody || `Hi {Participant Name},\n\nThank you for attending ${realEvent?.name}. Attached is your certificate of participation.\n\nBest,\nThe MATRIX Team`
  });

  React.useEffect(() => {
    if (realEvent) {
      setEmailConfigForm({
        subject: realEvent.emailSubject || `Your Certificate for ${realEvent.name}`,
        body: realEvent.emailBody || `Hi {Participant Name},\n\nThank you for attending ${realEvent.name}. Attached is your certificate of participation.\n\nBest,\nThe MATRIX Team`
      });
    }
  }, [realEvent?.emailSubject, realEvent?.emailBody, realEvent?.name]);

  if (!realEvent) {
    return <div className="p-10 text-center font-bold text-xl text-muted-foreground mt-20">Event not found.</div>;
  }

  const eventEmails = emailJobs.filter(job => job.eventId === id);
  const totalEmails = eventEmails.length;
  const sentEmails = eventEmails.filter(job => job.status === 'Completed').length;
  const failedEmails = eventEmails.filter(job => job.status === 'Failed').length;

  // Group by unique emails to get accurate participant count, even if we dispatched to them multiple times
  const uniqueParticipantsMap = new Map();
  eventEmails.forEach(job => {
    if (!uniqueParticipantsMap.has(job.participantEmail)) {
      uniqueParticipantsMap.set(job.participantEmail, {
        id: job.id,
        name: job.participantName,
        email: job.participantEmail,
        status: job.status === 'Completed' ? 'Attended' : 'Registered',
        date: new Date(job.timestamp).toLocaleDateString()
      });
    }
  });
  const PARTICIPANTS = Array.from(uniqueParticipantsMap.values());
  const uniqueParticipantsCount = PARTICIPANTS.length;

  const eventDetails = {
    id: id,
    name: realEvent.name,
    date: realEvent.date,
    status: realEvent.status,
    createdBy: realEvent.coordinator,
    createdDate: realEvent.date,
    template: "Custom Template",
    emailSubject: realEvent.emailSubject || `Your Certificate for ${realEvent.name}`,
    emailBody: realEvent.emailBody || `Hi {Participant Name},\n\nThank you for attending ${realEvent.name}. Attached is your certificate of participation.\n\nBest,\nThe MATRIX Team`,
    stats: {
      participants: uniqueParticipantsCount > 0 ? uniqueParticipantsCount : realEvent.participantsCount || 0,
      certificates: sentEmails,
      emailsSent: totalEmails,
      bounces: failedEmails
    }
  };

  const CERTIFICATES = eventEmails.map(eq => ({
    id: eq.id,
    recipient: eq.participantName,
    issueDate: new Date(eq.timestamp).toLocaleDateString(),
    status: eq.status === 'Completed' ? 'Issued' : 'Failed'
  }));

  const EMAIL_QUEUE = eventEmails.map(eq => ({
    id: eq.id,
    recipient: eq.participantEmail,
    subject: eventDetails.emailSubject,
    status: eq.status === 'Completed' ? 'Sent' : eq.status,
    time: new Date(eq.timestamp).toLocaleTimeString()
  }));

  const ACTIVITY = eventEmails.map(eq => ({
    id: eq.id,
    action: eq.status === 'Completed' ? 'Certificate Issued' : 'Delivery Failed',
    time: new Date(eq.timestamp).toLocaleString(),
    details: `Dispatched to ${eq.participantName} (${eq.participantEmail})`,
    icon: Mail,
    color: eq.status === 'Completed' ? 'text-green-500' : 'text-red-500'
  })).reverse();

  const handleDelete = () => {
    deleteEvent(id);
    router.push("/"); 
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent(id, {
      name: editForm.name,
      date: editForm.date,
      status: editForm.status as any
    });
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
          <span className="text-2xl font-bold">{eventDetails.stats.emailsSent > 0 ? (eventDetails.stats.bounces / eventDetails.stats.emailsSent * 100).toFixed(2) : "0.00"}%</span>
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
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Configuration</h3>
                  {!isEditingEmailConfig ? (
                    <button onClick={() => setIsEditingEmailConfig(true)} className="text-xs text-accent hover:underline flex items-center gap-1">
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                  ) : (
                    <button onClick={() => {
                      updateEvent(id, { emailSubject: emailConfigForm.subject, emailBody: emailConfigForm.body });
                      setIsEditingEmailConfig(false);
                    }} className="text-xs text-green-500 hover:underline flex items-center gap-1">
                      <Save className="w-3 h-3" /> Save
                    </button>
                  )}
                </div>
                <div className="bg-background border border-border/40 rounded-lg p-5 flex flex-col h-full min-h-[300px] shadow-sm">
                  <div className="mb-4">
                    <span className="text-xs text-muted-foreground block mb-1">Subject Line</span>
                    {isEditingEmailConfig ? (
                      <input 
                        value={emailConfigForm.subject} 
                        onChange={(e) => setEmailConfigForm({...emailConfigForm, subject: e.target.value})}
                        className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-md focus:border-accent focus:outline-none transition-colors text-sm text-foreground/90 font-semibold"
                      />
                    ) : (
                      <span className="font-semibold text-foreground/90">{eventDetails.emailSubject}</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs text-muted-foreground block mb-1">Email Body</span>
                    {isEditingEmailConfig ? (
                      <textarea 
                        value={emailConfigForm.body}
                        onChange={(e) => setEmailConfigForm({...emailConfigForm, body: e.target.value})}
                        className="w-full h-full min-h-[150px] px-3 py-2 bg-muted/50 border border-border/60 rounded-md focus:border-accent focus:outline-none transition-colors text-sm whitespace-pre-wrap font-mono text-muted-foreground resize-none"
                      />
                    ) : (
                      <div className="flex-1 bg-muted/20 border border-border/40 rounded-md p-4 text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                        {eventDetails.emailBody}
                      </div>
                    )}
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
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">Event Date</label>
                <input 
                  type="text" 
                  value={editForm.date}
                  onChange={e => setEditForm({...editForm, date: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">Status</label>
                <select 
                  value={editForm.status}
                  onChange={e => setEditForm({...editForm, status: e.target.value})}
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
