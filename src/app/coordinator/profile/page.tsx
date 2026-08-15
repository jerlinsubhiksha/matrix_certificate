"use client";

import React from "react";
import { useStore } from "@/lib/store";

export default function CoordinatorProfilePage() {
  const { user } = useStore();

  return (
    <>
      <div className="breadcrumb">Home &nbsp;›&nbsp; <b>Profile</b></div>
      <div className="page-head" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>Your Profile</h1>
          <p style={{ color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: "600px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Name</label>
            <div style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "white" }}>
              {user?.displayName || "N/A"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Email Address</label>
            <div style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "white" }}>
              {user?.email || "N/A"}
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Role</label>
            <div style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-deep)", border: "1px solid var(--card-border)", color: "var(--accent)" }}>
              Coordinator
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
