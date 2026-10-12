import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session || (session.role !== "ADMIN" && session.role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, participants } = body;

    if (!eventId || !participants || !Array.isArray(participants)) {
      return NextResponse.json({ error: "Missing eventId or participants" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const batch = adminDb.batch();
    const pRef = adminDb.collection("participants");
    
    for (const p of participants) {
      const newDocRef = pRef.doc();
      batch.set(newDocRef, {
        eventId,
        name: p.name,
        email: p.email,
        status: "Pending",
        timestamp: new Date().toISOString()
      });
    }

    await batch.commit();

    // Also update the event's participantsCount
    const eventRef = adminDb.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();
    
    if (eventDoc.exists) {
      const currentCount = eventDoc.data()?.participantsCount || 0;
      await eventRef.update({
        participantsCount: currentCount + participants.length
      });
    }

    return NextResponse.json({ message: "Participants batch added successfully", count: participants.length });
  } catch (error: any) {
    console.error("Error in participants batch API:", error);
    return NextResponse.json({ error: "Failed to add participants" }, { status: 500 });
  }
}
