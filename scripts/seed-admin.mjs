import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../.env.local') });

// Make sure you have these in .env.local
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const auth = getAuth();
const db = getFirestore();

const adminEmail = "admin@matrix.com";
const adminPassword = "SecurePassword123!"; // Change this immediately after logging in
const adminName = "System Admin";

async function seedAdmin() {
  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(adminEmail);
      console.log("Admin user already exists in Firebase Auth. Skipping creation.");
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log("Creating admin user in Firebase Auth...");
        userRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: adminName,
          emailVerified: true,
        });
      } else {
        throw error;
      }
    }

    console.log("Setting 'admin' custom claim...");
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

    console.log("Upserting Firestore profile...");
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: adminEmail,
      name: adminName,
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });

    console.log("Admin seed completed successfully!");
    console.log(`Login Email: ${adminEmail}`);
    console.log(`Login Password: ${adminPassword}`);
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

seedAdmin();
