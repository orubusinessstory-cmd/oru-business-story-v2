"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1000);
    const removeTimer = setTimeout(() => setVisible(false), 1450);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash ${fading ? "splash-fading" : ""}`}>
      <img src="/logo-mark.png" alt="" className="splash-logo" />
      <div className="splash-text">
        <span className="splash-oru">Oru</span>
        <span className="splash-sub">BUSINESS STORY</span>
      </div>
    </div>
  );
}
