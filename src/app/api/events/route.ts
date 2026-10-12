import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await verifySession();
    const role = session?.role?.toUpperCase();
    if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const snapshot = await adminDb.collection("events").get();
    const events: any[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error("Error in get events API:", error);
    return NextResponse.json({ error: "Failed to fetch events", details: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    const role = session?.role?.toUpperCase();
    if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, date, coordinator, participantsCount, status, emailSubject, emailBody } = body;

    if (!name || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const eventPayload = {
      name: String(name).trim(),
      date: String(date).trim(),
      coordinator: coordinator || session.email || "Admin",
      participantsCount: Number(participantsCount) || 0,
      status: status || "Draft",
      emailSubject: emailSubject || `Your Certificate for ${name}`,
      emailBody: emailBody || `Hi {Participant Name},\n\nThank you for attending ${name}. Attached is your certificate of participation.\n\nBest,\nThe MATRIX Team`
    };

    const docRef = await adminDb.collection("events").add(eventPayload);

    return NextResponse.json({
      id: docRef.id,
      event: { id: docRef.id, ...eventPayload },
      message: "Event created successfully"
    });
  } catch (error: any) {
    console.error("Error in create event API:", error);
    return NextResponse.json({ error: error?.message || "Failed to create event" }, { status: 500 });
  }
}
