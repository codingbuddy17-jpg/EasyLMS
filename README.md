# EasyLMS

EasyLMS is an API-first AI course generation platform that turns source PDFs into structured, editable, visually polished LMS-style courses.

The web app in this repository is the first client of that platform. The long-term goal is to expose the same course-generation engine for larger integrations, internal tools, and partner applications.

The repository now includes the first application scaffold for Phase 1:

- Next.js App Router foundation
- API-first route structure beginning with `/api/v1`
- typed project configuration flow
- local-first project creation and PDF upload route
- PDF extraction and chunking pipeline
- mock outline review route
- mock lesson preview route
- Prisma schema draft for projects, documents, jobs, and course versions

## Getting Started

1. Copy `.env.example` to `.env` and set `DATABASE_URL`
2. Install dependencies with `npm install`
3. Start the app with `npm run dev`

Uploaded PDFs and saved project records are currently stored locally under `data/` until database-backed persistence is wired.

## Current Routes

- `/`: product overview and current build direction
- `/projects/new`: project setup scaffold
- `/projects/[projectId]`: project detail, extraction trigger, and extracted chunk preview
- `/demo/outline`: generated outline preview
- `/demo/course`: learner-facing lesson preview
- `/api/v1/projects`: project creation API for the current web client
- `/api/v1/projects/[projectId]`: project retrieval API
- `/api/v1/projects/[projectId]/extract`: document extraction API
- `/api/v1/projects/[projectId]/outline`: outline generation and retrieval API
- `/api/v1/projects/[projectId]/course`: course preview generation and retrieval API
- `/api/v1/projects/[projectId]/export`: consolidated project artifact export API

## Docs

- `docs/project-blueprint.md`: End-to-end product, architecture, and delivery plan
- `docs/phase-0.md`: Phase 0 scope, decisions, success criteria, and next actions
- `docs/phase-tracker.md`: build progress checklist across phases
