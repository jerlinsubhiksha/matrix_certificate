import "server-only";
import * as admin from "firebase-admin";

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Handle newlines in the private key properly
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin credentials missing. Admin SDK not initialized.");
    // In production, we might want to throw an error here. 
    // For development, we return null or throw depending on strictness.
    throw new Error("Missing Firebase Admin credentials in environment variables.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
};

export const adminApp = initializeFirebaseAdmin();
export const adminAuth = admin.auth(adminApp);
export const adminDb = admin.firestore(adminApp);
