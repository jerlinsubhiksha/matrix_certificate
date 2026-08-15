import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/gmail";
import { downloadFileFromDrive } from "@/lib/drive";
import { initAdmin } from "@/lib/firebase/admin";

// Initialize Firebase Admin
initAdmin();

export async function POST(req: NextRequest) {
  try {
    const { coordinatorEmail } = await req.json();
    if (!coordinatorEmail) {
      return NextResponse.json({ error: "Missing coordinatorEmail" }, { status: 400 });
    }

    const db = getFirestore();

    // 1. Fetch Pending Queue items for this coordinator
    const queueRef = db.collection("emailQueue");
    const snapshot = await queueRef
      .where("coordinatorEmail", "==", coordinatorEmail)
      .where("status", "==", "Pending")
      .limit(50) // Batch size to prevent timeouts
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "No pending emails found." }, { status: 200 });
    }

    let sentCount = 0;
    let failedCount = 0;
    let quotaReached = 0;

    for (const doc of snapshot.docs) {
      const job = doc.data();
      
      // Check for daily quota reached (naive implementation, Gmail API will throw error on limit)
      // For real production, you would track sent count in a Redis/Firestore daily counter

      try {
        // Mark as sending
        await doc.ref.update({ status: "Sending", lastAttempt: new Date().toISOString() });

        // Download the PDF from Google Drive to attach it
        const pdfBytes = await downloadFileFromDrive(job.driveFileId);
        const pdfBuffer = Buffer.from(pdfBytes);

        // Personalize the body text
        const personalizedBody = job.emailBody.replace(/{Participant Name}/g, job.participantName);
        const filename = `${job.participantName}_Certificate.pdf`.replace(/ /g, '_');

        // Send Email
        await sendEmail(
          job.participantEmail,
          job.emailSubject,
          personalizedBody,
          pdfBuffer,
          filename
        );

        // Mark as Sent
        await doc.ref.update({ status: "Sent", sentAt: new Date().toISOString() });
        
        // Update Participant Status
        const pRef = db.collection("participants").doc(job.participantId);
        await pRef.update({ status: "Sent" });

        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send to ${job.participantEmail}`, err);
        
        // Check if it's a Quota Error (429 or 403 Rate Limit Exceeded)
        if (err.message?.includes("quota") || err.code === 429) {
          // Revert to pending
          await doc.ref.update({ status: "Pending", error: "Quota Reached" });
          quotaReached++;
          break; // Stop processing further
        }

        // Otherwise it's a hard fail
        await doc.ref.update({ status: "Failed", error: err.message });
        const pRef = db.collection("participants").doc(job.participantId);
        await pRef.update({ status: "Failed" });
        failedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      sentCount, 
      failedCount,
      quotaReached,
      message: quotaReached > 0 ? `Stopped early due to Gmail Quota. Sent ${sentCount}.` : `Finished processing batch. Sent ${sentCount}.`
    });

  } catch (error: any) {
    console.error("Send API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
