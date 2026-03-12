# EasyLMS Project Blueprint

## 1. Product Summary

EasyLMS is an API-first AI course generation platform that converts uploaded PDF training material into a structured, editable, engagement-driven LMS course.

The web app is the first client of the platform, not the platform itself.

The core promise for the first release is:

1. Upload a PDF
2. Choose course settings
3. Generate a high-quality course outline
4. Generate one or more polished lesson experiences
5. Review the result in a professional LMS-style preview

The product should remain generic across domains while feeling healthcare-friendly in language, examples, and extensibility.

## 2. Problem Statement

Training teams often have high-value content trapped in PDFs, manuals, SOPs, and slide decks. Converting that content into modern digital learning experiences is slow, expensive, and usually requires specialized instructional design and LMS authoring expertise.

EasyLMS reduces that effort by combining:

- source ingestion
- content understanding
- instructional design structuring
- lesson generation
- engagement block generation
- visual course rendering

## 3. Vision

Turn static source documents into learning experiences that feel intentionally designed rather than copied from a document.

Success means the output is:

- pedagogically structured
- visually polished
- editable by humans
- traceable back to source content
- reusable for future export formats
- accessible through stable APIs for future integrations

## 3.1 Platform Strategy

EasyLMS should be built as a backend course-generation engine with a thin first-party web experience on top.

That means:

- business logic belongs in reusable services
- data contracts should be stable and versioned
- API routes should model the generation pipeline directly
- the web UI should consume the same APIs future integrations will use

## 4. Product Principles

### 4.1 Source-grounded first

Generated content should remain anchored to uploaded source material. The system can enrich content, but it should clearly distinguish grounded output from inferred or expanded output.

### 4.2 Review before full generation

Users should see and approve a course outline before the system generates full lessons. This reduces waste and increases trust.

### 4.3 Structured output over freeform output

The platform should store courses as structured JSON, not large blobs of generated text. This enables editing, regeneration, theming, and export.

### 4.4 Premium experience over feature overload

V1 should focus on a small set of high-quality interactions and a polished visual renderer rather than a broad list of unfinished LMS features.

### 4.5 API-first architecture

All core operations should be expressible as backend endpoints and job flows, even if the first UI is embedded in the same Next.js app.

## 5. Target Users

Primary users:

- training managers
- instructional designers
- operations leaders
- compliance coordinators
- healthcare education teams

Initial domain posture:

- generic across industries
- healthcare-friendly defaults and examples

Potential early source types:

- training manuals
- SOPs
- compliance guides
- coding and certification prep material
- healthcare documentation guides

## 6. Phase 0 Product Definition

Phase 0 defines the first real promise of the product.

### 6.1 V1 Promise

The first version should support:

1. PDF upload
2. Course configuration
3. PDF extraction and segmentation
4. AI-generated course outline
5. High-quality lesson rendering for at least one generated module
6. LMS-style preview
7. JSON and HTML export later in the roadmap

### 6.2 Success Criteria

The first meaningful milestone is complete when a user can:

1. upload a PDF
2. configure the course
3. receive a clear and useful outline
4. open a polished preview of at least one module with engaging lesson structure

## 7. Scope Strategy

### 7.1 In scope for MVP

- PDF ingestion
- structured extraction pipeline
- configuration form
- outline generation
- lesson generation
- quizzes and knowledge checks
- reusable content blocks
- polished course preview
- editable structured course data

### 7.2 Out of scope for early MVP

- PPT and DOCX ingestion
- SCORM export
- xAPI export
- certificates
- collaborative editing
- audio narration
- video generation
- advanced diagram generation

## 8. User Workflow

### 8.1 Upload

The user uploads one or more PDFs.

### 8.2 Configure

The user chooses:

- course title override
- target audience
- difficulty level
- tone
- target duration
- output style
- quiz density
- strict mode or enhanced mode

### 8.3 Extract and Understand

The system:

- extracts text
- detects sections and headings
- segments content into manageable units
- identifies poor extraction quality
- preserves source references

### 8.4 Outline Generation

The system proposes:

- course title
- course description
- learning objectives
- module structure
- lesson breakdown
- suggested engagement blocks

### 8.5 Lesson Generation

The system turns modules into learner-facing content with:

- concise explanations
- key takeaways
- examples
- callouts
- knowledge checks
- optional flashcards or scenarios

### 8.6 Review and Preview

