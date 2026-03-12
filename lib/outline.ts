import { randomUUID } from "node:crypto";
import { getProject, updateProject } from "@/lib/project-store";
import type { CourseOutline, OutlineLesson, OutlineModule } from "@/lib/types";

const fallbackInteractions = ["Knowledge check", "Scenario prompt", "Summary card", "Quick reflection"];
const stopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "between",
  "could",
  "every",
  "from",
  "into",
  "that",
  "their",
  "there",
  "these",
  "this",
  "those",
  "with",
  "while",
  "where",
  "when",
  "which",
  "will",
  "would",
  "your"
]);

export async function generateProjectOutline(projectId: string) {
  const project = await getProject(projectId);
  const document = project.documents[0];

  if (!document || document.chunks.length === 0) {
    throw new Error("Run extraction before generating an outline.");
  }

  const outline = buildOutline(project.title, project.config.audience, project.config.duration, document.chunks);
  const generatedAt = new Date().toISOString();

  const updatedProject = await updateProject(projectId, (current) => ({
    ...current,
    outline,
    outlineGeneratedAt: generatedAt
  }));

  return {
    outline,
    project: updatedProject
  };
}

function buildOutline(title: string, audience: string, duration: string, chunks: Array<{ sectionTitle: string | null; excerpt: string; content: string; pageNumber: number }>): CourseOutline {
  const moduleSeeds = rankChunks(chunks).slice(0, 9);
  const grouped = groupChunks(moduleSeeds);
  const modules: OutlineModule[] = grouped.map((group, index) => {
    const heading = group.find((item) => item.sectionTitle)?.sectionTitle;
    const moduleTitle = heading || deriveModuleTitle(group, index);
    const lessons: OutlineLesson[] = group.slice(0, 3).map((chunk, lessonIndex) => ({
      id: randomUUID(),
      title: chunk.sectionTitle || deriveLessonTitle(chunk.content, lessonIndex),
      promise: summarizePromise(chunk.excerpt),
      interaction: fallbackInteractions[(index + lessonIndex) % fallbackInteractions.length]
    }));

    return {
      id: randomUUID(),
      title: moduleTitle,
      summary: summarizeModule(group.map((item) => item.excerpt).join(" ")),
      estimatedMinutes: Math.max(8, Math.round(parseDuration(duration) / Math.max(grouped.length, 1))),
      lessons
    };
  });

  return {
    title: title || deriveCourseTitle(chunks),
    subtitle: buildSubtitle(chunks),
    audience: audience || "General learners",
    totalMinutes: parseDuration(duration),
    objectives: buildObjectives(chunks),
    modules
  };
}

function buildObjectives(chunks: Array<{ excerpt: string; content: string }>) {
  const samples = rankChunks(chunks).slice(0, 3).map((chunk) => chunk.excerpt);
  const focusTerms = extractKeywords(chunks).slice(0, 3);

  return [
    `Summarize the main ideas found in the source document.`,
    focusTerms.length > 0
      ? `Identify the key concepts around ${focusTerms.map((term) => term.toLowerCase()).join(", ")}.`
      : `Identify the key concepts, examples, and action points across the uploaded material.`,
    samples[0] ? `Apply the core guidance from sections like "${trimSentence(samples[0])}".` : "Apply the core guidance from the uploaded material."
  ];
}

function chunkIntoGroups<T>(items: T[], maxGroups: number) {
  if (items.length === 0) {
    return [];
  }

  const groupCount = Math.min(maxGroups, items.length);
  const groups = Array.from({ length: groupCount }, () => [] as T[]);

  items.forEach((item, index) => {
    groups[index % groupCount].push(item);
  });

  return groups.filter((group) => group.length > 0);
}

function deriveTheme(content: string, index: number) {
  const words = content
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 3);

  if (words.length > 0) {
    return words.map(capitalize).join(" ");
  }

  return `Core Topic ${index + 1}`;
}

function deriveLessonTitle(content: string, index: number) {
  const sentences = content
    .replace(/\s+/g, " ")
    .split(/[.!?]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 12);

  const phrase = trimSentence(sentences[0] ?? content);
  return phrase || `Lesson ${index + 1}`;
}

function summarizePromise(excerpt: string) {
  const sentence = trimSentence(excerpt);
  return sentence ? `Learners will understand ${lowercaseFirst(sentence)}.` : "Learners will understand the core idea from this section.";
}

function summarizeModule(text: string) {
  const sentence = trimSentence(text);
  return sentence || "Covers the main ideas surfaced from the uploaded source material.";
}

function deriveCourseTitle(chunks: Array<{ sectionTitle: string | null; content: string }>) {
  const titledChunk = chunks.find((chunk) => chunk.sectionTitle);

  if (titledChunk?.sectionTitle) {
    return `${titledChunk.sectionTitle} Course`;
  }

  const keywords = extractKeywords(chunks).slice(0, 2);

  if (keywords.length > 0) {
    return `${keywords.join(" ")} Fundamentals`;
  }

  return "Generated Course Outline";
}

function buildSubtitle(chunks: Array<{ excerpt: string }>) {
  const firstExcerpt = chunks[0]?.excerpt;
  return firstExcerpt ? trimSentence(firstExcerpt) : "A draft outline generated from extracted PDF content";
}

function rankChunks<T extends { content: string; excerpt: string; sectionTitle?: string | null }>(chunks: T[]) {
  return [...chunks]
    .filter((chunk) => chunk.content.trim().length > 80)
    .sort((left, right) => scoreChunk(right) - scoreChunk(left));
}

function scoreChunk(chunk: { content: string; excerpt: string; sectionTitle?: string | null }) {
  const headingBoost = chunk.sectionTitle ? 40 : 0;
  const lengthBoost = Math.min(chunk.content.length / 20, 35);
  const sentenceBoost = Math.min(chunk.excerpt.length / 10, 20);

  return headingBoost + lengthBoost + sentenceBoost;
}

function groupChunks<T extends { sectionTitle: string | null }>(chunks: T[]) {
  const headingGroups = new Map<string, T[]>();

  for (const chunk of chunks) {
    if (chunk.sectionTitle) {
      const existing = headingGroups.get(chunk.sectionTitle) ?? [];
      existing.push(chunk);
      headingGroups.set(chunk.sectionTitle, existing);
    }
  }

  const groupedByHeading = [...headingGroups.values()].slice(0, 3);

  if (groupedByHeading.length >= 2) {
    return groupedByHeading;
  }

  return chunkIntoGroups(chunks, 3);
}

function deriveModuleTitle(chunks: Array<{ content: string; sectionTitle: string | null }>, index: number) {
  const keywords = extractKeywords(chunks).slice(0, 3);

  if (keywords.length > 0) {
    return keywords.join(" ");
  }

  return `Module ${index + 1}: ${deriveTheme(chunks[0]?.content ?? "", index)}`;
}

function extractKeywords(chunks: Array<{ content: string }>) {
  const counts = new Map<string, number>();

  for (const chunk of chunks) {
    for (const word of chunk.content.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)) {
      if (word.length < 5 || stopWords.has(word)) {
        continue;
      }

      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([word]) => capitalize(word));
}

function trimSentence(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 110).replace(/[,:;\-–—\s]+$/, "");
}

function parseDuration(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 45;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function lowercaseFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
