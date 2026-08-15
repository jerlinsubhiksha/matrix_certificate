import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { generateCertificatePdf } from "@/lib/pdf";
import { downloadFileFromDrive, uploadPdfToDrive } from "@/lib/drive";
import { initAdmin } from "@/lib/firebase/admin";

// Initialize Firebase Admin
initAdmin();

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

    // 2. Fetch Pending Participants
    const participantsRef = db.collection("participants");
    const snapshot = await participantsRef
      .where("eventId", "==", eventId)
      .where("status", "==", "Pending")
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "No pending participants found" }, { status: 400 });
    }

    // 3. Download Template from Drive
    if (!event.templateId) {
      return NextResponse.json({ error: "Event missing templateId" }, { status: 400 });
    }

    let templateBytes: ArrayBuffer;
    try {
      templateBytes = await downloadFileFromDrive(event.templateId);
    } catch (e: any) {
      return NextResponse.json({ error: "Failed to download template from Google Drive. Ensure the Drive File ID is correct and shared with the service account." }, { status: 400 });
    }

    let generatedCount = 0;
    const batch = db.batch();

    // The fields logic. If the user hasn't mapped fields, use a default fallback
    const fields = event.fields || [
      {
        field: "name",
        x: 400, // adjust based on template size
        y: 300,
        font: "Helvetica",
        fontSize: 32,
        alignment: "center",
        color: "#000000"
      }
    ];

    // Create a folder for this event's certificates if we want, or just upload to root
    // For now we just upload to root as per drive.ts default, or we can use event.folderId if it existed
    const folderId = process.env.DRIVE_FOLDER_ID || 'root';

    // 4. Generate and Upload
    for (const doc of snapshot.docs) {
      const p = doc.data();
      try {
        const participantData = {
          name: p.name,
          email: p.email,
          event_name: event.name,
          event_date: event.date,
          department: p.department || "",
          institution: p.institution || "",
          register_number: p.registerNumber || "",
        };

        const pdfBytes = await generateCertificatePdf(templateBytes, participantData, fields, {});
        const buffer = Buffer.from(pdfBytes);
        
        const filename = `${p.name}_${event.name}_Certificate.pdf`.replace(/ /g, '_');
        
        // Upload to Drive
        const driveFileId = await uploadPdfToDrive(folderId, filename, buffer);

        // Record certificate in Firestore
        const certRef = db.collection("certificates").doc();
        batch.set(certRef, {
          eventId,
          participantId: doc.id,
          coordinatorEmail: event.createdBy,
          driveFileId,
          createdAt: new Date().toISOString()
        });

        // Update Participant Status
        batch.update(doc.ref, { status: "Generated", driveFileId });
        
        generatedCount++;
      } catch (err) {
        console.error(`Failed to generate for ${p.email}`, err);
        // Continue processing others
      }
    }

    await batch.commit();

    return NextResponse.json({ success: true, generatedCount });

  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
