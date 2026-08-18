import "server-only";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "__session";
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 5; // 5 days

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-for-local-dev-only"
);

// Hardcoded fallback admins for testing. The user will replace these.
const FALLBACK_ADMINS = ["admin@matrix.local", "alice@matrix.com", "sudiksha@matrix.com", "sudikshas@karunya.edu.in"];
const FALLBACK_COORDINATORS = ["sudikshasuresh127@gmail.com", "sudikshasuresh12@gmail.com"];

export async function createSessionCookie(idToken: string) {
  try {
    let decodedToken;
    try {
      // In a real environment with keys, this verifies the Google login
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (err: any) {
      if (err.message?.includes("credential")) {
        console.warn("Dev mode: Bypassing real Firebase token verification due to missing admin credentials.");
        // We will trust the token as a JSON string for local dev if admin keys are missing
        decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      } else {
        throw err;
      }
    }

    const email = decodedToken.email;
    const uid = decodedToken.uid;
    let role = "USER";

    // 1. Check if ADMIN
    const envAdmins = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : FALLBACK_ADMINS;
    if (envAdmins.includes(email)) {
      role = "ADMIN";
    } else {
      // 2. Check if COORDINATOR
      if (FALLBACK_COORDINATORS.includes(email)) {
        role = "COORDINATOR";
      } else {
        try {
          if (adminDb) {
             const coordsRef = adminDb.collection("coordinators");
             const snapshot = await coordsRef.where("email", "==", email).get();
             if (!snapshot.empty) {
               role = "COORDINATOR";
             }
          }
        } catch (err) {
          console.warn("Could not check Firestore for coordinator role, falling back to basic checks.", err);
        }
      }
    }

    // 3. Deny if neither
    if (role === "USER") {
      throw new Error(`Access Denied: ${email} is not authorized.`);
    }

    // 4. Create custom JWT
    const jwt = await new SignJWT({ uid, email, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5d')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, jwt, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return { uid, role };
  } catch (error) {
    console.error("Error creating session cookie:", error);
    throw error;
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, JWT_SECRET);
    return payload as { uid: string; email: string; role: string };
  } catch (error) {
    console.error("Error verifying custom session JWT:", error);
    return null;
  }
}

/**
 * STRICT AUTHORIZATION GUARD
 * Use this in Server Actions and API Routes to guarantee the caller has a specific role.
 */
export async function verifySessionAndRole(requiredRole: "ADMIN" | "COORDINATOR") {
  const claims = await verifySession();
  
  if (!claims) {
    throw new Error("UNAUTHENTICATED: No valid session found.");
  }

  if (claims.role !== requiredRole) {
    console.error(`ACCESS DENIED: User ${claims.uid} (Role: ${claims.role}) attempted to access ${requiredRole} resource.`);
    throw new Error(`UNAUTHORIZED: Requires ${requiredRole} role.`);
  }

  return claims;
}
