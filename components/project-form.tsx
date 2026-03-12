"use client";

import { useState } from "react";
import Link from "next/link";
import { defaultCourseConfig } from "@/lib/mock-data";
import type { CourseConfig } from "@/lib/types";

const difficultyOptions: CourseConfig["difficulty"][] = ["Beginner", "Intermediate", "Advanced"];
const toneOptions: CourseConfig["tone"][] = ["Professional", "Conversational", "Academic"];
const styleOptions: CourseConfig["outputStyle"][] = ["Microlearning", "Standard module", "Exam prep"];
const quizOptions: CourseConfig["quizDensity"][] = ["Low", "Medium", "High"];
const modeOptions: CourseConfig["mode"][] = ["Strict", "Enhanced"];

export function ProjectForm() {
  const [config, setConfig] = useState<CourseConfig>(defaultCourseConfig);

  function updateField<K extends keyof CourseConfig>(field: K, value: CourseConfig[K]) {
    setConfig((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-700">Phase 1 scaffold</p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900">Create a new AI course project</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            This screen establishes the project shape for PDF upload, configuration, and later outline generation.
            The form is wired with typed state first so we can connect persistence next.
          </p>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-800">Course title</span>
            <input
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              value={config.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Course title"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-800">Target audience</span>
            <input
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              value={config.audience}
              onChange={(event) => updateField("audience", event.target.value)}
              placeholder="Who is this course for?"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <Fieldset
              label="Difficulty"
              value={config.difficulty}
              options={difficultyOptions}
              onChange={(value) => updateField("difficulty", value)}
            />
            <Fieldset label="Tone" value={config.tone} options={toneOptions} onChange={(value) => updateField("tone", value)} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-800">Target duration</span>
              <input
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                value={config.duration}
                onChange={(event) => updateField("duration", event.target.value)}
                placeholder="45 minutes"
              />
            </label>
            <Fieldset
              label="Output style"
              value={config.outputStyle}
              options={styleOptions}
              onChange={(value) => updateField("outputStyle", value)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Fieldset
              label="Quiz density"
              value={config.quizDensity}
              options={quizOptions}
              onChange={(value) => updateField("quizDensity", value)}
            />
            <Fieldset label="Generation mode" value={config.mode} options={modeOptions} onChange={(value) => updateField("mode", value)} />
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-800">Source upload placeholder</span>
            <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-500">
              PDF upload lands here in the next step. For now, this scaffold defines the layout and adjacent
              project settings so the upload flow can be added cleanly.
            </div>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Save project scaffold
            </button>
            <Link
              href="/demo/outline"
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
            >
              View generated outline demo
            </Link>
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-[2rem] bg-stone-900 p-6 text-stone-100 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.7)]">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Live project brief</p>
          <h2 className="mt-3 font-serif text-3xl">{config.title || "Untitled course"}</h2>
          <p className="mt-4 text-sm leading-6 text-stone-300">
            Audience: {config.audience || "Not set yet"}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-200">
            {[config.difficulty, config.tone, config.duration, config.outputStyle, config.quizDensity, config.mode].map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-3 py-2">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
          <h3 className="font-serif text-2xl text-stone-900">What this phase gives us</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
            <li>Typed project configuration aligned with our blueprint.</li>
            <li>A stable entry point for real upload and database wiring.</li>
            <li>A clear bridge into outline generation and preview routes.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

type FieldsetProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

function Fieldset<T extends string>({ label, value, options, onChange }: FieldsetProps<T>) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium text-stone-800">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-amber-500 text-stone-950"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

