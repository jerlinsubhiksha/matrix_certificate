import { google } from 'googleapis';

/**
 * Initializes the Google Drive API client.
 * Uses the same service account credentials as Firebase Admin.
 * 
 * IMPORTANT: The destination Drive Folder must be shared with the Service Account email.
 */
export function getDriveClient() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Replace escaped newlines if provided in env var
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Firebase Service Account credentials for Drive API.");
  }

  const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/drive.file'] // Scoped to files created by the app
  );

  return google.drive({ version: 'v3', auth });
}

export async function uploadPdfToDrive(
  folderId: string,
  filename: string,
  pdfBuffer: Buffer
) {
  const drive = getDriveClient();

  const fileMetadata = {
    name: filename,
    parents: [folderId],
  };

  const media = {
    mimeType: 'application/pdf',
    // Using a readable stream from the buffer
    body: require('stream').Readable.from(pdfBuffer), 
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  return response.data.id;
}

export async function downloadFileFromDrive(fileId: string): Promise<ArrayBuffer> {
  const drive = getDriveClient();
  
  const response = await drive.files.get(
    { fileId: fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  
  return response.data as ArrayBuffer;
}
