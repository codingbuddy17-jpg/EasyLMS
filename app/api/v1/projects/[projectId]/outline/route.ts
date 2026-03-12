import { NextResponse } from "next/server";
import { getProject } from "@/lib/project-store";
import { generateProjectOutline } from "@/lib/outline";

type OutlineRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function POST(_request: Request, { params }: OutlineRouteProps) {
  const { projectId } = await params;

  try {
    const result = await generateProjectOutline(projectId);

    return NextResponse.json({
      data: {
        projectId: result.project.id,
        outline: result.outline
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Outline generation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(_request: Request, { params }: OutlineRouteProps) {
  const { projectId } = await params;

  try {
    const project = await getProject(projectId);

    if (!project.outline) {
      return NextResponse.json({ error: "Outline not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        projectId: project.id,
        generatedAt: project.outlineGeneratedAt,
        outline: project.outline
      }
    });
  } catch {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
}
