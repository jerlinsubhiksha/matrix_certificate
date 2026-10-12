import * as dotenv from "dotenv";
dotenv.config();

import * as admin from "firebase-admin";
import crypto from "crypto";

// 1. Safety Checks
if (process.env.SEED_ENV !== "development") {
  console.error("FATAL: SEED_ENV must be set to 'development' to run this script.");
  process.exit(1);
}

if (!process.env.FIREBASE_PROJECT_ID?.includes("dev") && !process.env.FIREBASE_PROJECT_ID?.includes("local")) {
  console.warn("WARNING: You appear to be pointing at a non-dev project ID. Aborting for safety.");
  console.warn("Set a local emulator or dev project ID.");
  process.exit(1);
}

// 2. Initialize Admin SDK manually for the script
const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore(app);
const auth = admin.auth(app);

async function seed() {
  console.log("🌱 Starting safe idempotent database seed...");

  // 3. Create Admin User
  const adminUid = "admin-seed-uid";
  try {
    await auth.getUser(adminUid);
    console.log("Admin auth user exists, skipping creation.");
  } catch (e) {
    await auth.createUser({
      uid: adminUid,
      email: "admin@matrix.local",
      password: "password123", // DEV ONLY
      displayName: "Matrix Admin",
    });
    console.log("Created Admin auth user.");
  }

  await db.collection("users").doc(adminUid).set({
    uid: adminUid,
    email: "admin@matrix.local",
    name: "Matrix Admin",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  }, { merge: true });

  // 4. Create Coordinator User
  const coordinatorUid = "coordinator-seed-uid";
  try {
    await auth.getUser(coordinatorUid);
    console.log("Coordinator auth user exists, skipping creation.");
  } catch (e) {
    await auth.createUser({
      uid: coordinatorUid,
      email: "coordinator@matrix.local",
      password: "password123", // DEV ONLY
      displayName: "Sarah Coordinator",
    });
    console.log("Created Coordinator auth user.");
  }

  await db.collection("users").doc(coordinatorUid).set({
    uid: coordinatorUid,
    email: "coordinator@matrix.local",
    name: "Sarah Coordinator",
    role: "COORDINATOR",
    createdAt: new Date().toISOString(),
  }, { merge: true });

  // 5. Create Event assigned to Coordinator
  const eventId = "demo-event-id";
  await db.collection("events").doc(eventId).set({
    id: eventId,
    name: "Matrix Hackathon 2026",
    coordinatorId: coordinatorUid,
    status: "ACTIVE",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
    createdAt: new Date().toISOString(),
  }, { merge: true });
  console.log("Upserted demo event.");

  // 6. Template
  const templateId = "demo-template-id";
  const versionId = "v1";
  await db.collection("templates").doc(templateId).set({
    id: templateId,
    name: "Annual Excellence Award",
    currentVersion: 1,
    published: true,
    createdAt: new Date().toISOString(),
  }, { merge: true });

  await db.collection("templates").doc(templateId).collection("versions").doc(versionId).set({
    versionId,
    versionNumber: 1,
    elements: [
      { type: "text", text: "{{recipientName}}", x: 100, y: 200, fontSize: 32 }
    ],
    backgroundUrl: "",
    createdAt: new Date().toISOString(),
  }, { merge: true });
  console.log("Upserted demo template.");

  console.log("✅ Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
