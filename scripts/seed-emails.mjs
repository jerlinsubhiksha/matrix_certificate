import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
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

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

const mockEmails = [
  {
    recipientEmail: "john.doe@example.com",
    recipientName: "John Doe",
    eventName: "Web Development Bootcamp 2026",
    status: "sent",
    error: null,
  },
  {
    recipientEmail: "sarah.smith@example.com",
    recipientName: "Sarah Smith",
    eventName: "Web Development Bootcamp 2026",
    status: "sent",
    error: null,
  },
  {
    recipientEmail: "michael.williams@example.com",
    recipientName: "Michael Williams",
    eventName: "Web Development Bootcamp 2026",
    status: "failed",
    error: "SMTP connection timeout",
  },
  {
    recipientEmail: "emily.chen@example.com",
    recipientName: "Emily Chen",
    eventName: "Web Development Bootcamp 2026",
    status: "pending",
    error: null,
  },
  {
    recipientEmail: "david.brown@example.com",
    recipientName: "David Brown",
    eventName: "React Advanced Masterclass",
    status: "sent",
    error: null,
  },
  {
    recipientEmail: "jessica.davis@example.com",
    recipientName: "Jessica Davis",
    eventName: "React Advanced Masterclass",
    status: "failed",
    error: "Invalid email address format",
  },
  {
    recipientEmail: "daniel.miller@example.com",
    recipientName: "Daniel Miller",
    eventName: "React Advanced Masterclass",
    status: "pending",
    error: null,
  },
  {
    recipientEmail: "amanda.wilson@example.com",
    recipientName: "Amanda Wilson",
    eventName: "AI & Machine Learning Workshop",
    status: "sent",
    error: null,
  },
  {
    recipientEmail: "james.moore@example.com",
    recipientName: "James Moore",
    eventName: "AI & Machine Learning Workshop",
    status: "pending",
    error: null,
  },
  {
    recipientEmail: "ashley.taylor@example.com",
    recipientName: "Ashley Taylor",
    eventName: "UI/UX Design Fundamentals",
    status: "sent",
    error: null,
  },
];

async function seedEmails() {
  console.log("Starting email seeding process...");
  try {
    const emailsCollection = db.collection('emails');
    let count = 0;

    for (const email of mockEmails) {
      // Spread the dates to simulate a real queue over time
      const dateOffset = Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000; // random days up to 7
      const timeOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000); // random hours
      
      const createdAtDate = new Date(Date.now() - dateOffset - timeOffset);
      let sentAtDate = null;
      
      if (email.status === 'sent') {
         // Sent a few seconds/minutes after created
         sentAtDate = new Date(createdAtDate.getTime() + Math.floor(Math.random() * 300000));
      }

      await emailsCollection.add({
        ...email,
        createdAt: Timestamp.fromDate(createdAtDate),
        sentAt: sentAtDate ? Timestamp.fromDate(sentAtDate) : null
      });
      count++;
    }

    console.log(`Successfully seeded ${count} dummy emails to Firestore!`);
  } catch (error) {
    console.error("Error seeding emails:", error);
  }
}

seedEmails();
