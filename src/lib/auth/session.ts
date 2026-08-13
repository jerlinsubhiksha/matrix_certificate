import "server-only";
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "__session";
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 5; // 5 days

export async function createSessionCookie(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return { uid: decodedToken.uid };
  } catch (error) {
    console.error("Error creating session cookie:", error);
    throw new Error("Invalid token");
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
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}
