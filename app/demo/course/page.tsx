import { CoursePreview } from "@/components/course-preview";

export default function DemoCoursePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Sample Output</p>
        <h1 className="mt-2 font-serif text-4xl text-stone-900">Lesson rendering preview</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          This demo shows the learner-facing course style: modular, readable, and engaging without feeling like a
          copied document.
        </p>
      </div>

      <CoursePreview />
    </div>
  );
}
