import { NextResponse } from "next/server";
import { getProject } from "@/lib/project-store";
import { generateProjectCourse } from "@/lib/course";

type CourseRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function POST(_request: Request, { params }: CourseRouteProps) {
  const { projectId } = await params;

  try {
    const result = await generateProjectCourse(projectId);

    return NextResponse.json({
      data: {
        projectId: result.project.id,
        course: result.course
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Course generation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(_request: Request, { params }: CourseRouteProps) {
  const { projectId } = await params;

  try {
    const project = await getProject(projectId);

    if (!project.course) {
      return NextResponse.json({ error: "Course preview not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        projectId: project.id,
        generatedAt: project.courseGeneratedAt,
        course: project.course
      }
    });
  } catch {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
}

