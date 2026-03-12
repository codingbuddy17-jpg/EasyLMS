"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ExtractionStatus } from "@/lib/project-store";

type ExtractionPanelProps = {
  projectId: string;
  documentId: string;
  extractionStatus: ExtractionStatus;
  chunkCount: number;
  pageCount?: number;
  extractionError?: string;
};

export function ExtractionPanel({
  projectId,
  documentId,
  extractionStatus,
  chunkCount,
  pageCount,
  extractionError
}: ExtractionPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(extractionError ?? null);

  function runExtraction() {
    setMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      const response = await fetch(`/api/v1/projects/${projectId}/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ documentId })
      });

      const payload = (await response.json()) as {
        error?: string;
        data?: {
          pageCount: number;
          chunkCount: number;
          totalWords: number;
        };
      };

      if (!response.ok || !payload.data) {
        setErrorMessage(payload.error ?? "Extraction failed.");
        return;
      }

      setMessage(
        `Extracted ${payload.data.chunkCount} chunks across ${payload.data.pageCount} pages (${payload.data.totalWords} words).`
      );
      router.refresh();
    });
  }

  const statusLabel =
    extractionStatus === "complete"
      ? "Extracted"
      : extractionStatus === "processing"
        ? "Processing"
        : extractionStatus === "failed"
          ? "Failed"
          : "Not started";

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Source Extraction</p>
          <h2 className="mt-2 font-serif text-3xl text-stone-900">{statusLabel}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Extract the uploaded PDF into structured source chunks so the course outline can follow the actual document.
          </p>
        </div>
        <button
          type="button"
          onClick={runExtraction}
          disabled={isPending}
          className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {isPending ? "Extracting..." : chunkCount > 0 ? "Re-run extraction" : "Run extraction"}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-stone-100 px-4 py-2 text-stone-700">{chunkCount} chunks</span>
        <span className="rounded-full bg-stone-100 px-4 py-2 text-stone-700">{pageCount ?? 0} pages</span>
        <span className="rounded-full bg-stone-100 px-4 py-2 text-stone-700">{statusLabel}</span>
      </div>

      {message ? (
        <div className="mt-5 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
