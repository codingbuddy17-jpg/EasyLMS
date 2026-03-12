import { mockOutline } from "@/lib/mock-data";

export function OutlinePreview() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-stone-900 px-6 py-8 text-stone-100 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.75)]">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Generated outline</p>
        <h1 className="mt-3 font-serif text-4xl">{mockOutline.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-300">{mockOutline.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-200">
          <span className="rounded-full bg-white/10 px-4 py-2">{mockOutline.audience}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">{mockOutline.totalMinutes} minutes</span>
          <span className="rounded-full bg-white/10 px-4 py-2">{mockOutline.modules.length} modules</span>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Learning objectives</p>
          <ul className="mt-4 space-y-4 text-sm leading-6 text-stone-700">
            {mockOutline.objectives.map((objective) => (
              <li key={objective} className="rounded-2xl bg-stone-50 p-4">
                {objective}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {mockOutline.modules.map((module, index) => (
            <article key={module.id} className="rounded-[2rem] border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-amber-700">Module {index + 1}</p>
                  <h2 className="mt-2 font-serif text-3xl text-stone-900">{module.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{module.summary}</p>
                </div>
                <span className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
                  {module.estimatedMinutes} min
                </span>
              </div>

              <div className="mt-6 grid gap-3">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-[1.5rem] bg-stone-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-medium text-stone-900">{lesson.title}</h3>
                      <span className="rounded-full border border-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-600">
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
      </section>
    </div>
  );
}

