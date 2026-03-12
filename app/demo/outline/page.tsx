import Link from "next/link";
import { OutlinePreview } from "@/components/outline-preview";

export default function DemoOutlinePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Sample Output</p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900">Outline review preview</h1>
        </div>
        <Link
          href="/demo/course"
          className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
        >
          Open lesson preview
        </Link>
      </div>

      <OutlinePreview />
    </div>
  );
}
