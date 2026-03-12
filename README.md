# EasyLMS

EasyLMS is an AI-powered course authoring portal that turns source PDFs into structured, editable, visually polished LMS-style courses.

The repository now includes the first application scaffold for Phase 1:

- Next.js App Router foundation
- typed project configuration flow
- mock outline review route
- mock lesson preview route
- Prisma schema draft for projects, documents, jobs, and course versions

## Getting Started

1. Copy `.env.example` to `.env` and set `DATABASE_URL`
2. Install dependencies with `npm install`
3. Start the app with `npm run dev`

## Current Routes

- `/`: product overview and current build direction
- `/projects/new`: project setup scaffold
- `/demo/outline`: generated outline preview
- `/demo/course`: learner-facing lesson preview

## Docs

- `docs/project-blueprint.md`: End-to-end product, architecture, and delivery plan
- `docs/phase-0.md`: Phase 0 scope, decisions, success criteria, and next actions
- `docs/phase-tracker.md`: build progress checklist across phases
