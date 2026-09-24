"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    setForgotLoading(false);
    setForgotMessage(
      error ? error.message : "Password reset link അയച്ചു — email inbox (spam-ഉം) നോക്കുക."
    );
  }

  if (forgotMode) {
    return (
      <div className="admin-login-wrap">
        <form className="admin-login-card" onSubmit={handleForgotPassword}>
          <h1>Oru Business Story</h1>
          <p className="admin-login-sub">Reset password</p>

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {forgotMessage && <p className="admin-hint">{forgotMessage}</p>}

          <button type="submit" disabled={forgotLoading} className="admin-btn-primary">
            {forgotLoading ? "Sending..." : "Send reset link"}
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            style={{ marginTop: 10 }}
            onClick={() => {
              setForgotMode(false);
              setForgotMessage("");
            }}
          >
            ← Back to sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>Oru Business Story</h1>
        <p className="admin-login-sub">Admin sign in</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" disabled={loading} className="admin-btn-primary">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button
          type="button"
          className="admin-forgot-link"
          onClick={() => {
            setForgotMode(true);
            setError("");
          }}
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}
