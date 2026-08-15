"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function MyEventsPage() {
  const { user } = useStore();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!db || !user?.email) return;

      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("createdBy", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        let eventsList: any[] = [];
        querySnapshot.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() });
        });

        eventsList.sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime());
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  return (
    <>
      <div className="breadcrumb">Home &nbsp;›&nbsp; <b>My Events</b></div>
      <div className="page-head" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>My Events</h1>
          <p style={{ color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Manage and monitor all your certificate pipelines.
          </p>
        </div>
        <div className="top-actions">
          <Link href="/coordinator/events/new" className="pill-btn" style={{ textDecoration: 'none' }}>＋ New Event</Link>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>All Events ({events.length})</h3>
        </div>
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
            ) : events.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>No events found.</td></tr>
            ) : (
              events.map(event => (
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
