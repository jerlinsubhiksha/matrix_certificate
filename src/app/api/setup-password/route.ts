import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // 1. Check if user exists in Firebase Auth
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'User account not found. Please contact an admin.' }, { status: 404 });
      }
      throw error;
    }

    // 2. Check if user is a coordinator in Firestore
    const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
    
    // We should also check by email if the doc ID doesn't match the UID (though it should)
    let isCoordinator = false;
    
    if (userDoc.exists) {
      const data = userDoc.data();
      if (data?.role?.toLowerCase() === 'coordinator') {
        isCoordinator = true;
      }
    } else {
      // Fallback: search by email in users collection
      const usersRef = adminDb.collection('users');
      const q = usersRef.where('email', '==', email);
      const snapshot = await q.get();
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        if (data?.role?.toLowerCase() === 'coordinator') {
          isCoordinator = true;
        }
      }
    }

    if (!isCoordinator) {
      return NextResponse.json({ error: 'Unauthorized: Not a registered coordinator.' }, { status: 403 });
    }

    // 3. Update the user's password
    await adminAuth.updateUser(userRecord.uid, {
      password: password
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Error setting up password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
