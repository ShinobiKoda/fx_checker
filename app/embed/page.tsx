"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EmbedWidget from "@/components/converter/EmbedWidget";

function EmbedContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "USD";
  const to = searchParams.get("to") || "EUR";
  const amount = searchParams.get("amount") || "1000";

  return <EmbedWidget initialFrom={from} initialTo={to} initialAmount={amount} />;
}

export default function EmbedPage() {
  return (
    <div className="w-full h-screen overflow-hidden bg-transparent">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">Loading...</div>}>
        <EmbedContent />
      </Suspense>
    </div>
  );
}
