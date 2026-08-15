import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "your-firebase-project-id";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "your-firebase-service-account-email";
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n');
    
    // Only initialize if we have actual credentials, otherwise mock it for dev
    if (projectId && clientEmail && privateKey && !privateKey.includes("your-firebase")) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      console.warn("Firebase Admin credentials missing or using placeholders. Firestore features will crash if called.");
      // Initialize an empty app just to prevent 'length of undefined' crashes, but calls will fail
      initializeApp({ projectId: 'mock-project' });
    }
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export const adminAuth = getApps().length ? getAuth() : null as any;
export const adminDb = getApps().length ? getFirestore() : null as any;
