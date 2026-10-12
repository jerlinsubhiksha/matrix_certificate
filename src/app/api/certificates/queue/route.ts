import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const db = getFirestore();

    // 1. Fetch Event
    const eventSnap = await db.collection("events").doc(eventId).get();
    if (!eventSnap.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const event = eventSnap.data()!;

    // 2. Fetch Generated Participants
    const participantsRef = db.collection("participants");
    const snapshot = await participantsRef
      .where("eventId", "==", eventId)
      .where("status", "==", "Generated")
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "No generated certificates waiting to be queued." }, { status: 400 });
    }

    let queuedCount = 0;
    const batch = db.batch();

    // 3. Create Queue Documents
    for (const doc of snapshot.docs) {
      const p = doc.data();
      
      const queueRef = db.collection("emailQueue").doc();
      batch.set(queueRef, {
        eventId,
        participantId: doc.id,
        coordinatorEmail: event.createdBy,
        participantName: p.name,
        participantEmail: p.email,
        driveFileId: p.driveFileId,
        emailSubject: event.emailSubject,
        emailBody: event.emailBody,
        status: "Pending",
        queuedAt: new Date().toISOString()
      });

      // Update Participant Status
      batch.update(doc.ref, { status: "Queued" });
      
      queuedCount++;
    }

    await batch.commit();

    return NextResponse.json({ success: true, queuedCount });

  } catch (error: any) {
    console.error("Queue API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