The user reviews the course in a polished LMS player-style experience and can later edit sections selectively.

### 8.7 Integration workflow

Future clients should be able to:

1. create a project through the API
2. upload source material
3. trigger extraction and generation jobs
4. poll or receive job updates
5. retrieve outline and course artifacts
6. export or embed generated course output

## 9. Phased Delivery Plan

## Phase 0: Product definition

Goal:
Define the product promise, architecture, data model direction, and implementation sequence.

Deliverables:

- project blueprint
- scope definition
- phase plan
- architecture decision baseline

## Phase 1: Foundation

Goal:
Set up the application shell and persistence model.

Deliverables:

- Next.js app scaffold
- versioned API route foundation
- TypeScript setup
- Tailwind styling foundation
- Prisma schema
- PostgreSQL integration
- file upload foundation
- generation job model

## Phase 2: PDF ingestion and normalization

Goal:
Turn PDFs into clean structured source data through API-driven ingestion workflows.

Deliverables:

- PDF upload workflow
- API endpoint for ingestion
- text extraction service
- chunking and segmentation
- section detection
- extraction quality metadata
- source chunk storage

## Phase 3: Course blueprint generation

Goal:
Generate a high-quality, reviewable instructional design outline.

Deliverables:

- API endpoint for outline generation
- learning objective generation
- course summary generation
- module and lesson outline generation
- suggested engagement placement
- outline approval UI

## Phase 4: Lesson generation

Goal:
Transform the outline into learner-facing lesson content.

Deliverables:

- API endpoint for course generation
- lesson content blocks
- summaries
- key points
- quiz blocks
- flashcard blocks
- scenario blocks when appropriate

## Phase 5: LMS renderer

Goal:
Present the generated course in a polished, modern course player.

Deliverables:

- course shell
- module navigation
- lesson rendering engine
- themed block components
- responsive preview

## Phase 6: Editing workflow

Goal:
Give users confidence and control over AI output.

Deliverables:

- section editing
- lesson editing
- reorder support
- selective regeneration

## Phase 7: Export and publishing

Goal:
Make courses usable beyond the internal preview.

Deliverables:

- JSON export
- HTML export
- shareable course link
- SCORM evaluation for later phase

## 10. Recommended Technical Architecture

## 10.0 Architectural stance

EasyLMS should be delivered as a modular monolith first:

- one deployable application
- shared codebase for UI and API
- explicit service boundaries
- versioned API contracts

This gives us speed now without blocking a future split into dedicated API workers or external SDKs.

## 10.1 Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- component-driven UI
- JSON-based lesson renderer

Why:

- fast iteration
- good full-stack ergonomics
- easy route colocation
- straightforward SSR and server action support

## 10.2 Backend

- Next.js route handlers for versioned APIs
- service modules for ingestion and generation logic
- background jobs later via BullMQ and Redis

Why:

- keeps early implementation simple
- avoids premature microservices
- makes queue migration easier later
- lets the web app call the same backend contract future clients will use

### 10.2.1 Initial API surface

Recommended initial routes:

- `POST /api/v1/projects`
- `GET /api/v1/projects/:projectId`
- `POST /api/v1/projects/:projectId/documents`
- `POST /api/v1/projects/:projectId/extract`
- `POST /api/v1/projects/:projectId/outline`
- `POST /api/v1/projects/:projectId/course`
- `GET /api/v1/jobs/:jobId`
- `GET /api/v1/projects/:projectId/course`

## 10.3 Database

- PostgreSQL
- Prisma ORM

Why:

- strong relational modeling
- flexible JSON support
- stable for content, jobs, metadata, and versioning

## 10.4 File Storage

- S3-compatible storage

Candidates:

- AWS S3
- Supabase Storage
- Cloudflare R2

## 10.5 AI Orchestration

Use a multi-step pipeline rather than a single prompt.

Stages:

1. extraction cleanup
2. semantic segmentation
3. outline generation
4. lesson generation
5. assessment generation
6. content block packaging

Each stage should eventually be callable as an API job, not just as internal UI logic.

## 11. Core Data Model

Primary entities:

- User
- SourceDocument
- SourceChunk
- CourseProject
- CourseVersion
- GenerationJob
- GeneratedOutline
- GeneratedLesson

## 12. Draft Database Schema

### User

- id
- email
- name
- createdAt

### CourseProject

