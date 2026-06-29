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
    <div className="w-full min-h-screen bg-transparent flex items-center justify-center md:bg-black/50">
      <div className="w-full h-screen md:max-w-[420px] md:h-[380px] md:rounded-xl md:shadow-2xl overflow-hidden md:border border-neutral-700">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500 text-sm">Loading...</div>}>
          <EmbedContent />
        </Suspense>
      </div>
    </div>
  );
}
