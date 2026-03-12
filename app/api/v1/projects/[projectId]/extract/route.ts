import { NextResponse } from "next/server";
import { extractProjectDocument } from "@/lib/extraction";

type ExtractRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function POST(request: Request, { params }: ExtractRouteProps) {
  const { projectId } = await params;
  const body = (await request.json().catch(() => ({}))) as { documentId?: string };

  try {
    const result = await extractProjectDocument(projectId, body.documentId);

    return NextResponse.json({
      data: {
        jobId: result.jobId,
        projectId: result.project.id,
        pageCount: result.pageCount,
        chunkCount: result.chunkCount,
        totalWords: result.totalWords
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extraction failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

