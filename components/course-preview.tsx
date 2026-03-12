import { mockCourse } from "@/lib/mock-data";
import type { ContentBlock } from "@/lib/types";

export function CoursePreview() {
  const courseModule = mockCourse.modules[0];
  const lesson = courseModule.lessons[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-[2rem] bg-stone-900 p-6 text-stone-100">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Course preview</p>
        <h1 className="mt-3 font-serif text-3xl">{mockCourse.title}</h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">{mockCourse.description}</p>

        <div className="mt-8 space-y-4">
          <div className="rounded-[1.5rem] bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-300">Audience</p>
            <p className="mt-2 text-sm">{mockCourse.audience}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-300">Objectives</p>
            <ul className="mt-3 space-y-2 text-sm text-stone-200">
              {mockCourse.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]">
        <div className="border-b border-stone-200 pb-5">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-700">{courseModule.title}</p>
          <h2 className="mt-2 font-serif text-4xl text-stone-900">{lesson.title}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">{courseModule.summary}</p>
        </div>

        <div className="mt-6 space-y-4">
          {lesson.contentBlocks.map((block, index) => (
            <BlockRenderer key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "hero":
      return (
        <article className="rounded-[1.75rem] bg-[linear-gradient(135deg,#1c1917,#44403c)] p-6 text-stone-100">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300">{block.eyebrow}</p>
          <h3 className="mt-3 font-serif text-3xl">{block.title}</h3>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-300">{block.body}</p>
        </article>
      );
    case "richText":
      return (
        <article className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
          <h3 className="font-serif text-2xl text-stone-900">{block.title}</h3>
          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700">
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      );
    case "keyPoints":
      return (
        <article className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
          <h3 className="font-serif text-2xl text-stone-900">{block.title}</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
            {block.items.map((item) => (
              <li key={item} className="rounded-2xl bg-white/80 p-4">
                {item}
              </li>
            ))}
          </ul>
        </article>
      );
    case "exampleCard":
      return (
        <article className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="font-serif text-2xl text-stone-900">{block.title}</h3>
          <p className="mt-4 text-sm leading-6 text-stone-700">{block.body}</p>
        </article>
      );
    case "warningCard":
      return (
        <article className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6">
          <h3 className="font-serif text-2xl text-stone-900">{block.title}</h3>
          <p className="mt-4 text-sm leading-6 text-stone-700">{block.body}</p>
        </article>
      );
    case "quiz":
      return (
        <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-700">{block.title}</p>
          <h3 className="mt-3 font-serif text-2xl text-stone-900">{block.question}</h3>
          <div className="mt-4 grid gap-3">
            {block.options.map((option, index) => (
              <div
                key={option}
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  index === block.answerIndex
                    ? "border-emerald-400 bg-emerald-50 text-stone-900"
                    : "border-stone-200 bg-stone-50 text-stone-700"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">{block.explanation}</p>
        </article>
      );
    case "summaryCard":
      return (
        <article className="rounded-[1.75rem] bg-stone-900 p-6 text-stone-100">
          <h3 className="font-serif text-2xl">{block.title}</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-300">
            {block.items.map((item) => (
              <li key={item} className="rounded-2xl bg-white/10 p-4">
                {item}
              </li>
            ))}
          </ul>
        </article>
      );
  }
}
