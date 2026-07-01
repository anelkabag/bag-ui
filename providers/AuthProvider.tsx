"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

interface AuthContextValue {
  user: User | null;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<
    Database["public"]["Tables"]["profiles"]["Row"] | null
  >(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      if (!response.ok) {
        setProfile(null);
        return;
      }
      const data = await response.json();
      setProfile(data.profile ?? null);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const activeUser = session?.user ?? null;
      setUser(activeUser);

      if (activeUser) {
        await fetchProfile();
      }

      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const activeUser = session?.user ?? null;
        setUser(activeUser);
        if (activeUser) {
          await fetchProfile();
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      return error.message;
    }
    await fetchProfile();
    router.replace("/account");
    return null;
  };

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    setLoading(false);
    if (error) {
      return error.message;
    }
    router.replace("/account");
    return null;
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
    router.push("/");
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      return error.message;
    }
    return null;
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      resetPassword,
      refreshProfile,
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
