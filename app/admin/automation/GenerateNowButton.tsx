"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export default function GenerateNowButton() {
  const { pending } = useFormStatus();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!pending) {
      setSeconds(0);
      return;
    }
    setSeconds(0);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [pending]);

  return (
    <button type="submit" className="admin-btn-secondary" disabled={pending}>
      {pending ? (
        <span className="automation-running">
          <span className="automation-spinner" />
          Running... {seconds}s
        </span>
      ) : (
        "Generate Now (test)"
      )}
    </button>
  );
}
