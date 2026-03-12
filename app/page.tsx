import Link from "next/link";

const valueCards = [
  {
    title: "Upload once",
    body: "Turn PDFs into structured course drafts without rebuilding the content manually."
  },
  {
    title: "Review faster",
    body: "Inspect extracted source material, generated outlines, and lesson flow before publishing."
  },
  {
    title: "Teach better",
    body: "Transform dense documents into lessons, checks, and summaries that are easier to learn from."
  },
  {
    title: "Integrate later",
    body: "Build once on a stable API so the same engine can power future LMS and workflow integrations."
  }
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] bg-stone-900 p-8 text-stone-100 shadow-[0_28px_120px_-55px_rgba(15,23,42,0.8)]">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">AI Course Generation</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight">
            Transform static PDFs into polished LMS-style learning experiences.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300">
            Upload training documents, generate a course outline, and turn source material into lessons that feel
            purposeful, modern, and ready for review.
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
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Why teams use this</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">From source document to learner-ready flow</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-stone-700">
            <li>Extract the structure hidden inside long manuals, SOPs, and training PDFs.</li>
            <li>Turn dense material into modules, lessons, checks, and key takeaways.</li>
            <li>Keep the generated course grounded in the original source material.</li>
            <li>Create a cleaner review path before publishing into a larger learning stack.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {valueCards.map((card) => (
          <article key={card.title} className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-700">{card.title}</p>
            <p className="mt-3 font-serif text-2xl text-stone-900">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">How it works</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">Upload, extract, shape, review</h2>
          <p className="mt-4 text-sm leading-6 text-stone-700">
            Start by uploading a PDF and defining the course settings. EasyLMS extracts the source material, surfaces
            the important sections, and prepares it for outline and lesson generation.
          </p>
        </article>

        <article className="rounded-[2rem] bg-amber-100 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-800">What you can explore</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">Create a project and review the draft flow</h2>
          <p className="mt-4 text-sm leading-6 text-stone-700">
            Use the project workspace to upload a PDF, inspect extracted source chunks, and generate an outline based
            on the uploaded content.
          </p>
        </article>
      </section>
    </div>
  );
}
