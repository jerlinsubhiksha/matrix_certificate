import { NextResponse } from 'next/server';
import { sendEmail, uploadToDrive } from '@/lib/gmail';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const { name, email, imageDataUrl, subject, customBody, googleAccessToken } = await request.json();

    if (!email || !imageDataUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Strip the data URL prefix to get the raw base64 string
    const base64Data = imageDataUrl.replace(/^data:image\/jpeg;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Convert the JPEG into a real PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const image = await pdfDoc.embedJpg(imageBuffer);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);
    const filename = `${name.replace(/\s+/g, '_')}_Certificate.pdf`;

    // Send the email using the Gmail OAuth credentials
    const finalSubject = subject || `Your Certificate for MATRIX`;
    
    // Replace {Participant Name} placeholder if it exists in the body
    let finalBody = customBody || `Hi ${name},\n\nCongratulations! Please find your official MATRIX certificate attached.\n\nBest regards,\nThe MATRIX Team`;
    finalBody = finalBody.replace(/{Participant Name}/g, name);
    
    console.log("Sending email to:", email, "Subject:", finalSubject);
    await sendEmail(email, finalSubject, finalBody, pdfBuffer, filename, googleAccessToken);

    // Also push to Google Drive!
    let driveLink = null;
    try {
      const driveResponse = await uploadToDrive(filename, pdfBuffer, googleAccessToken);
      driveLink = driveResponse.webViewLink;
    } catch (driveErr: any) {
      console.error("Drive upload failed. You may need to generate a new OAuth Token that includes Drive API scopes.", driveErr.message);
      // We don't throw here so the email success still goes through
    }

    return NextResponse.json({ success: true, driveLink });
  } catch (error: any) {
    console.error("Email dispatch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
