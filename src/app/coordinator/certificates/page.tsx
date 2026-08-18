"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/lib/store";

export default function CoordinatorCertificatesPage() {
  const { user } = useStore();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      if (!db || !user?.email) {
        if (user && !user.email) setLoading(false);
        return;
      }
      try {
        const certsRef = collection(db, "certificates");
        const q = query(certsRef, where("coordinatorEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        let certList: any[] = [];
        querySnapshot.forEach((doc) => {
          certList.push({ id: doc.id, ...doc.data() });
        });
        
        setCertificates(certList);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, [user]);

  return (
    <>
      <div className="breadcrumb">Home &nbsp;›&nbsp; <b>Certificates</b></div>
      <div className="page-head">
        <div>
          <div className="eyebrow">History</div>
          <h1>Generated <span className="accent">Certificates</span></h1>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Certificate History</h3>
          <span className="see-all">Total: {certificates.length}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Participant Name</th>
              <th>Email</th>
              <th>Event</th>
              <th>Status</th>
              <th>Generated On</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>Loading...</td></tr>
            ) : certificates.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#635c7f' }}>No certificates generated yet.</td></tr>
            ) : (
              certificates.map(cert => (
                <tr key={cert.id}>
                  <td><div className="name-cell">{cert.participantName}</div></td>
                  <td>{cert.participantEmail}</td>
                  <td>{cert.eventName}</td>
                  <td>
                    <span className="badge green">Generated</span>
                  </td>
                  <td>{new Date(cert.generatedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
