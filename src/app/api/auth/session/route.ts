import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, clearSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const { uid, role } = await createSessionCookie(idToken);
    console.log("Login successful! UID:", uid, "Role:", role);
    return NextResponse.json({ success: true, uid, role }, { status: 200 });
  } catch (error: any) {
    console.error("LOGIN FAILED IN API ROUTE:", error.message || error);
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear session" }, { status: 500 });
  }
}
