"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    // Clicking the recovery-email link creates a session in this browser
    // (that's what "logs you straight in" — this page's job is to require a
    // new password before letting that session do anything else useful).
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

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
    setDone(true);
    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 1500);
  }

  if (checking) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <p className="admin-login-sub">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <h1>Oru Business Story</h1>
          <p className="admin-error" style={{ textAlign: "center" }}>
            ഈ link expire ആയി, അല്ലെങ്കിൽ ശരിയല്ല. Login page-ൽ നിന്ന് "Forgot password?" വീണ്ടും try
            ചെയ്യുക.
          </p>
          <a href="/admin/login" className="admin-btn-primary" style={{ textAlign: "center", textDecoration: "none" }}>
            ← Login page-ലേക്ക്
          </a>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <h1>Oru Business Story</h1>
          <p className="admin-login-sub">Password മാറ്റി! Admin panel-ലേക്ക് പോകുന്നു...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>Oru Business Story</h1>
        <p className="admin-login-sub">പുതിയ password സെറ്റ് ചെയ്യുക</p>

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

        <button type="submit" disabled={loading} className="admin-btn-primary">
          {loading ? "Saving..." : "Password സേവ് ചെയ്യുക"}
        </button>
      </form>
    </div>
  );
}
