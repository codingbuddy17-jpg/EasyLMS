"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GeneratedCourse } from "@/lib/types";
import { BlockRenderer } from "@/components/course-preview";

type CoursePanelProps = {
  projectId: string;
  course?: GeneratedCourse;
};

export function CoursePanel({ projectId, course }: CoursePanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  useEffect(() => {
    setSelectedModuleIndex(0);
    setSelectedLessonIndex(0);
  }, [course?.title, course?.modules.length]);

  function handleGenerate() {
    setErrorMessage(null);

    startTransition(async () => {
      const response = await fetch(`/api/v1/projects/${projectId}/course`, {
        method: "POST"
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(payload.error ?? "Course generation failed.");
        return;
      }

      router.refresh();
    });
  }

  const courseModule = course?.modules[selectedModuleIndex];
  const lesson = courseModule?.lessons[selectedLessonIndex];

  function selectLesson(moduleIndex: number, lessonIndex: number) {
    setSelectedModuleIndex(moduleIndex);
    setSelectedLessonIndex(lessonIndex);
  }

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Lesson Preview</p>
          <h2 className="mt-2 font-serif text-3xl text-stone-900">
            {course ? course.title : "Generate a draft lesson experience"}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
            Create a first learner-facing lesson flow from the generated outline and extracted PDF content.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isPending}
          className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {isPending ? "Generating..." : course ? "Regenerate lesson preview" : "Generate lesson preview"}
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {course && courseModule && lesson ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[2rem] bg-stone-900 p-6 text-stone-100">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Course Summary</p>
            <h3 className="mt-3 font-serif text-3xl">{course.title}</h3>
            <p className="mt-4 text-sm leading-6 text-stone-300">{course.description}</p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.5rem] bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-300">Audience</p>
                <p className="mt-2 text-sm">{course.audience}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-300">Objectives</p>
                <ul className="mt-3 space-y-2 text-sm text-stone-200">
                  {course.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-300">Modules</p>
                <div className="mt-3 space-y-3">
                  {course.modules.map((moduleItem, moduleIndex) => (
                    <div key={moduleItem.id} className="rounded-2xl bg-white/5 p-3">
                      <button
                        type="button"
                        onClick={() => selectLesson(moduleIndex, 0)}
                        className={`w-full text-left text-sm ${
                          moduleIndex === selectedModuleIndex ? "text-white" : "text-stone-300"
                        }`}
                      >
                        {moduleItem.title}
                      </button>
                      <div className="mt-3 space-y-2">
                        {moduleItem.lessons.map((lessonItem, lessonIndex) => {
                          const isActive = moduleIndex === selectedModuleIndex && lessonIndex === selectedLessonIndex;

                          return (
                            <button
                              key={lessonItem.id}
                              type="button"
                              onClick={() => selectLesson(moduleIndex, lessonIndex)}
                              className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                                isActive
                                  ? "bg-amber-300 text-stone-950"
                                  : "bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {lessonItem.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]">
            <div className="border-b border-stone-200 pb-5">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-700">{courseModule.title}</p>
              <h3 className="mt-2 font-serif text-4xl text-stone-900">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{courseModule.summary}</p>
            </div>

            <div className="mt-6 space-y-4">
              {lesson.contentBlocks.map((block, index) => (
                <BlockRenderer key={`${block.type}-${index}`} block={block} />
              ))}
            </div>

            {lesson.sourceRefs.length > 0 ? (
              <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Source references</p>
                <div className="mt-4 space-y-3">
                  {lesson.sourceRefs.map((ref, index) => (
                    <div key={`${ref.documentId}-${ref.pageNumber}-${index}`} className="rounded-2xl bg-white p-4">
                      <p className="text-sm font-medium text-stone-900">
                        Page {ref.pageNumber}
                        {ref.sectionTitle ? ` • ${ref.sectionTitle}` : ""}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">{ref.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 border-t border-stone-200 pt-5">
              <a
                href={`/api/v1/projects/${projectId}/course`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-stone-700 underline-offset-4 hover:text-stone-900 hover:underline"
              >
                Open generated course JSON
              </a>
              <a
                href={`/api/v1/projects/${projectId}/export?format=html`}
                target="_blank"
                rel="noreferrer"
                className="ml-5 text-sm font-medium text-stone-700 underline-offset-4 hover:text-stone-900 hover:underline"
              >
                Open HTML export
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
