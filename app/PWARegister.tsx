"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    __pwaRegistered?: boolean;
  }
}

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (window.__pwaRegistered) return;
      window.__pwaRegistered = true;
      navigator.serviceWorker
        .register("/sw.js")
        .then(reg => {
          console.log("[PWA] Service worker registered:", reg);
        })
        .catch(err => {
          console.log("[PWA] Service worker registration failed:", err);
        });
    }
  }, []);
  return null;
}
