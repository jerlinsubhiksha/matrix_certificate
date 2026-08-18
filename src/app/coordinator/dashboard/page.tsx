"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function CoordinatorDashboard() {
  const { user, activityLogs } = useStore();
  const [stats, setStats] = useState({
    totalEvents: 0,
    inProgressEvents: 0,
    totalCerts: 0,
    emailsSent: 0,
    emailsPending: 0,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!db || !user?.email) {
        // If user is not fully loaded yet, we wait, but if they have no email, we should stop loading
        if (user && !user.email) setLoading(false);
        return;
      }

      try {
        // Fetch My Events
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("createdBy", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        let eventsList: any[] = [];
        let inProgress = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          eventsList.push({ id: doc.id, ...data });
          if (data.status === "Active" || data.status === "Generating") {
            inProgress++;
          }
        });

        // Sort by date descending
        eventsList.sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime());
        setRecentEvents(eventsList.slice(0, 5));

        // Fetch Queue Stats for this coordinator
        // Note: In a real robust system, you'd query queue where coordinator == user.email
        // For now, assuming emailQueue has a coordinatorEmail field
        const queueRef = collection(db, "emailQueue");
        const sentQ = query(queueRef, where("coordinatorEmail", "==", user.email), where("status", "==", "Sent"));
        const pendingQ = query(queueRef, where("coordinatorEmail", "==", user.email), where("status", "==", "Pending"));
        
        const sentCount = await getCountFromServer(sentQ).catch(() => ({ data: () => ({ count: 0 }) }));
        const pendingCount = await getCountFromServer(pendingQ).catch(() => ({ data: () => ({ count: 0 }) }));

        // Certificates generated (assuming certificates collection has coordinatorEmail)
        const certsRef = collection(db, "certificates");
        const certsQ = query(certsRef, where("coordinatorEmail", "==", user.email));
        const certsCount = await getCountFromServer(certsQ).catch(() => ({ data: () => ({ count: 0 }) }));

        setStats({
          totalEvents: eventsList.length,
          inProgressEvents: inProgress,
          totalCerts: certsCount.data().count,
          emailsSent: sentCount.data().count,
          emailsPending: pendingCount.data().count,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleResumeSending = async () => {
    if (!user?.email) return;
    if (!confirm("Start sending all pending certificates in the queue?")) return;
    
    try {
      const res = await fetch("/api/certificates/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coordinatorEmail: user.email }),
      });
      const data = await res.json();
      alert(data.message || `Sent ${data.sentCount} emails.`);
      window.location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <>
      <div className="breadcrumb">Home &nbsp;›&nbsp; <b>Dashboard</b></div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Your workspace</div>
          <h1>Welcome back, <span className="accent">{user?.displayName?.split(' ')[0] || "Coordinator"}</span></h1>
        </div>
        <div className="top-actions">
          <Link href="/coordinator/events/new" className="pill-btn" style={{ textDecoration: 'none' }}>＋ New Event</Link>
          <button onClick={handleResumeSending} className="pill-btn primary">Resume Sending</button>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">My Events</span>
            <div className="stat-icon" style={{ background: "#8b5cf622", color: "#c9b5ff" }}>◷</div>
          </div>
          <div className="stat-value">{loading ? "..." : stats.totalEvents}</div>
          <div className="stat-sub">{stats.inProgressEvents} in progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Certificates</span>
            <div className="stat-icon" style={{ background: "#f5a52422", color: "#f5a524" }}>▤</div>
          </div>
          <div className="stat-value">{loading ? "..." : stats.totalCerts}</div>
          <div className="stat-sub">Generated by you</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Emails Sent</span>
            <div className="stat-icon" style={{ background: "#2fd48022", color: "#2fd480" }}>✉</div>
          </div>
          <div className="stat-value">{loading ? "..." : stats.emailsSent}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Pending</span>
            <div className="stat-icon" style={{ background: "#f5a52422", color: "#f5a524" }}>◔</div>
          </div>
          <div className="stat-value">{loading ? "..." : stats.emailsPending}</div>
          <div className="stat-sub">Queued for send</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3><span style={{ color: '#c9b5ff', marginRight: '8px', fontSize: '18px' }}>∿</span>Recent Activity</h3>
            <span className="see-all">View Logs</span>
          </div>
          {activityLogs && activityLogs.length > 0 ? (
            <div className="stepper">
              {activityLogs.filter((log: any) => log.userEmail === user?.email || log.userEmail === 'alice@matrix.com').slice(0, 5).map((log: any, idx: number) => {
                const date = new Date(log.timestamp);
                const now = new Date();
                const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
                let timeAgo = 'Just now';
                if (diff > 60) timeAgo = `${Math.floor(diff / 60)} minutes ago`;
                if (diff > 3600) timeAgo = `${Math.floor(diff / 3600)} hours ago`;
                if (diff > 86400) timeAgo = diff > 172800 ? `${Math.floor(diff / 86400)} days ago` : 'Yesterday';

                return (
                  <div className="step" key={log.id}>
                    <div className="step-dot current"></div>
                    <div className="step-body">
                      <b>{log.action}</b>
                      <span suppressHydrationWarning={true}>{timeAgo}</span>
                      <span style={{ display: 'block', marginTop: '4px' }}>{log.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '20px', color: '#635c7f', textAlign: 'center' }}>
              No recent activity found.
            </div>
          )}
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Quick actions</h3></div>
          <div className="quick-list">
            <Link href="/coordinator/events/new" className="quick-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="qi-icon">＋</div>
              <div className="qi-text"><b>Create new event</b><span>Name, date, template</span></div>
            </Link>
            <Link href="/coordinator/events" className="quick-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="qi-icon">⇪</div>
              <div className="qi-text"><b>Upload participants</b><span>Open an event to upload</span></div>
            </Link>
            <Link href="/coordinator/certificates" className="quick-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="qi-icon">▤</div>
              <div className="qi-text"><b>View certificates</b><span>Generated PDF history</span></div>
            </Link>
            <Link href="/coordinator/send" className="quick-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="qi-icon">✉</div>
              <div className="qi-text"><b>Send queue</b><span>Track delivery status</span></div>
            </Link>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>My events</h3><span className="see-all">View all</span></div>
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Participants</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>Loading...</td></tr>
            ) : recentEvents.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>No events found.</td></tr>
            ) : (
              recentEvents.map(event => (
                <tr key={event.id}>
                  <td><div className="name-cell">{event.name}</div></td>
                  <td>{new Date(event.date || event.createdDate).toLocaleDateString()}</td>
                  <td>{event.participantsCount || 0}</td>
                  <td>
                    <span className={`badge ${event.status === 'Sent' ? 'green' : event.status === 'Generating' ? 'violet' : 'amber'}`}>
                      {event.status || 'Draft'}
                    </span>
                  </td>
                  <td className="row-action">
                    <Link href={`/coordinator/events/${event.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>Open ▾</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
