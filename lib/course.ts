import { randomUUID } from "node:crypto";
import { getProject, updateProject } from "@/lib/project-store";
import type { ContentBlock, GeneratedCourse } from "@/lib/types";

export async function generateProjectCourse(projectId: string) {
  const project = await getProject(projectId);
  const document = project.documents[0];

  if (!project.outline) {
    throw new Error("Generate an outline before creating the course preview.");
  }

  if (!document || document.chunks.length === 0) {
    throw new Error("Run extraction before creating the course preview.");
  }

  const course = buildCourse(project.outline, document.chunks);
  const generatedAt = new Date().toISOString();

  const updatedProject = await updateProject(projectId, (current) => ({
    ...current,
    course,
    courseGeneratedAt: generatedAt
  }));

  return {
    course,
    project: updatedProject
  };
}

function buildCourse(
  outline: NonNullable<Awaited<ReturnType<typeof getProject>>["outline"]>,
  chunks: Array<{ id: string; documentId: string; pageNumber: number; content: string; excerpt: string; sectionTitle: string | null }>
): GeneratedCourse {
  return {
    title: outline.title,
    description: outline.subtitle,
    audience: outline.audience,
    durationMinutes: outline.totalMinutes,
    objectives: outline.objectives,
    modules: outline.modules.map((module, moduleIndex) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      lessons: module.lessons.map((lesson, lessonIndex) => {
        const sourceChunk = chunks[(moduleIndex * 3 + lessonIndex) % chunks.length];
        const contentBlocks = buildLessonBlocks(module.title, lesson.title, lesson.promise, sourceChunk);

        return {
          id: lesson.id || randomUUID(),
          title: lesson.title,
          durationMinutes: Math.max(4, Math.round(module.estimatedMinutes / Math.max(module.lessons.length, 1))),
          contentBlocks,
          sourceRefs: [
            {
              documentId: sourceChunk.documentId,
              pageNumber: sourceChunk.pageNumber,
              sectionTitle: sourceChunk.sectionTitle,
              excerpt: trimSentence(sourceChunk.excerpt)
            }
          ]
        };
      })
    }))
  };
}

function buildLessonBlocks(moduleTitle: string, lessonTitle: string, promise: string, sourceChunk: { content: string; excerpt: string; sectionTitle: string | null }) {
  const paragraphs = sourceChunk.content
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2);

  const bulletSeed = sourceChunk.content
    .replace(/\s+/g, " ")
    .split(/[.;:]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 20)
    .slice(0, 3);

  const contentBlocks: ContentBlock[] = [
    {
      type: "hero",
      eyebrow: moduleTitle,
      title: lessonTitle,
      body: promise
    },
    {
      type: "richText",
      title: "What this lesson covers",
      paragraphs: paragraphs.length > 0 ? paragraphs : [sourceChunk.excerpt]
    },
    {
      type: "keyPoints",
      title: "Key points",
      items:
        bulletSeed.length > 0
          ? bulletSeed.map((item) => trimSentence(item))
          : ["Identify the main idea in the source material.", "Connect the lesson to a concrete example.", "Review what action or concept matters most."]
    },
    {
      type: "exampleCard",
      title: sourceChunk.sectionTitle || "In context",
      body: trimSentence(sourceChunk.excerpt)
    },
    {
      type: "quiz",
      title: "Quick check",
      question: `What is the strongest summary of "${lessonTitle}"?`,
      options: [
        trimSentence(sourceChunk.excerpt),
        "It focuses mostly on formatting choices.",
        "It removes the need for source review.",
        "It is unrelated to the original document."
      ],
      answerIndex: 0,
      explanation: "The strongest answer stays closest to the uploaded source material and the lesson promise."
    },
    {
      type: "summaryCard",
      title: "Takeaways",
      items: [
        trimSentence(promise),
        trimSentence(sourceChunk.excerpt),
        "Use this lesson as a draft that can be refined before publishing."
      ]
    }
  ];

  return contentBlocks;
}

function trimSentence(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 140).replace(/[,:;\-–—\s]+$/, "");
}
