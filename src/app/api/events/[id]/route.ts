import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/auth/session";

export async function GET(request: Request, context: any) {
  try {
    const session = await verifySession();
    const role = session?.role?.toUpperCase();
    if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const doc = await adminDb.collection("events").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: { id: doc.id, ...doc.data() } });
  } catch (error: any) {
    console.error("Error in get event API:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const session = await verifySession();
    const role = session?.role?.toUpperCase();
    if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    const body = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    await adminDb.collection("events").doc(id).update(body);
    return NextResponse.json({ message: "Event updated successfully" });
  } catch (error: any) {
    console.error("Error in update event API:", error);
    return NextResponse.json({ error: error?.message || "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const session = await verifySession();
    const role = session?.role?.toUpperCase();
    if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    await adminDb.collection("events").doc(id).delete();
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("Error in delete event API:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete event" }, { status: 500 });
  }
}
