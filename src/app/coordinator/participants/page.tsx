"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";

export default function CoordinatorParticipantsPage() {
  const { user } = useStore();
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!db || !user?.email) return;

      try {
        const pRef = collection(db, "participants");
        const q = query(pRef, where("coordinatorEmail", "==", user.email));
        const pSnap = await getDocs(q);
        
        let pList: any[] = [];
        pSnap.forEach((doc) => {
          pList.push({ id: doc.id, ...doc.data() });
        });

        setParticipants(pList);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [user]);

  return (
    <>
      <div className="breadcrumb">Home &nbsp;›&nbsp; <b>Participants</b></div>
      <div className="page-head" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>Global Participants</h1>
          <p style={{ color: "var(--text-dim)", marginTop: "0.5rem" }}>
            View all participants across your events.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>All Participants ({participants.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>Loading...</td></tr>
            ) : participants.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>No participants found.</td></tr>
            ) : (
              participants.map(p => (
                <tr key={p.id}>
                  <td><div className="name-cell">{p.name}</div></td>
                  <td>{p.email}</td>
                  <td>
                    <span className={`badge ${p.status === 'Sent' ? 'green' : p.status === 'Generated' ? 'violet' : p.status === 'Queued' ? 'amber' : 'slate'}`}>
                      {p.status}
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
