"use client";

import { useEffect } from "react";

/**
 * Suppresses the harmless browser AbortError that fires when a <video> element
 * is removed from the DOM while its play() promise is still pending.
 *
 * This is a known browser behavior (https://goo.gl/LdLk22) and cannot be
 * prevented at the component level when third-party libraries (e.g. html5-qrcode)
 * create and manage their own video elements internally.
 */
export default function MediaErrorSuppressor() {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      if (
        error instanceof DOMException &&
        error.name === "AbortError" &&
        error.message?.includes("removed from the document")
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);

  return null;
}
