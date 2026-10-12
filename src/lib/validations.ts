import "server-only";
import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(3).max(100),
  coordinatorId: z.string().min(1),
  status: z.enum(["ACTIVE", "COMPLETED"]).default("ACTIVE"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const participantSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  eventId: z.string().min(1),
});

export const certificateStatusSchema = z.enum([
  "DRAFT",
  "GENERATED",
  "PENDING_APPROVAL",
  "APPROVED",
  "ISSUED",
  "REVOKED",
]);

export const revokeCertificateSchema = z.object({
  certificateId: z.string().min(1),
  reason: z.string().min(5).max(500),
});
