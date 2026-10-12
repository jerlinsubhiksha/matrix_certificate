import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { eventId, participants, templateDriveFileId, folderId, fields } = await request.json();

    if (!eventId || !participants || participants.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create a generation job document in Firestore
    const jobRef = adminDb.collection('generationJobs').doc();
    await jobRef.set({
      eventId,
      totalParticipants: participants.length,
      processed: 0,
      generated: 0,
      failed: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Trigger the background worker processing asynchronously
    // In Next.js, we can just call an async function without awaiting it to let it run in the background.
    // NOTE: On Vercel serverless, background tasks might be killed after the response is returned.
    // For a robust production app on serverless, consider using something like Inngest, Upstash QStash, or Google Cloud Tasks.
    // For this architecture demo, we will execute the processing loop asynchronously.
    processBatchInBackground(jobRef.id, eventId, participants, templateDriveFileId, folderId, fields);

    return NextResponse.json({ jobId: jobRef.id, status: 'started' }, { status: 202 });

  } catch (error: any) {
    console.error("Batch job start error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// The background worker logic
async function processBatchInBackground(
  jobId: string, 
  eventId: string, 
  participants: any[], 
  templateDriveFileId: string, 
  folderId: string, 
  fields: any[]
) {
  const jobRef = adminDb.collection('generationJobs').doc(jobId);
  
  try {
    await jobRef.update({ status: 'processing', updatedAt: new Date().toISOString() });

    // Mock processing loop for architecture structure (To be replaced with actual pdf-lib + Drive API integration in full implementation)
    let generated = 0;
    let failed = 0;

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      try {
        // Here we would:
        // 1. Generate PDF with pdf-lib
        // 2. Upload to Google Drive
        // 3. Save certificate record to Firestore
        // 4. Add to Email Queue Firestore
        
        // Simulating generation time
        await new Promise(r => setTimeout(r, 500)); 
        
        generated++;
      } catch (err) {
        failed++;
      }

      // Update progress every 5 participants to avoid hitting Firestore too hard
      if ((i + 1) % 5 === 0 || i === participants.length - 1) {
        await jobRef.update({
          processed: i + 1,
          generated,
          failed,
          updatedAt: new Date().toISOString()
        });
      }
    }

    await jobRef.update({ 
      status: 'completed', 
      updatedAt: new Date().toISOString() 
    });

    // Log the milestone
    await adminDb.collection('activityLogs').add({
      action: 'Batch Generation Completed',
      eventId,
      details: `${generated} generated, ${failed} failed.`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Background job ${jobId} crashed:`, error);
    await jobRef.update({ status: 'error', updatedAt: new Date().toISOString() });
  }
}
