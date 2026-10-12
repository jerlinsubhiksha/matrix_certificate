import { google } from 'googleapis';
import { Readable } from 'stream';

export function getGoogleAuthClient(accessToken?: string) {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );

  // The system refresh token has gmail.send permissions.
  // We prioritize the refresh token so email dispatch always succeeds with valid permissions.
  if (refreshToken) {
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
  } else if (accessToken) {
    oAuth2Client.setCredentials({ access_token: accessToken });
  } else {
    throw new Error("Missing Gmail OAuth credentials.");
  }

  return oAuth2Client;
}

export function getGmailClient(accessToken?: string) {
  const auth = getGoogleAuthClient(accessToken);
  return google.gmail({ version: 'v1', auth });
}

export async function uploadToDrive(fileName: string, pdfBuffer: Buffer, accessToken?: string) {
  try {
    const auth = getGoogleAuthClient(accessToken);
    const drive = google.drive({ version: 'v3', auth });
    
    const fileMetadata = {
      name: fileName,
      parents: [],
    };
    
    const media = {
      mimeType: 'application/pdf',
      body: Readable.from(pdfBuffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    return response.data;
  } catch (err: any) {
    console.warn("uploadToDrive skipped/failed:", err?.message);
    return { id: null, webViewLink: null };
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  bodyText: string,
  pdfBuffer?: Buffer,
  pdfFilename?: string,
  accessToken?: string
) {
  const gmail = getGmailClient(accessToken);

  // Construct raw email with attachments using boundary
  const boundary = `__boundary_${Date.now().toString(16)}__`;
  
  let rawMessage = `To: ${to}\r\n` +
                   `Subject: ${subject}\r\n` +
                   `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n` +
                   `--${boundary}\r\n` +
                   `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` +
                   `${bodyText}\r\n\r\n`;

  if (pdfBuffer && pdfFilename) {
    const attachmentBase64 = pdfBuffer.toString('base64');
    rawMessage += `--${boundary}\r\n` +
                  `Content-Type: application/pdf; name="${pdfFilename}"\r\n` +
                  `Content-Disposition: attachment; filename="${pdfFilename}"\r\n` +
                  `Content-Transfer-Encoding: base64\r\n\r\n` +
                  `${attachmentBase64}\r\n\r\n`;
  }
  
  rawMessage += `--${boundary}--`;

  const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return response.data;
}
