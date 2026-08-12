"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "./AuthForm";

const SESSION_KEY = "oru-login-prompt-shown";

export default function LoginPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (typeof window === "undefined") return;
      if (window.sessionStorage.getItem(SESSION_KEY)) return;

      const { data } = await supabase.auth.getUser();
      if (!cancelled && !data.user) {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        setOpen(true);
      }
    }

    // Small delay so it appears just after the splash screen finishes
    const t = setTimeout(check, 1500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="login-prompt-overlay" onClick={() => setOpen(false)}>
      <div className="login-prompt-card" onClick={(e) => e.stopPropagation()}>
        <img src="/logo-mark.png" alt="" className="login-prompt-logo" />
        <h3>Sign in to sync favorites</h3>
        <p>Optional — save your favorite business ideas and access them on any device.</p>
        <AuthForm onSuccess={() => setOpen(false)} />
        <button type="button" className="login-prompt-skip" onClick={() => setOpen(false)}>
          Continue without signing in
        </button>
      </div>
    </div>
  );
}
