"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push("/dashboard");
  }, [router]);

  return null;
}
