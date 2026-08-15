"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";

export default function NewEventPage() {
  const router = useRouter();
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    templateId: "",
    emailSubject: "",
    emailBody: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user?.email) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        ...formData,
        createdBy: user.email,
        createdDate: new Date().toISOString(),
        status: "Draft",
        participantsCount: 0,
      });
      router.push("/coordinator/dashboard");
    } catch (error) {
      console.error("Error creating event", error);
      alert("Failed to create event. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb">Home &nbsp;›&nbsp; Events &nbsp;›&nbsp; <b>New Event</b></div>
      <div className="page-head" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>Create New Event</h1>
          <p style={{ color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Set up the details, template, and email for your new certificate pipeline.
          </p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: "800px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Event Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Annual Hackathon 2026"
              style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "white" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Event Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
              style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "white" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Certificate Template ID (Drive File ID)</label>
            <input 
              type="text" 
              name="templateId" 
              value={formData.templateId} 
              onChange={handleChange} 
              required 
              placeholder="e.g. 1BxiMVs0XRY5n..."
              style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "white" }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>Upload your template to Google Drive and paste the File ID here.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Email Subject</label>
            <input 
              type="text" 
              name="emailSubject" 
              value={formData.emailSubject} 
              onChange={handleChange} 
              required 
              placeholder="Your Certificate from MATRIX"
              style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "white" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Email Body</label>
            <textarea 
              name="emailBody" 
              value={formData.emailBody} 
              onChange={handleChange} 
              required 
              rows={5}
              placeholder="Hi {Participant Name},\n\nThank you for attending..."
              style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "white", resize: "vertical" }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>You can use {'{Participant Name}'} as a placeholder.</span>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" disabled={loading} className="pill-btn primary" style={{ width: "100%", padding: "1rem", justifyContent: "center", cursor: "pointer" }}>
              {loading ? "Creating..." : "Create Event"}
            </button>
            <button type="button" onClick={() => router.push('/coordinator/dashboard')} className="pill-btn" style={{ width: "100%", padding: "1rem", justifyContent: "center", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
          
        </form>
      </div>
    </>
  );
}
