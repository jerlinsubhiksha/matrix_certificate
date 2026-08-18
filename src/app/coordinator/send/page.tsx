"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";

export default function CoordinatorSendPage() {
  const { user } = useStore();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      if (!db || !user?.email) {
        if (user && !user.email) setLoading(false);
        return;
      }
      try {
        const queueRef = collection(db, "emailQueue");
        const q = query(queueRef, where("coordinatorEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        let queueList: any[] = [];
        querySnapshot.forEach((doc) => {
          queueList.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by queuedAt descending
        queueList.sort((a, b) => new Date(b.queuedAt || 0).getTime() - new Date(a.queuedAt || 0).getTime());
        setQueue(queueList);
      } catch (error) {
        console.error("Error fetching email queue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, [user]);

  return (
    <>
      <div className="breadcrumb">Home &nbsp;›&nbsp; <b>Send Certificates</b></div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Delivery</div>
          <h1>Email <span className="accent">Queue</span></h1>
        </div>
        <div className="top-actions">
          <button className="pill-btn primary">Refresh Queue</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Dispatch Status</h3>
          <span className="see-all">Pending: {queue.filter(q => q.status === 'Pending').length}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Participant Email</th>
              <th>Event</th>
              <th>Status</th>
              <th>Queued On</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>Loading...</td></tr>
            ) : queue.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>No emails in queue.</td></tr>
            ) : (
              queue.map(item => (
                <tr key={item.id}>
                  <td><div className="name-cell">{item.participantEmail}</div></td>
                  <td>{item.eventName}</td>
                  <td>
                    <span className={`badge ${item.status === 'Sent' ? 'green' : item.status === 'Failed' ? 'amber' : 'violet'}`}>
                      {item.status || 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(item.queuedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
