"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password കുറഞ്ഞത് 6 അക്ഷരമെങ്കിലും വേണം.");
      return;
    }
    if (password !== confirmPassword) {
      setError("രണ്ട് password-ഉം ഒരുപോലെ അല്ല.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Password മാറ്റി!");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <h1>Account</h1>
      <p className="admin-sub">Admin login password മാറ്റാൻ.</p>

      <div className="admin-card" style={{ maxWidth: 420 }}>
        <h3 style={{ marginTop: 0 }}>Change Password</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>പുതിയ Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <label>Password ഒന്നുകൂടി ടൈപ്പ് ചെയ്യുക</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          {error && <p className="admin-error">{error}</p>}
          {message && <p className="admin-hint">{message}</p>}

          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? "Saving..." : "Password മാറ്റുക"}
          </button>
        </form>
      </div>
    </>
  );
}
