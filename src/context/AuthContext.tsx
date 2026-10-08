"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { useRouter, usePathname } from "next/navigation";

export type Role = "admin" | "coordinator" | "teacher" | "student" | null;

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  createdAt: string | Date | Record<string, unknown>;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  role: Role;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  role: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setCurrentUser(user);
        try {
          // Force refresh token to ensure custom claims are up to date
          const token = await user.getIdTokenResult(true);
          const customRole = token.claims.role as Role;
          
          if (customRole) {
            setRole(customRole);
          }
          
          // Fetch the full profile from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            setUserProfile(profileData);
            
            // If custom claim role isn't set yet (or we rely on Firestore as source of truth for UI)
            if (!customRole) {
              setRole(profileData.role || "coordinator");
            }
          } else {
            // No firestore doc, fallback to coordinator for testing
            setRole(customRole || "coordinator");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setRole("coordinator"); // Fallback on error
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
