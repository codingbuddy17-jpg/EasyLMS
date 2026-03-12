"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CourseOutline } from "@/lib/types";

type OutlinePanelProps = {
  projectId: string;
  outline?: CourseOutline;
};

export function OutlinePanel({ projectId, outline }: OutlinePanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleGenerate() {
    setErrorMessage(null);

    startTransition(async () => {
      const response = await fetch(`/api/v1/projects/${projectId}/outline`, {
        method: "POST"
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(payload.error ?? "Outline generation failed.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Course Outline</p>
          <h2 className="mt-2 font-serif text-3xl text-stone-900">
            {outline ? outline.title : "Generate a source-based outline"}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
            Generate a draft module and lesson structure based on the extracted content from your uploaded PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isPending}
          className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {isPending ? "Generating..." : outline ? "Regenerate outline" : "Generate outline"}
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {outline ? (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm leading-6 text-stone-600">{outline.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-700">
              <span className="rounded-full bg-stone-100 px-4 py-2">{outline.audience}</span>
              <span className="rounded-full bg-stone-100 px-4 py-2">{outline.totalMinutes} minutes</span>
              <span className="rounded-full bg-stone-100 px-4 py-2">{outline.modules.length} modules</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[1.5rem] bg-stone-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Objectives</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
                {outline.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {outline.modules.map((module, index) => (
                <article key={module.id} className="rounded-[1.5rem] bg-stone-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-serif text-2xl text-stone-900">
                      Module {index + 1}: {module.title}
                    </h3>
                    <span className="rounded-full border border-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-600">
                      {module.estimatedMinutes} min
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{module.summary}</p>
                  <div className="mt-4 grid gap-3">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="rounded-2xl bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="font-medium text-stone-900">{lesson.title}</h4>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-900">
                            {lesson.interaction}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{lesson.promise}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
