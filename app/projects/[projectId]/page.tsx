import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/project-store";
import { ExtractionPanel } from "@/components/extraction-panel";
import { OutlinePanel } from "@/components/outline-panel";
import { CoursePanel } from "@/components/course-panel";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;

  try {
    const project = await getProject(projectId);

    return (
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-stone-900 p-8 text-stone-100 shadow-[0_28px_120px_-55px_rgba(15,23,42,0.8)]">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Course Workspace</p>
          <h1 className="mt-3 font-serif text-5xl">{project.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
            This workspace keeps your uploaded source, extracted content, and draft outline in one place so you can
            shape the course before moving into lesson generation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-200">
            <span className="rounded-full bg-white/10 px-4 py-2">{project.config.audience}</span>
            <span className="rounded-full bg-white/10 px-4 py-2">{project.config.mode} mode</span>
            <span className="rounded-full bg-white/10 px-4 py-2">{project.documents.length} document</span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Configuration</p>
            <dl className="mt-5 grid gap-4 text-sm text-stone-700">
              <Detail label="Audience" value={project.config.audience} />
              <Detail label="Difficulty" value={project.config.difficulty} />
              <Detail label="Tone" value={project.config.tone} />
              <Detail label="Duration" value={project.config.duration} />
              <Detail label="Output style" value={project.config.outputStyle} />
              <Detail label="Quiz density" value={project.config.quizDensity} />
              <Detail label="Mode" value={project.config.mode} />
            </dl>
          </article>

          <article className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Source Document</p>
            {project.documents.map((document) => (
              <div key={document.id} className="mt-5 rounded-[1.5rem] bg-stone-50 p-5">
                <h2 className="font-serif text-2xl text-stone-900">{document.fileName}</h2>
                <p className="mt-2 text-sm text-stone-600">Type: {document.fileType}</p>
                <p className="mt-1 text-sm text-stone-600">
                  Size: {Math.max(1, Math.round(document.fileSize / 1024))} KB
                </p>
                <p className="mt-1 text-sm text-stone-600">Extraction status: {document.extractionStatus}</p>
                <p className="mt-1 text-sm text-stone-600">Chunks: {document.chunks.length}</p>
                <p className="mt-1 text-sm text-stone-600">Stored at: data/uploads/{document.relativePath}</p>
              </div>
            ))}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/projects/new"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-amber-300"
              >
                Create another project
              </Link>
              <Link
                href="/demo/course"
                className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
              >
                View visual course demo
              </Link>
            </div>
          </article>
        </section>

        <ExtractionPanel
          projectId={project.id}
          documentId={project.documents[0]?.id ?? ""}
          extractionStatus={project.documents[0]?.extractionStatus ?? "pending"}
          chunkCount={project.documents[0]?.chunks.length ?? 0}
          pageCount={project.documents[0]?.pageCount}
          extractionError={project.documents[0]?.extractionError}
        />

        {project.documents[0]?.chunks.length ? (
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Extracted Content</p>
                <h2 className="mt-2 font-serif text-3xl text-stone-900">Structured source material</h2>
              </div>
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-900">
                {project.documents[0].chunks.length} chunks
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {project.documents[0].chunks.slice(0, 8).map((chunk) => (
                <article key={chunk.id} className="rounded-[1.5rem] bg-stone-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium text-stone-900">
                      Page {chunk.pageNumber}
                      {chunk.sectionTitle ? ` • ${chunk.sectionTitle}` : ""}
                    </h3>
                    <span className="rounded-full border border-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-600">
                      {chunk.wordCount} words
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-700">{chunk.excerpt}...</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {project.documents[0]?.chunks.length ? <OutlinePanel projectId={project.id} outline={project.outline} /> : null}
        {project.outline ? <CoursePanel projectId={project.id} course={project.course} /> : null}
      </div>
    );
  } catch {
    notFound();
  }
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className="font-medium text-stone-900">{value}</dd>
    </div>
  );
}
