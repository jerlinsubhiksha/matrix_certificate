import "server-only";
import { adminDb } from "../firebase/admin";
import crypto from "crypto";
import { requireAuthenticatedUser } from "../auth/permissions";

/**
 * Generate a cryptographically secure, unguessable certificate ID
 */
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  // 16 bytes = 32 hex characters of high entropy
  const randomHex = crypto.randomBytes(16).toString("hex").toUpperCase();
  return `MTRX-${year}-${randomHex}`;
}

export async function logAudit(params: {
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
}) {
  const user = await requireAuthenticatedUser();
  
  const logRef = adminDb.collection("audit_logs").doc();
  await logRef.set({
    id: logRef.id,
    actorId: user.uid,
    actorRole: user.role,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    timestamp: new Date().toISOString(),
    metadata: params.metadata || {},
  });
}
