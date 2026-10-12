import "server-only";
import { verifySession } from "./session";
import { adminDb } from "@/lib/firebase/admin";
import { Role, UserRecord } from "./roles";

/**
 * Ensures the user is authenticated and retrieves their trusted DB record.
 */
export async function requireAuthenticatedUser(): Promise<UserRecord> {
  const decodedClaims = await verifySession();
  
  if (!decodedClaims) {
    throw new Error("UNAUTHENTICATED");
  }

  // Fetch trusted role from Firestore
  const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
  
  if (!userDoc.exists) {
    throw new Error("USER_NOT_FOUND");
  }

  return userDoc.data() as UserRecord;
}

/**
 * Ensures the user has the Admin role.
 */
export async function requireAdmin(): Promise<UserRecord> {
  const user = await requireAuthenticatedUser();
  
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN: Admin access required.");
  }
  
  return user;
}

/**
 * Ensures the user has the Coordinator role.
 */
export async function requireCoordinator(): Promise<UserRecord> {
  const user = await requireAuthenticatedUser();
  
  if (user.role !== "COORDINATOR") {
    throw new Error("FORBIDDEN: Coordinator access required.");
  }
  
  return user;
}

/**
 * Ensures the user is a Coordinator AND owns the specific event.
 */
export async function requireEventAccess(eventId: string): Promise<UserRecord> {
  const user = await requireCoordinator();
  
  const eventDoc = await adminDb.collection("events").doc(eventId).get();
  if (!eventDoc.exists) {
    throw new Error("NOT_FOUND: Event does not exist.");
  }
  
  const eventData = eventDoc.data();
  if (eventData?.coordinatorId !== user.uid) {
    throw new Error("FORBIDDEN: You do not have access to this event.");
  }
  
  return user;
}
