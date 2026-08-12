"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FAVORITES_EVENT, mergeLocalFavoritesIntoAccount } from "@/lib/favorites";

export default function AuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
        window.dispatchEvent(new Event(FAVORITES_EVENT));
        onSuccess?.();
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        await mergeLocalFavoritesIntoAccount(data.user.id);
        window.dispatchEvent(new Event(FAVORITES_EVENT));
        onSuccess?.();
      }
    }
    setBusy(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className="profile-btn-primary" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
          {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setMessage(null);
        }}
        className="auth-toggle"
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </>
  );
}
