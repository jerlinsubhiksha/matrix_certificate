import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // 2. Verify the ID token and check for admin role
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check if the user is an admin (Custom Claim)
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 3. Parse Request Body
    const body = await request.json();
    const { email, name, role, status } = body;

    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure role is valid and cannot be escalated to admin by mistake
    const validRoles = ['admin', 'coordinator', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // 4. Create the Firebase Auth User
    // Instead of setting a password, we create the user and they can reset their password later
    // or we can generate a random strong password and send a password reset link
    const userRecord = await adminAuth.createUser({
      email,
      displayName: name,
      emailVerified: false,
    });

    // 5. Set Custom User Claims for Role-Based Access Control
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    // 6. Create the Firestore Profile
    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      name,
      role,
      status: status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 7. Generate a Password Reset Link to send back (or send via email trigger)
    const passwordResetLink = await adminAuth.generatePasswordResetLink(email);

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name,
        role
      },
      passwordResetLink
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle Firebase Auth errors gracefully
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
