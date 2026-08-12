"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "./AuthForm";

export default function AuthPanel() {
  const [user, setUser] = useState<{ email?: string } | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (user === undefined) return null;

  return (
    <div className="profile-section">
      <p className="profile-section-title">Account</p>
      {user ? (
        <button type="button" onClick={() => supabase.auth.signOut()} className="profile-link-row profile-link-btn">
          <span>🚪 Log out</span>
          <span className="profile-chevron">›</span>
        </button>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}
