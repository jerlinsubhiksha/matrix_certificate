import * as admin from "firebase-admin";

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore(app);

async function addWhitelist() {
  const email = "test_coordinator@matrix.local";
  const docRef = db.collection("users").doc();
  await docRef.set({
    email,
    role: "COORDINATOR",
    name: "Test Coordinator",
    status: "PENDING",
    createdAt: new Date().toISOString()
  });
  console.log(`Added whitelisted email: ${email} with ID: ${docRef.id}`);
  process.exit(0);
}

addWhitelist().catch(console.error);
