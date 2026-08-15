import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    const jobDoc = await adminDb.collection('generationJobs').doc(jobId).get();

    if (!jobDoc.exists) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(jobDoc.data(), { status: 200 });
  } catch (error: any) {
    console.error("Job fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
