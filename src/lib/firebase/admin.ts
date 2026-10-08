import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'matrix-certification';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    
    // Extremely robust private key parsing for Vercel
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    
    // Remove surrounding quotes if they exist (Vercel sometimes adds them)
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    
    // Replace literal '\n' strings with actual newline characters
    privateKey = privateKey.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey && privateKey.includes('BEGIN PRIVATE KEY')) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("Firebase Admin initialized successfully.");
    } else {
      console.warn("Firebase Admin credentials not found or invalid in environment. Initializing mock app.");
      initializeApp({ projectId: 'mock-project' });
    }
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
    // Initialize mock to prevent total crash
    if (!getApps().length) {
      initializeApp({ projectId: 'mock-project' });
    }
  }
}

export const adminAuth = (getApps().length > 0 ? getAuth() : null) as unknown as Auth;
export const adminDb = (getApps().length > 0 ? getFirestore() : null) as unknown as Firestore;
