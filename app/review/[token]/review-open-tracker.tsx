"use client";

import { useEffect } from "react";

import { trackReviewOpen } from "@/app/actions/client-review";

export function ReviewOpenTracker({ token }: { token: string }) {
  useEffect(() => {
    const key = `worklit-review-open:${token}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void trackReviewOpen(token);
  }, [token]);

  return null;
}
