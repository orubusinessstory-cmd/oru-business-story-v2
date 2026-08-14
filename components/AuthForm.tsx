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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function handleForgotPassword() {
    if (!email) {
      setMessage("Enter your email above first, then tap Forgot password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setMessage(error ? error.message : "Password reset email sent — check your inbox.");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-input-wrap">
          <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z"/>
            <path d="m3.5 6 8.5 6.5L20.5 6"/>
          </svg>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-wrap">
          <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="9" rx="2"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Toggle password"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9-4-10-7 .6-1.9 1.9-3.9 3.7-5.4"/>
                <path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c5 0 9 4 10 7-.36 1.15-1 2.35-1.9 3.44"/>
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                <line x1="2" y1="2" x2="22" y2="22"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        {mode === "signin" && (
          <div className="auth-row">
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="auth-forgot" onClick={handleForgotPassword}>
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          className="profile-btn-primary auth-submit-btn"
          disabled={busy}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="auth-divider"><span>OR</span></div>

      <button type="button" className="auth-google-btn" onClick={handleGoogleSignIn}>
        <svg viewBox="0 0 48 48" width="18" height="18">
          <path fill="#FFC107" d="M43.6 20.5h-1.9V20.4H24v7.2h11.3c-1.6 4.6-6 7.9-11.3 7.9-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.6 6.1 29 4.4 24 4.4 12.9 4.4 4 13.3 4 24.4s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
          <path fill="#FF3D00" d="m6.3 14.7 5.9 4.3C13.9 15.3 18.5 12.4 24 12.4c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.6 6.1 29 4.4 24 4.4c-7.7 0-14.3 4.4-17.7 10.3z"/>
          <path fill="#4CAF50" d="M24 44.4c4.9 0 9.4-1.9 12.8-4.9l-5.9-5c-1.9 1.4-4.4 2.3-7 2.3-5.3 0-9.7-3.3-11.3-7.9l-6 4.6c3.3 6.6 10 11 17.4 11z"/>
          <path fill="#1976D2" d="M43.6 20.5h-1.9V20.4H24v7.2h11.3c-.8 2.3-2.2 4.3-4.1 5.7l5.9 5c-.4.4 6.3-4.6 6.3-14.9 0-1.3-.1-2.6-.4-3.9z"/>
        </svg>
        Continue with Google
      </button>

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
