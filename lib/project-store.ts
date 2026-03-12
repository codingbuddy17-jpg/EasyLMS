import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { CourseConfig, CourseOutline, GeneratedCourse } from "@/lib/types";

export type ExtractionStatus = "pending" | "processing" | "complete" | "failed";

export type StoredChunk = {
  id: string;
  documentId: string;
  pageNumber: number;
  sectionTitle: string | null;
  content: string;
  excerpt: string;
  wordCount: number;
  charCount: number;
};

export type StoredJob = {
  id: string;
  type: "EXTRACTION";
  status: "running" | "complete" | "failed";
  documentId: string;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  output?: {
    pageCount: number;
    chunkCount: number;
    totalWords: number;
  };
};

export type StoredDocument = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  relativePath: string;
  uploadedAt: string;
  extractionStatus: ExtractionStatus;
  pageCount?: number;
  extractedAt?: string;
  extractionError?: string;
  chunks: StoredChunk[];
};

export type StoredProject = {
  id: string;
  title: string;
  status: "draft" | "processing";
  config: CourseConfig;
  documents: StoredDocument[];
  jobs: StoredJob[];
  outline?: CourseOutline;
  outlineGeneratedAt?: string;
  course?: GeneratedCourse;
  courseGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
};

const dataRoot = path.join(process.cwd(), "data");
const projectsRoot = path.join(dataRoot, "projects");
const uploadsRoot = path.join(dataRoot, "uploads");

async function ensureDir(dirPath: string) {
  await mkdir(dirPath, { recursive: true });
}

export async function createProject(params: {
  config: CourseConfig;
  document: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  };
}) {
  const projectId = randomUUID();
  const documentId = randomUUID();
  const now = new Date().toISOString();
  const safeFileName = params.document.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const relativeUploadPath = path.join(projectId, `${documentId}-${safeFileName}`);
  const uploadPath = path.join(uploadsRoot, relativeUploadPath);

  await ensureDir(path.dirname(uploadPath));
  await ensureDir(projectsRoot);

  await writeFile(uploadPath, params.document.buffer);

  const project: StoredProject = {
    id: projectId,
    title: params.config.title,
    status: "draft",
    config: params.config,
    documents: [
      {
        id: documentId,
        fileName: params.document.fileName,
        fileType: params.document.fileType,
        fileSize: params.document.buffer.byteLength,
        relativePath: relativeUploadPath,
        uploadedAt: now,
        extractionStatus: "pending",
        chunks: []
      }
    ],
    jobs: [],
    createdAt: now,
    updatedAt: now
  };

  await saveProject(project);

  return project;
}

export async function getProject(projectId: string) {
  const projectPath = path.join(projectsRoot, `${projectId}.json`);
  const raw = await readFile(projectPath, "utf8");
  return normalizeProject(JSON.parse(raw) as StoredProject);
}

export async function saveProject(project: StoredProject) {
  await ensureDir(projectsRoot);
  const projectPath = path.join(projectsRoot, `${project.id}.json`);
  await writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");
}

export async function updateProject(projectId: string, updater: (project: StoredProject) => StoredProject) {
  const current = await getProject(projectId);
  const nextProject = updater(current);
  const project = {
    ...nextProject,
    updatedAt: new Date().toISOString()
  };

  await saveProject(project);
  return project;
}

export function getUploadPath(relativePath: string) {
  return path.join(uploadsRoot, relativePath);
}

function normalizeProject(project: StoredProject) {
  return {
    ...project,
    documents: project.documents.map((document) => ({
      ...document,
      extractionStatus: document.extractionStatus ?? "pending",
      chunks: document.chunks ?? []
    })),
    jobs: project.jobs ?? []
  } satisfies StoredProject;
}
