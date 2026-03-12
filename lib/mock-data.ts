import type { CourseConfig, CourseOutline, GeneratedCourse } from "@/lib/types";

export const defaultCourseConfig: CourseConfig = {
  title: "Clinical Documentation Fundamentals",
  audience: "Operations and healthcare training teams",
  difficulty: "Beginner",
  tone: "Professional",
  duration: "45 minutes",
  outputStyle: "Standard module",
  quizDensity: "Medium",
  mode: "Strict"
};

export const mockOutline: CourseOutline = {
  title: "Clinical Documentation Fundamentals",
  subtitle: "A source-grounded starter course generated from training PDFs",
  audience: "Operations and healthcare training teams",
  totalMinutes: 45,
  objectives: [
    "Explain why documentation quality matters in operational and clinical workflows.",
    "Identify the core components of complete and accurate source documentation.",
    "Apply a simple review lens before handing work to coding or compliance teams."
  ],
  modules: [
    {
      id: "module-1",
      title: "Why Documentation Quality Matters",
      summary: "Introduces the business, quality, and communication impact of better documentation.",
      estimatedMinutes: 12,
      lessons: [
        {
          id: "lesson-1",
          title: "The cost of unclear source material",
          promise: "Learners understand how incomplete documentation creates downstream rework.",
          interaction: "Knowledge check"
        },
        {
          id: "lesson-2",
          title: "What strong documentation looks like",
          promise: "Learners learn a memorable quality checklist.",
          interaction: "Key-points card"
        }
      ]
    },
    {
      id: "module-2",
      title: "Building a Reliable Review Habit",
      summary: "Translates source guidance into an easy review workflow before submission or handoff.",
      estimatedMinutes: 18,
      lessons: [
        {
          id: "lesson-3",
          title: "A three-step review framework",
          promise: "Learners can inspect source content using a repeatable process.",
          interaction: "Scenario reflection"
        },
        {
          id: "lesson-4",
          title: "Common misses and how to catch them",
          promise: "Learners spot patterns that create avoidable follow-up work.",
          interaction: "Quiz"
        }
      ]
    },
    {
      id: "module-3",
      title: "Applying the Standard in Practice",
      summary: "Connects the document guidance to realistic working situations and short assessments.",
      estimatedMinutes: 15,
      lessons: [
        {
          id: "lesson-5",
          title: "Mini case walkthrough",
          promise: "Learners practice making a quality judgment with confidence.",
          interaction: "Case scenario"
        }
      ]
    }
  ]
};

export const mockCourse: GeneratedCourse = {
  title: mockOutline.title,
  description:
    "A polished lesson experience that demonstrates how EasyLMS can turn PDF source material into a modern, engagement-driven learning module.",
  audience: mockOutline.audience,
  durationMinutes: mockOutline.totalMinutes,
  objectives: mockOutline.objectives,
  modules: [
    {
      id: "module-1",
      title: mockOutline.modules[0].title,
      summary: mockOutline.modules[0].summary,
      lessons: [
        {
          id: "lesson-1",
          title: "The cost of unclear source material",
          durationMinutes: 6,
          contentBlocks: [
            {
              type: "hero",
              eyebrow: "Module 1",
              title: "Documentation quality is operational quality",
              body:
                "Poor source material does not stay local to one team. It creates coding delays, compliance risk, rework, and weaker learner confidence."
            },
            {
              type: "richText",
              title: "Why this lesson matters",
              paragraphs: [
                "When teams work from incomplete or ambiguous documents, they spend time filling gaps rather than moving the process forward.",
                "A modern learning experience should help people recognize the real impact quickly, then give them a practical habit they can apply immediately."
              ]
            },
            {
              type: "keyPoints",
              title: "The ripple effects of weak source material",
              items: [
                "Review cycles get longer because essential details are missing.",
                "Teams interpret the same document differently, which creates inconsistency.",
                "Errors are more likely to surface later, when they are harder to correct."
              ]
            },
            {
              type: "exampleCard",
              title: "In practice",
              body:
                "A vague summary note may seem small, but it can force downstream teams to pause, clarify intent, and revisit the record before they can continue."
            },
            {
              type: "warningCard",
              title: "What to avoid",
              body:
                "Do not treat completeness as a formatting concern alone. A tidy document can still be unusable if the core meaning is incomplete."
            },
            {
              type: "quiz",
              title: "Quick check",
              question: "What is the best reason to improve documentation quality at the source?",
              options: [
                "It reduces the need for collaboration.",
                "It minimizes downstream confusion and rework.",
                "It removes the need for quality review.",
                "It guarantees automatic compliance."
              ],
              answerIndex: 1,
              explanation:
                "Better source documentation improves clarity, which reduces avoidable follow-up and operational friction."
            },
            {
              type: "summaryCard",
              title: "Takeaways",
              items: [
                "Source quality affects every downstream team.",
                "Clear, complete documentation reduces avoidable rework.",
                "The learner should leave this lesson with a practical reason to care."
              ]
            }
          ]
        }
      ]
    }
  ]
};

