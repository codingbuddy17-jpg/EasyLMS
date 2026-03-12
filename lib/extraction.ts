import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import PDFParser, { type Output, type Page, type Text } from "pdf2json";
import { getProject, getUploadPath, updateProject, type StoredChunk, type StoredDocument } from "@/lib/project-store";

export async function extractProjectDocument(projectId: string, documentId?: string) {
  const project = await getProject(projectId);
  const document = documentId ? project.documents.find((item) => item.id === documentId) : project.documents[0];

  if (!document) {
    throw new Error("Document not found.");
  }

  const jobId = randomUUID();
  const startedAt = new Date().toISOString();

  await updateProject(projectId, (current) => ({
    ...current,
    status: "processing",
    documents: current.documents.map((item) =>
      item.id === document.id
        ? {
            ...item,
            extractionStatus: "processing",
            extractionError: undefined
          }
        : item
    ),
    jobs: [
      ...current.jobs,
      {
        id: jobId,
        type: "EXTRACTION",
        status: "running",
        documentId: document.id,
        startedAt
      }
    ]
  }));

  try {
    const result = await parseDocument(document);

    const completedAt = new Date().toISOString();
    const totalWords = result.chunks.reduce((sum, chunk) => sum + chunk.wordCount, 0);

    const updatedProject = await updateProject(projectId, (current) => ({
      ...current,
      status: "draft",
      documents: current.documents.map((item) =>
        item.id === document.id
          ? {
              ...item,
              extractionStatus: "complete",
              pageCount: result.pageCount,
              extractedAt: completedAt,
              extractionError: undefined,
              chunks: result.chunks
            }
          : item
      ),
      jobs: current.jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "complete",
              completedAt,
              output: {
                pageCount: result.pageCount,
                chunkCount: result.chunks.length,
                totalWords
              }
            }
          : job
      )
    }));

    return {
      jobId,
      project: updatedProject,
      pageCount: result.pageCount,
      chunkCount: result.chunks.length,
      totalWords
    };
  } catch (error) {
    const completedAt = new Date().toISOString();
    const message = error instanceof Error ? error.message : "Extraction failed.";

    await updateProject(projectId, (current) => ({
      ...current,
      status: "draft",
      documents: current.documents.map((item) =>
        item.id === document.id
          ? {
              ...item,
              extractionStatus: "failed",
              extractionError: message
            }
          : item
      ),
      jobs: current.jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "failed",
              completedAt,
              errorMessage: message
            }
          : job
      )
    }));

    throw error;
  }
}

async function parseDocument(document: StoredDocument) {
  const fileBuffer = await readFile(getUploadPath(document.relativePath));
  const pdfData = await parsePdfBuffer(fileBuffer);
  const chunks = buildChunks(document.id, pdfData.Pages);

  return {
    pageCount: pdfData.Pages.length,
    chunks
  };
}

function parsePdfBuffer(buffer: Buffer) {
  return new Promise<Output>((resolve, reject) => {
    const parser = new PDFParser(null, true);

    parser.on("pdfParser_dataError", (error) => {
      const parserError = error instanceof Error ? error : "parserError" in error ? error.parserError : new Error("PDF parsing failed.");
      parser.destroy();
      reject(parserError);
    });

    parser.on("pdfParser_dataReady", (pdfData) => {
      parser.destroy();
      resolve(pdfData);
    });

    parser.parseBuffer(buffer);
  });
}

function buildChunks(documentId: string, pages: Page[]) {
  const chunks: StoredChunk[] = [];

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const lines = extractStructuredLines(page);

    if (lines.length === 0) {
      continue;
    }

    let activeHeading: string | null = null;
    let buffer: string[] = [];

    for (const line of lines) {
      if (line.isHeading) {
        if (buffer.length > 0) {
          chunks.push(createChunk(documentId, index + 1, buffer.join("\n\n"), activeHeading));
          buffer = [];
        }

        activeHeading = line.text;
        continue;
      }

      if (!line.text) {
        continue;
      }

      const lastParagraph = buffer.at(-1);
      const nextParagraph = lastParagraph ? `${lastParagraph} ${line.text}` : line.text;

      if (nextParagraph.length > 420 && lastParagraph) {
        buffer.push(line.text);
      } else if (lastParagraph) {
        buffer[buffer.length - 1] = nextParagraph;
      } else {
        buffer.push(line.text);
      }

      const totalLength = buffer.join("\n\n").length;

      if (totalLength > 1350) {
        chunks.push(createChunk(documentId, index + 1, buffer.join("\n\n"), activeHeading));
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      chunks.push(createChunk(documentId, index + 1, buffer.join("\n\n"), activeHeading));
    }
  }

  return chunks;
}

function extractStructuredLines(page: Page) {
  const sortedTexts = [...page.Texts].sort((left, right) => {
    if (Math.abs(left.y - right.y) > 0.35) {
      return left.y - right.y;
    }

    return left.x - right.x;
  });

  const lines: Array<{ text: string; y: number; fontSize: number }> = [];
  let currentY: number | null = null;
  let currentLine: Text[] = [];

  for (const text of sortedTexts) {
    const decoded = decodeText(text);

    if (!decoded) {
      continue;
    }

    if (currentY === null || Math.abs(text.y - currentY) <= 0.35) {
      currentLine.push(text);
      currentY = currentY ?? text.y;
      continue;
    }

    const normalizedLine = normalizeLine(currentLine, currentY);

    if (normalizedLine) {
      lines.push(normalizedLine);
    }

    currentLine = [text];
    currentY = text.y;
  }

  if (currentLine.length > 0) {
    const normalizedLine = normalizeLine(currentLine, currentY ?? 0);

    if (normalizedLine) {
      lines.push(normalizedLine);
    }
  }

  return lines.map((line) => ({
    ...line,
    isHeading: isHeadingLine(line.text, line.fontSize)
  }));
}

function decodeText(text: Text) {
  const value = text.R.map((run) => run.T).join(" ");

  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function normalizeLine(lineParts: Text[], y: number) {
  const text = lineParts
    .map((part) => decodeText(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return null;
  }

  const fontSize = average(
    lineParts.flatMap((part) => part.R.map((run) => run.TS?.[1] ?? 10)).filter((value) => Number.isFinite(value))
  );

  return {
    text,
    y,
    fontSize
  };
}

function createChunk(documentId: string, pageNumber: number, content: string, sectionTitle: string | null): StoredChunk {
  const normalized = content.trim();
  const words = normalized.split(/\s+/).filter(Boolean);

  return {
    id: randomUUID(),
    documentId,
    pageNumber,
    sectionTitle,
    content: normalized,
    excerpt: normalized.slice(0, 180),
    wordCount: words.length,
    charCount: normalized.length
  };
}

function isHeadingLine(text: string, fontSize: number) {
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length === 0 || text.length > 90) {
    return false;
  }

  const numberedHeading = /^(\d+(\.\d+)*|[A-Z])[\])\.-]?\s+[A-Z]/.test(text);
  const titleCaseHeading = /^[A-Z][A-Za-z0-9/&(),\- ]+$/.test(text) && !/[.!?]$/.test(text);
  const mostlyUppercase = text === text.toUpperCase() && /[A-Z]/.test(text) && words.length <= 8;
  const largeText = fontSize >= 12.5 && words.length <= 10;

  return numberedHeading || mostlyUppercase || (titleCaseHeading && largeText);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 10;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
