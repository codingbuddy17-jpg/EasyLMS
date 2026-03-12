import { NextResponse } from "next/server";
import { getProject } from "@/lib/project-store";

type ProjectRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(_request: Request, { params }: ProjectRouteProps) {
  const { projectId } = await params;

  try {
    const project = await getProject(projectId);
    return NextResponse.json({ data: project });
  } catch {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
}

