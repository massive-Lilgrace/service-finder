// hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: "customer" | "provider" | "admin";
}

export function useAuth(requireAuth = false, allowedRoles?: Array<"customer" | "provider" | "admin">) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyActiveSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          const sessionUser: SessionUser = data.user;

          // Role guard criteria checker validation node
          if (allowedRoles && !allowedRoles.includes(sessionUser.role)) {
            router.replace("/(auth)/login?error=unauthorized");
            return;
          }

          setUser(sessionUser);
        } else {
          setUser(null);
          if (requireAuth) {
            router.replace("/(auth)/login?expired=true");
          }
        }
      } catch (error) {
        console.error("Authentication lifecycle handshake interrupted:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyActiveSession();
  }, [requireAuth, allowedRoles, router]);

  const signOut = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        router.push("/(auth)/login");
      }
    } catch (error) {
      console.error("Signout command failed to sync across nodes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, isAuthenticated: !!user, signOut };
}