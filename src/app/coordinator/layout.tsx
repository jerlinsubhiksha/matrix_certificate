import React from "react";
import Link from "next/link";
import "@/app/theme.css";

export const metadata = {
  title: "Coordinator | Matrix Certification",
  description: "Coordinator portal for Matrix Certification.",
};

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="coordinator-theme">
      <div className="shell">
        <aside className="sidebar">
        <div>
          <div className="brand"><div className="dot">M</div> MATRIX</div>
          <div className="role-tag" style={{ color: "#c9b5ff", background: "#8b5cf622", borderColor: "#8b5cf644" }}>Coordinator</div>
        </div>
        <nav>
          <Link className="active" href="/coordinator/dashboard"><span className="icon">▦</span> Dashboard</Link>
          <Link href="/coordinator/events"><span className="icon">◷</span> My Events</Link>
          <Link href="/coordinator/events/new"><span className="icon">＋</span> Create Event</Link>
          <Link href="/coordinator/participants"><span className="icon">☺</span> Participants</Link>
          <Link href="/coordinator/certificates"><span className="icon">▤</span> Certificates</Link>
          <Link href="/coordinator/send"><span className="icon">✉</span> Send Certificates</Link>
          <div className="nav-section-label">Account</div>
          <Link href="/coordinator/profile"><span className="icon">◐</span> Profile</Link>
        </nav>
        <div className="sidebar-footer">
          <button><span className="icon">⏻</span> Logout</button>
        </div>
      </aside>
      <main className="main">
        {children}
      </main>
      </div>
    </div>
  );
}
