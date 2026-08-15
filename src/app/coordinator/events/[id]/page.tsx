"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, writeBatch, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";
import * as XLSX from "xlsx";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useStore();
  
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [queuing, setQueuing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!db || !user?.email) return;

      try {
        const docRef = doc(db, "events", resolvedParams.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const eventData = docSnap.data();
          if (eventData.createdBy !== user.email) {
            alert("Unauthorized");
            router.push("/coordinator/dashboard");
            return;
          }
          setEvent({ id: docSnap.id, ...eventData });

          // Fetch participants for this event
          const pRef = collection(db, "participants");
          const q = query(pRef, where("eventId", "==", resolvedParams.id));
          const pSnap = await getDocs(q);
          const pList: any[] = [];
          pSnap.forEach((d) => pList.push({ id: d.id, ...d.data() }));
          setParticipants(pList);
        } else {
          router.push("/coordinator/dashboard");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, user, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db) return;

    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        alert("The Excel file is empty.");
        setUploading(false);
        return;
      }

      const batch = writeBatch(db);
      const newParticipants: any[] = [];
      const pRef = collection(db, "participants");

      for (const row of jsonData as any[]) {
        const name = row["Participant Name"] || row["Name"] || row["name"];
        const email = row["Email Address"] || row["Email"] || row["email"];
        
        if (name && email) {
          const newDocRef = doc(pRef);
          const pData = {
            eventId: resolvedParams.id,
            coordinatorEmail: user?.email,
            name: name,
            email: email,
            registerNumber: row["Register Number"] || "",
            department: row["Department"] || "",
            institution: row["Institution"] || "",
            status: "Pending",
          };
          batch.set(newDocRef, pData);
          newParticipants.push({ id: newDocRef.id, ...pData });
        }
      }

      await batch.commit();
      
      // Update event participants count
      const eventRef = doc(db, "events", resolvedParams.id);
      await updateDoc(eventRef, {
        participantsCount: (event?.participantsCount || 0) + newParticipants.length,
        status: "Active"
      });

      setParticipants([...participants, ...newParticipants]);
      setEvent({ ...event, participantsCount: (event?.participantsCount || 0) + newParticipants.length, status: "Active" });
      alert(`Successfully uploaded ${newParticipants.length} participants.`);

    } catch (error) {
      console.error("Upload error", error);
      alert("Failed to parse Excel file. Make sure it has 'Participant Name' and 'Email Address' columns.");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const handleGenerate = async () => {
    if (!confirm("Are you sure you want to generate certificates for all pending participants?")) return;
    setGenerating(true);
    
    try {
      // We will call our server-side API to do the heavy lifting with pdf-lib and googleapis
      const res = await fetch(`/api/certificates/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: resolvedParams.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      alert(`Successfully generated ${data.generatedCount} certificates and uploaded to Drive!`);
      // Reload page to see updated statuses
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(`Error generating certificates: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleQueueEmails = async () => {
    if (!confirm("Queue all generated certificates for email distribution?")) return;
    setQueuing(true);
    
    try {
      // Call API to queue emails
      const res = await fetch(`/api/certificates/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: resolvedParams.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Queuing failed");

      alert(`Successfully queued ${data.queuedCount} emails! They will be processed in the background.`);
      
      const eventRef = doc(db, "events", resolvedParams.id);
      await updateDoc(eventRef, { status: "Sent" });
      setEvent({ ...event, status: "Sent" });
      
    } catch (error: any) {
      console.error(error);
      alert(`Error queuing emails: ${error.message}`);
    } finally {
      setQueuing(false);
    }
  };

  if (loading) return <div style={{ padding: "2rem", color: "white" }}>Loading event details...</div>;
  if (!event) return <div style={{ padding: "2rem", color: "white" }}>Event not found.</div>;

  const pendingGeneration = participants.filter(p => p.status === "Pending").length;
  const generatedCount = participants.filter(p => p.status === "Generated" || p.status === "Queued" || p.status === "Sent").length;

  return (
    <>
      <div className="breadcrumb" style={{ cursor: 'pointer' }} onClick={() => router.push('/coordinator/dashboard')}>
        Home &nbsp;›&nbsp; Events &nbsp;›&nbsp; <b>{event.name}</b>
      </div>
      <div className="page-head" style={{ marginBottom: "2rem" }}>
        <div>
          <div className="eyebrow">{new Date(event.date).toLocaleDateString()}</div>
          <h1>{event.name}</h1>
          <p style={{ color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Status: <span style={{ color: "var(--accent)" }}>{event.status}</span>
          </p>
        </div>
        <div className="top-actions">
          <label className="pill-btn primary" style={{ cursor: "pointer" }}>
            {uploading ? "Uploading..." : "⇪ Upload Participants"}
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload} 
              style={{ display: "none" }} 
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>Pipeline Actions</h3>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "var(--bg-deep)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--card-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <b>1. Generate Certificates</b>
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{pendingGeneration} pending</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-faint)", marginBottom: "1rem" }}>
                Takes the uploaded template and draws participant names onto it, then uploads to Google Drive.
              </p>
              <button 
                onClick={handleGenerate} 
                disabled={generating || pendingGeneration === 0}
                className="pill-btn" 
                style={{ width: "100%", justifyContent: "center", cursor: (generating || pendingGeneration === 0) ? "not-allowed" : "pointer", opacity: (generating || pendingGeneration === 0) ? 0.5 : 1 }}
              >
                {generating ? "Generating..." : "Generate PDFs"}
              </button>
            </div>

            <div style={{ background: "var(--bg-deep)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--card-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <b>2. Send Emails</b>
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{generatedCount} generated</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-faint)", marginBottom: "1rem" }}>
                Queues the generated certificates for distribution via Gmail API.
              </p>
              <button 
                onClick={handleQueueEmails}
                disabled={queuing || generatedCount === 0}
                className="pill-btn primary" 
                style={{ width: "100%", justifyContent: "center", cursor: (queuing || generatedCount === 0) ? "not-allowed" : "pointer", opacity: (queuing || generatedCount === 0) ? 0.5 : 1 }}
              >
                {queuing ? "Queuing..." : "Send to Queue"}
              </button>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Participants ({participants.length})</h3>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-faint)", fontSize: "0.8rem" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Name</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Email</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "2rem", color: "var(--text-faint)" }}>
                      No participants uploaded yet.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--card-border)", fontSize: "0.85rem" }}>
                      <td style={{ padding: "0.75rem 1rem", color: "white" }}>{p.name}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--text-dim)" }}>{p.email}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span className={`badge ${p.status === 'Sent' ? 'green' : p.status === 'Generated' ? 'violet' : p.status === 'Queued' ? 'amber' : 'slate'}`} style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
