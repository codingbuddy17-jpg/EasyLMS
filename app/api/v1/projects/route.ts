import { NextResponse } from "next/server";
import { createProject } from "@/lib/project-store";
import type { CourseConfig } from "@/lib/types";

const allowedModes = new Set<CourseConfig["mode"]>(["Strict", "Enhanced"]);
const allowedDifficulty = new Set<CourseConfig["difficulty"]>(["Beginner", "Intermediate", "Advanced"]);
const allowedTone = new Set<CourseConfig["tone"]>(["Professional", "Conversational", "Academic"]);
const allowedStyle = new Set<CourseConfig["outputStyle"]>(["Microlearning", "Standard module", "Exam prep"]);
const allowedQuizDensity = new Set<CourseConfig["quizDensity"]>(["Low", "Medium", "High"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const source = formData.get("source");

  if (!(source instanceof File)) {
    return NextResponse.json({ error: "Please attach a PDF file." }, { status: 400 });
  }

  if (source.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF uploads are supported in Phase 1." }, { status: 400 });
  }

  const title = readString(formData, "title");
  const audience = readString(formData, "audience");
  const duration = readString(formData, "duration");

  if (!title || !audience || !duration) {
    return NextResponse.json({ error: "Please complete the title, audience, and duration fields." }, { status: 400 });
  }

  const difficulty = readEnum(formData, "difficulty", allowedDifficulty);
  const tone = readEnum(formData, "tone", allowedTone);
  const outputStyle = readEnum(formData, "outputStyle", allowedStyle);
  const quizDensity = readEnum(formData, "quizDensity", allowedQuizDensity);
  const mode = readEnum(formData, "mode", allowedModes);

  if (!difficulty || !tone || !outputStyle || !quizDensity || !mode) {
    return NextResponse.json({ error: "Please choose all course configuration options." }, { status: 400 });
  }

  const config: CourseConfig = {
    title,
    audience,
    difficulty,
    tone,
    duration,
    outputStyle,
    quizDensity,
    mode
  };

  const project = await createProject({
    config,
    document: {
      fileName: source.name,
      fileType: source.type,
      buffer: Buffer.from(await source.arrayBuffer())
    }
  });

  return NextResponse.json({
    data: {
      projectId: project.id,
      status: project.status
    }
  });
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readEnum<T extends string>(formData: FormData, key: string, values: Set<T>) {
  const value = formData.get(key);

  if (typeof value === "string" && values.has(value as T)) {
    return value as T;
  }

  return null;
}
