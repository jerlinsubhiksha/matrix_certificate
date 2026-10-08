import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifySessionAndRole } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    // Only ADMIN can add coordinators
    await verifySessionAndRole("ADMIN");

    const body = await request.json();
    const { name, email, role, status } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const usersRef = adminDb.collection("users");

    // Check if user already exists
    const snapshot = await usersRef.where("email", "==", email).get();
    
    const dbRole = role.toUpperCase().includes("ADMIN") ? "ADMIN" : "COORDINATOR";

    if (!snapshot.empty) {
      // Update existing
      const docId = snapshot.docs[0].id;
      await usersRef.doc(docId).update({
        name,
        role: dbRole,
        originalRole: role,
        status: status || "Active",
        updatedAt: new Date().toISOString()
      });
    } else {
      // Add new
      await usersRef.add({
        email,
        name,
        role: dbRole,
        originalRole: role,
        status: status || "Active",
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true, message: "Coordinator saved to database." });
  } catch (error: any) {
    console.error("Error saving coordinator:", error);
    if (error.message?.includes("UNAUTHORIZED") || error.message?.includes("UNAUTHENTICATED")) {
       return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to save coordinator" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Only ADMIN can delete coordinators
    await verifySessionAndRole("ADMIN");

    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      const batch = adminDb.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    return NextResponse.json({ success: true, message: "Coordinator removed from database." });
  } catch (error: any) {
    console.error("Error deleting coordinator:", error);
    if (error.message?.includes("UNAUTHORIZED") || error.message?.includes("UNAUTHENTICATED")) {
       return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete coordinator" }, { status: 500 });
  }
}
