# Phase 0: Product Definition and Build Setup

## Goal

Reduce ambiguity before implementation and lock the first build to a realistic, high-value promise.

## Decisions Made

### Product posture

- generic across domains
- healthcare-friendly in examples and future specialization

### Success criteria

- high-quality outline generation
- high-quality lesson rendering

### Scope reduction

To reduce implementation load, the first version will prioritize:

- PDF only
- web preview first
- structured JSON output
- one strong course generation workflow

The first version will not prioritize:

- SCORM export
- certificates
- PPT or DOCX support
- advanced collaborative editing

## Phase 0 Deliverables

- shared blueprint in `docs/project-blueprint.md`
- agreed V1 promise
- phased roadmap
- architecture and schema direction

## P0 Implementation Outcome

At the end of Phase 0, the team should have enough clarity to start coding Phase 1 without reopening foundational product questions.

## Recommended Phase 1 Technical Baseline

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- local mock generation pipeline first

## Initial App Sections

The first code milestone should include:

- marketing or entry page
- new course project flow
- PDF upload UI
- course configuration form
- processing state page
- outline review page
- preview page

## Configuration Fields for MVP

- source document
- course title override
- target audience
- difficulty
- tone
- target duration
- output style
- quiz density
- strict or enhanced mode

## MVP Non-Functional Requirements

- maintainable folder structure
- typed schemas for API input and output
- modular services for extraction and generation
- course content stored as structured data
- extensible enough for background jobs later

## Immediate Next Actions

1. Scaffold the Next.js application
2. Add a docs-aware README and setup instructions
3. Define the Prisma schema
4. Implement project creation plus upload flow
5. Build placeholder outline generation with mock data
6. Build course preview renderer using the JSON schema

## Build Notes for Codex Sessions

Use this repository with a milestone-driven workflow:

1. ask Codex to implement one phase at a time
2. keep the course schema stable as early as possible
3. prefer incremental rendering over large end-to-end AI generation
4. validate UX with one excellent sample path before expanding features
