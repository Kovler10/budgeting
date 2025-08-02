"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    workbox?: any;
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered: ", registration);
        })
        .catch((registrationError) => {
          console.log(
            "Service Worker registration failed: ",
            registrationError
          );
        });
    }
  }, []);

  return null;
}
