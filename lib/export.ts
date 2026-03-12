import type { GeneratedCourse } from "@/lib/types";

export function renderCourseHtml(course: GeneratedCourse) {
  const currentModule = course.modules[0];
  const currentLesson = currentModule?.lessons[0];

  const lessonBlocks = currentLesson
    ? currentLesson.contentBlocks
        .map((block) => {
          switch (block.type) {
            case "hero":
              return `<section class="hero"><p class="eyebrow">${escapeHtml(block.eyebrow)}</p><h2>${escapeHtml(block.title)}</h2><p>${escapeHtml(block.body)}</p></section>`;
            case "richText":
              return `<section class="card"><h3>${escapeHtml(block.title)}</h3>${block.paragraphs
                .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
                .join("")}</section>`;
            case "keyPoints":
              return `<section class="card accent"><h3>${escapeHtml(block.title)}</h3><ul>${block.items
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}</ul></section>`;
            case "exampleCard":
            case "warningCard":
              return `<section class="card"><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.body)}</p></section>`;
            case "quiz":
              return `<section class="card"><h3>${escapeHtml(block.question)}</h3><ol>${block.options
                .map((option) => `<li>${escapeHtml(option)}</li>`)
                .join("")}</ol><p class="note">${escapeHtml(block.explanation)}</p></section>`;
            case "summaryCard":
              return `<section class="card dark"><h3>${escapeHtml(block.title)}</h3><ul>${block.items
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}</ul></section>`;
          }
        })
        .join("")
    : "<p>No lesson content generated yet.</p>";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(course.title)}</title>
    <style>
      :root { color-scheme: light; }
      body { margin: 0; font-family: Georgia, serif; background: #f5f5f4; color: #1c1917; }
      .shell { max-width: 1200px; margin: 0 auto; padding: 32px 24px 64px; }
      .hero-wrap { display: grid; gap: 24px; grid-template-columns: 280px 1fr; }
      .sidebar { background: #1c1917; color: #f5f5f4; border-radius: 24px; padding: 24px; }
      .sidebar h1 { margin: 12px 0 0; font-size: 32px; }
      .sidebar .chip { display: inline-block; margin: 8px 8px 0 0; padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,.08); font-size: 14px; }
      .content { background: white; border-radius: 24px; padding: 24px; box-shadow: 0 20px 80px -45px rgba(15,23,42,.45); }
      .hero { border-radius: 24px; padding: 24px; background: linear-gradient(135deg, #1c1917, #44403c); color: #f5f5f4; }
      .eyebrow { text-transform: uppercase; letter-spacing: .2em; font-size: 12px; color: #fbbf24; }
      .card { margin-top: 16px; border-radius: 20px; padding: 20px; background: #fafaf9; border: 1px solid #e7e5e4; }
      .card.accent { background: #fffbeb; border-color: #fde68a; }
      .card.dark { background: #1c1917; color: #f5f5f4; }
      .card h3 { margin-top: 0; }
      .note { color: #57534e; }
      ul, ol { padding-left: 20px; }
      @media (max-width: 900px) { .hero-wrap { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main class="shell">
      <div class="hero-wrap">
        <aside class="sidebar">
          <p class="eyebrow">EasyLMS Export</p>
          <h1>${escapeHtml(course.title)}</h1>
          <p>${escapeHtml(course.description)}</p>
          <span class="chip">${escapeHtml(course.audience)}</span>
          <span class="chip">${course.durationMinutes} minutes</span>
          <span class="chip">${course.modules.length} modules</span>
        </aside>
        <section class="content">
          <p class="eyebrow">${escapeHtml(currentModule?.title ?? "Course Preview")}</p>
          <h2>${escapeHtml(currentLesson?.title ?? "Generated lesson")}</h2>
          <p>${escapeHtml(currentModule?.summary ?? "A generated lesson preview based on the uploaded source material.")}</p>
          ${lessonBlocks}
        </section>
      </div>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
