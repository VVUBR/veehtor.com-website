import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { frSupabase } from "../lib/frSupabase";

type Ctx = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestReset: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
};

const FRAuthContext = createContext<Ctx | null>(null);

export function FRAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = frSupabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    frSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: Ctx = {
    session,
    user: session?.user ?? null,
    loading,
    async signIn(email, password) {
      const { error } = await frSupabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    async signOut() {
      await frSupabase.auth.signOut();
    },
    async requestReset(email) {
      const { error } = await frSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/family-realty/reset-password`,
      });
      return { error: error?.message ?? null };
    },
    async updatePassword(password) {
      const { error } = await frSupabase.auth.updateUser({ password });
      return { error: error?.message ?? null };
    },
  };

  return <FRAuthContext.Provider value={value}>{children}</FRAuthContext.Provider>;
}

export function useFRAuth() {
  const ctx = useContext(FRAuthContext);
  if (!ctx) throw new Error("useFRAuth must be inside FRAuthProvider");
  return ctx;
}
