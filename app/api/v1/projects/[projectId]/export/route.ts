import { NextResponse } from "next/server";
import { getProject } from "@/lib/project-store";
import { renderCourseHtml } from "@/lib/export";

type ExportRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(_request: Request, { params }: ExportRouteProps) {
  const { projectId } = await params;

  try {
    const project = await getProject(projectId);
    const url = new URL(_request.url);
    const format = url.searchParams.get("format");

    if (format === "html") {
      if (!project.course) {
        return NextResponse.json({ error: "Course preview not found." }, { status: 404 });
      }

      return new NextResponse(renderCourseHtml(project.course), {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    return NextResponse.json({
      data: {
        projectId: project.id,
        title: project.title,
        config: project.config,
        documents: project.documents,
        outline: project.outline ?? null,
        course: project.course ?? null,
        generatedAt: {
          outline: project.outlineGeneratedAt ?? null,
          course: project.courseGeneratedAt ?? null
        }
      }
    });
  } catch {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
}
