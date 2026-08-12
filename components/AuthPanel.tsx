"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FAVORITES_EVENT, mergeLocalFavoritesIntoAccount } from "@/lib/favorites";

export default function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [user, setUser] = useState<{ email?: string } | null | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user && !data.session) {
        setMessage("Check your email to confirm your account, then sign in.");
      } else if (data.user) {
        await mergeLocalFavoritesIntoAccount(data.user.id);
        setMessage("Account created — your favorites are now synced.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        await mergeLocalFavoritesIntoAccount(data.user.id);
        window.dispatchEvent(new Event(FAVORITES_EVENT));
      }
    }
    setBusy(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMessage(null);
  }

  if (user === undefined) return null;

  if (user) {
    return (
      <div className="profile-section">
        <p className="profile-section-title">Account</p>
        <div className="profile-link-row">
          <span>✅ Signed in as {user.email}</span>
        </div>
        <button type="button" onClick={handleSignOut} className="profile-link-row profile-link-btn">
          <span>🚪 Sign out</span>
          <span className="profile-chevron">›</span>
        </button>
        <p className="admin-hint" style={{ padding: "0 4px" }}>
          Your favorites are synced to this account and will follow you across devices.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <p className="profile-section-title">Account (optional)</p>
      <p className="admin-hint" style={{ padding: "0 4px", marginBottom: 10 }}>
        Sign in to sync your favorites across devices. You can keep browsing and saving favorites
        without an account too — they'll just stay on this device only.
      </p>
      <form onSubmit={handleSubmit} className="admin-form" style={{ gap: 8 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className="admin-btn-primary" disabled={busy}>
          {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
      {message && <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 8 }}>{message}</p>}
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setMessage(null);
        }}
        style={{ background: "none", border: "none", color: "var(--blue-600)", fontSize: 12.5, fontWeight: 700, marginTop: 10, padding: 4 }}
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
