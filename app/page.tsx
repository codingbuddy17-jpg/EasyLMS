import Link from "next/link";

const milestones = [
  {
    title: "Phase 1",
    body: "Scaffold the app shell, project model, and configuration flow."
  },
  {
    title: "Phase 2",
    body: "Add PDF ingestion, extraction, and structured source chunks."
  },
  {
    title: "Phase 3",
    body: "Generate and review a high-quality course outline."
  },
  {
    title: "Phase 4",
    body: "Render polished lessons with quizzes, summaries, and reusable blocks."
  }
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] bg-stone-900 p-8 text-stone-100 shadow-[0_28px_120px_-55px_rgba(15,23,42,0.8)]">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">AI course authoring</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight">
            Transform static PDFs into polished LMS-style learning experiences.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300">
            EasyLMS is being built as a PDF-to-course pipeline that prioritizes source-grounded outlines, high-quality
            lesson rendering, and an interface that feels designed rather than auto-generated.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects/new"
              className="rounded-full bg-amber-400 px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-amber-300"
            >
              Start a project
            </Link>
            <Link
              href="/demo/course"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-stone-100 transition hover:border-white/60"
            >
              See lesson preview
            </Link>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-stone-200 bg-white/80 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Current emphasis</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">Build the strongest first path</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-stone-700">
            <li>PDF-first workflow to keep scope controlled.</li>
            <li>Generic product posture with healthcare-friendly examples.</li>
            <li>Great outline generation before full export complexity.</li>
            <li>Polished learner-facing lesson rendering as a core differentiator.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {milestones.map((milestone) => (
          <article key={milestone.title} className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-700">{milestone.title}</p>
            <p className="mt-3 font-serif text-2xl text-stone-900">{milestone.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">In the repo now</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">Blueprint before complexity</h2>
          <p className="mt-4 text-sm leading-6 text-stone-700">
            The repository includes the product blueprint, phase tracker, Prisma draft schema, typed mock data, and
            the first app routes for project setup, outline review, and lesson preview.
          </p>
        </article>

        <article className="rounded-[2rem] bg-amber-100 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-800">Next implementation step</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">Wire persistence and upload</h2>
          <p className="mt-4 text-sm leading-6 text-stone-700">
            Once dependencies are installed, we can connect Prisma, create the project record flow, and add the real
            PDF upload endpoint without reworking the current UI.
          </p>
        </article>
      </section>
    </div>
  );
}

