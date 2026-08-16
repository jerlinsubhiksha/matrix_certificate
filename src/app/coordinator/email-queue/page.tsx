"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2
} from "lucide-react";
import { collection, query, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface EmailRecord {
  id: string;
  recipientEmail: string;
  recipientName: string;
  eventName: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Timestamp;
  sentAt: Timestamp | null;
  error?: string;
}

export default function EmailQueuePage() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent' | 'failed'>('all');

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "emails"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedEmails: EmailRecord[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEmails.push({ id: doc.id, ...doc.data() } as EmailRecord);
      });
      setEmails(fetchedEmails);
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      toast.error("Failed to load email queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleRetry = (id: string) => {
    toast.success("Retry triggered (Mock implementation)");
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) || 
      email.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: emails.length,
    sent: emails.filter(e => e.status === 'sent').length,
    pending: emails.filter(e => e.status === 'pending').length,
    failed: emails.filter(e => e.status === 'failed').length
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor certificate delivery status and retry failed emails.</p>
        </div>
        <button 
          onClick={fetchEmails}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border/60 text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 p-5 rounded-xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Total Emails</span>
          </div>
          <span className="text-3xl font-bold">{stats.total}</span>
        </div>
        <div className="bg-card border border-border/60 p-5 rounded-xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-green-500 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Successfully Sent</span>
          </div>
          <span className="text-3xl font-bold">{stats.sent}</span>
        </div>
        <div className="bg-card border border-border/60 p-5 rounded-xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Pending in Queue</span>
          </div>
          <span className="text-3xl font-bold">{stats.pending}</span>
        </div>
        <div className="bg-card border border-border/60 p-5 rounded-xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Delivery Failed</span>
          </div>
          <span className="text-3xl font-bold">{stats.failed}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search by recipient or event name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {(['all', 'pending', 'sent', 'failed'] as const).map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden relative shadow-sm min-h-[400px]">
        {loading && (
           <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/40 border-b border-border/60 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Recipient</th>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Queued At</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/40">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((email) => (
                  <tr key={email.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold">{email.recipientName}</span>
                        <span className="text-xs text-muted-foreground">{email.recipientEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {email.eventName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold capitalize
                        ${email.status === 'sent' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : ''}
                        ${email.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : ''}
                        ${email.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                      `}>
                        {email.status === 'sent' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {email.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {email.status === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
                        {email.status}
                      </span>
                      {email.error && (
                        <div className="text-[10px] text-red-400 mt-1 max-w-[150px] truncate" title={email.error}>
                          {email.error}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {email.createdAt?.toDate().toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {email.status === 'failed' && (
                         <button 
                           onClick={() => handleRetry(email.id)}
                           className="text-xs font-semibold text-accent hover:underline mr-4"
                         >
                           Retry
                         </button>
                      )}
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors inline-flex">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="font-medium text-sm text-foreground mb-1">Queue is empty</p>
                      <p className="text-xs max-w-sm mx-auto">No emails match your current filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/10">
          <span className="text-xs text-muted-foreground">Showing {filteredEmails.length} emails</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-md bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">1</button>
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
