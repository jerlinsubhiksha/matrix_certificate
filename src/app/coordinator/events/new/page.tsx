"use client";

import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEventPage() {
  const { user } = useStore();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !user?.email) return;
    
    setIsSubmitting(true);
    try {
      const newEvent = {
        name,
        date,
        description,
        createdBy: user.email,
        coordinator: user.displayName || "Coordinator",
        status: "Draft",
        participantsCount: 0,
        createdDate: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, "events"), newEvent);
      
      useStore.getState().addActivityLog({
        action: 'Created Event',
        description: `Created new event '${name}'`,
        userEmail: user.email
      });

      router.push(`/coordinator/events/${docRef.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="breadcrumb">
        <Link href="/coordinator/dashboard" style={{color: 'inherit', textDecoration: 'none'}}>Home</Link> &nbsp;›&nbsp; 
        <Link href="/coordinator/events" style={{color: 'inherit', textDecoration: 'none'}}>My Events</Link> &nbsp;›&nbsp; 
        <b>New Event</b>
      </div>
      
      <div className="page-head">
        <div>
          <div className="eyebrow">Setup</div>
          <h1>Create <span className="accent">New Event</span></h1>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="panel-head">
          <h3>Event Details</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a29abf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Name</label>
            <input 
              required 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Annual Tech Symposium"
              style={{
                width: '100%',
                background: '#0d0814',
                border: '1px solid #231d36',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a29abf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Date</label>
            <input 
              required 
              type="date" 
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%',
                background: '#0d0814',
                border: '1px solid #231d36',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                colorScheme: 'dark'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a29abf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description (Optional)</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Internal notes about this event..."
              rows={3}
              style={{
                width: '100%',
                background: '#0d0814',
                border: '1px solid #231d36',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '1px solid #231d36' }}>
            <Link href="/coordinator/events" className="pill-btn" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="pill-btn primary"
              style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
