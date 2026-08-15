"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";

export default function CoordinatorSendQueuePage() {
  const { user } = useStore();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      if (!db || !user?.email) return;

      try {
        const qRef = collection(db, "emailQueue");
        const q = query(qRef, where("coordinatorEmail", "==", user.email));
        const qSnap = await getDocs(q);
        
        let qList: any[] = [];
        qSnap.forEach((doc) => {
          qList.push({ id: doc.id, ...doc.data() });
        });

        qList.sort((a, b) => new Date(b.queuedAt || 0).getTime() - new Date(a.queuedAt || 0).getTime());
        setQueue(qList);
      } catch (error) {
        console.error("Error fetching queue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
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
      <div className="breadcrumb">Home &nbsp;›&nbsp; <b>Send Certificates</b></div>
      <div className="page-head" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>Email Queue</h1>
          <p style={{ color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Monitor and manage pending emails.
          </p>
        </div>
        <div className="top-actions">
          <button onClick={handleResumeSending} className="pill-btn primary">Resume Sending</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Queue Items ({queue.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Participant</th>
              <th>Email</th>
              <th>Queued At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>Loading...</td></tr>
            ) : queue.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>Queue is empty.</td></tr>
            ) : (
              queue.map(q => (
                <tr key={q.id}>
                  <td><div className="name-cell">{q.participantName}</div></td>
                  <td>{q.participantEmail}</td>
                  <td>{new Date(q.queuedAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${q.status === 'Sent' ? 'green' : q.status === 'Failed' ? 'amber' : 'slate'}`}>
                      {q.status}
                    </span>
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
