"use client";

import React, { useState } from "react";
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
  Activity
} from "lucide-react";

const TABS = ["Overview", "Participants", "Certificates", "Email Queue", "Activity"];

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");

  // Mock Data for specific event
  const event = {
    id: params.id,
    name: "Global Tech Summit 2026",
    date: "August 15, 2026",
    status: "Completed",
    createdBy: "Alice Chen",
    createdDate: "July 01, 2026",
    template: "Standard Tech Event Template v2",
    emailSubject: "Your Certificate for Global Tech Summit 2026",
    emailBody: "Hi {Participant Name},\n\nThank you for attending the Global Tech Summit 2026. Attached is your certificate of participation.\n\nBest,\nThe MATRIX Team",
    stats: {
      participants: 1250,
      certificates: 1250,
      emailsSent: 1248,
      bounces: 2
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Event Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
            <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider rounded">
              {event.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {event.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Created by {event.createdBy}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border/60 hover:bg-muted/50 rounded-lg text-sm font-semibold transition-colors">
            <Edit className="w-4 h-4" /> Edit Event
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Participants</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold">{event.stats.participants.toLocaleString()}</span>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-accent">
            <span className="text-xs font-semibold uppercase tracking-wider">Certificates</span>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{event.stats.certificates.toLocaleString()}</span>
            <span className="text-sm font-medium text-muted-foreground mb-1">/ {event.stats.participants.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-accent rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-green-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Emails Sent</span>
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{event.stats.emailsSent.toLocaleString()}</span>
            <span className="text-sm font-medium text-muted-foreground mb-1">/ {event.stats.certificates.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '99%' }}></div>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-red-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Bounce Rate</span>
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold">{(event.stats.bounces / event.stats.emailsSent * 100).toFixed(2)}%</span>
          <span className="text-xs text-muted-foreground">{event.stats.bounces} failed deliveries</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border/40 custom-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative
                ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}
              `}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 bg-muted/5">
          {activeTab === "Overview" && (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Event Details</h3>
                  <div className="bg-background border border-border/40 rounded-lg p-4 space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Event Name</span>
                      <span className="font-medium">{event.name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Event Date</span>
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Created By</span>
                      <span className="font-medium">{event.createdBy} <span className="text-muted-foreground font-normal">on {event.createdDate}</span></span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Design</h3>
                  <div className="bg-background border border-border/40 rounded-lg p-4 flex items-center justify-between group cursor-pointer hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 text-accent rounded-md"><FileText className="w-5 h-5"/></div>
                      <div>
                        <span className="font-medium block text-sm">{event.template}</span>
                        <span className="text-xs text-muted-foreground">PDF Document</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Configuration</h3>
                <div className="bg-background border border-border/40 rounded-lg p-4 flex flex-col h-full min-h-[300px]">
                  <div className="mb-4">
                    <span className="text-xs text-muted-foreground block mb-1">Subject Line</span>
                    <span className="font-medium text-sm">{event.emailSubject}</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs text-muted-foreground block mb-1">Email Body</span>
                    <div className="flex-1 bg-muted/30 border border-border/40 rounded-md p-3 text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                      {event.emailBody}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "Overview" && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-1">{activeTab} Details</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                This section would contain the detailed data table for {activeTab.toLowerCase()}. 
                Currently viewing in demo mode.
              </p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
