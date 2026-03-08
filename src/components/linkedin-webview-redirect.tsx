"use client";

import { useEffect } from "react";

export function LinkedInWebviewRedirect() {
  useEffect(() => {
    const ua = navigator.userAgent || "";

    if (!ua.includes("LinkedInApp")) {
      return;
    }

    const url = new URL(window.location.href);

    if (url.searchParams.get("openExternalBrowser") === "1") {
      return;
    }

    url.searchParams.set("openExternalBrowser", "1");
    window.location.replace(url.toString());
  }, []);

  return null;
}
