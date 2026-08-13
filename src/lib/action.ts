import "server-only";
import { requireAuthenticatedUser } from "./auth/permissions";
import { UserRecord } from "./auth/roles";
import { z } from "zod";

export type ServerActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * A secure wrapper for Server Actions that handles:
 * - Session/Auth verification
 * - Zod input validation
 * - Standardized error handling
 */
export async function secureAction<TInput, TOutput>(
  input: TInput,
  schema: z.ZodSchema<TInput>,
  actionLogic: (validInput: TInput, user: UserRecord) => Promise<TOutput>
): Promise<ServerActionResponse<TOutput>> {
  try {
    // 1. Authenticate
    const user = await requireAuthenticatedUser();

    // 2. Validate input
    const parsedInput = schema.safeParse(input);
    if (!parsedInput.success) {
      console.error("Validation error:", parsedInput.error.format());
      return { success: false, error: "Invalid input data provided." };
    }

    // 3. Execute logic (which handles its own deep role/resource ownership checks)
    const result = await actionLogic(parsedInput.data, user);
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    
    // Do not leak raw Firebase errors to the client
    let message = "Something went wrong. Please try again.";
    
    if (error.message && (
      error.message.includes("FORBIDDEN") || 
      error.message.includes("NOT_FOUND") ||
      error.message.includes("UNAUTHENTICATED")
    )) {
      message = error.message; // Safe to pass these explicit auth messages
    }
    
    return { success: false, error: message };
  }
}
