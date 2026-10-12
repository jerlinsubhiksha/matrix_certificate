import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * Initializes the Google Drive API client.
 * Uses the same service account credentials as Firebase Admin.
 * 
 * IMPORTANT: The destination Drive Folder must be shared with the Service Account email.
 */
export function getDriveClient() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY for Google Drive.");
  }

  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }
  if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });

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
    body: Readable.from(pdfBuffer), 
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