- id
- userId
- title
- status
- sourceMode
- configJson
- createdAt
- updatedAt

### SourceDocument

- id
- projectId
- fileName
- fileType
- storageKey
- pageCount
- extractionStatus
- createdAt

### SourceChunk

- id
- documentId
- pageStart
- pageEnd
- sectionTitle
- content
- metadataJson
- createdAt

### GenerationJob

- id
- projectId
- jobType
- status
- inputJson
- outputJson
- errorMessage
- startedAt
- completedAt

### CourseVersion

- id
- projectId
- versionNumber
- outlineJson
- courseJson
- createdAt

## 13. Draft Course JSON Schema

```json
{
  "courseTitle": "Introduction to Clinical Documentation Integrity",
  "courseDescription": "A concise overview of the principles, workflow, and documentation standards used in CDI programs.",
  "audience": "Beginner healthcare professionals",
  "tone": "Professional and clear",
  "durationMinutes": 45,
  "mode": "strict",
  "learningObjectives": [
    "Explain the purpose of CDI programs",
    "Identify core documentation quality principles"
  ],
  "modules": [
    {
      "id": "module-1",
      "title": "Foundations of CDI",
      "summary": "Introduces the purpose, terminology, and high-level workflow.",
      "lessons": [
        {
          "id": "lesson-1",
          "title": "What CDI Means",
          "type": "content",
          "contentBlocks": [
            {
              "type": "hero",
              "title": "Clinical Documentation Integrity",
              "body": "CDI supports accurate, complete, and clinically meaningful documentation."
            },
            {
              "type": "keyPoints",
              "items": [
                "Improves documentation quality",
                "Supports coding accuracy",
                "Strengthens communication"
              ]
            },
            {
              "type": "quiz",
              "question": "What is a core purpose of CDI?",
              "options": [
                "Reducing staffing levels",
                "Improving documentation quality",
                "Replacing coding teams",
                "Shortening patient stays"
              ],
              "answerIndex": 1,
              "explanation": "CDI programs focus on accurate and complete documentation."
            }
          ],
          "sourceRefs": [
            {
              "documentId": "doc-1",
              "chunkIds": ["chunk-4", "chunk-5"]
            }
          ]
        }
      ]
    }
  ]
}
```

## 14. Content Block Library for MVP

The renderer should start with a concise but expressive block set:

- hero
- richText
- keyPoints
- exampleCard
- warningCard
- summaryCard
- quiz
- flashcards
- scenario
- reflectionPrompt

## 15. Generation Modes

### Strict mode

- stay tightly grounded in source material
- avoid unsupported expansion
- prefer direct summarization and restructuring

### Enhanced mode

- allow examples and engagement additions
- allow transitions and instructional rewriting
- remain semantically aligned to the source

## 16. UX Principles

The UI should feel more like a premium course authoring tool than a generic admin dashboard.

Requirements:

- strong visual hierarchy
- intentional typography
- clear progress states
- obvious review checkpoints
- polished course preview

Key screens:

- landing or dashboard
- upload and setup
- processing status
- outline review
- course preview
- editor later

## 17. Risks and Mitigations

### Risk: weak PDF extraction

Mitigation:

- keep extraction modular
- store chunks and metadata
- track extraction confidence or quality hints

### Risk: generic AI output

Mitigation:

- use staged prompts
- define content block schema
- keep review and editing built into the workflow

### Risk: scope explosion

Mitigation:

- hold V1 to PDF only
- postpone SCORM and certificates
- prioritize outline quality and rendering quality

## 18. Immediate Build Order

1. Define scope and success metrics
2. Scaffold Next.js app
3. Create database schema
4. Build PDF upload and project creation flow
5. Add extraction placeholder pipeline
6. Add outline generation flow
7. Add preview renderer for one module
8. Add lesson generation

## 19. Phase Exit Criteria

Phase 0 exit:

- product promise agreed
- architecture documented
- roadmap documented

Phase 1 exit:

- app runs locally
- project and upload flows exist
- database can store projects and sources

Phase 2 exit:

- uploaded PDF can be extracted into chunks

Phase 3 exit:

- user can review a generated outline

Phase 4 exit:

- at least one generated module renders as a polished lesson flow

## 20. Definition of Done for MVP

The MVP is done when:

1. a user uploads a PDF
2. configures a course
3. receives a useful AI-generated outline
4. previews polished lesson content for at least one generated module
5. can inspect structured course data
