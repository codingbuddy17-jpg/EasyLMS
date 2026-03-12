export type CourseConfig = {
  title: string;
  audience: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tone: "Professional" | "Conversational" | "Academic";
  duration: string;
  outputStyle: "Microlearning" | "Standard module" | "Exam prep";
  quizDensity: "Low" | "Medium" | "High";
  mode: "Strict" | "Enhanced";
};

export type OutlineLesson = {
  id: string;
  title: string;
  promise: string;
  interaction: string;
};

export type OutlineModule = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  lessons: OutlineLesson[];
};

export type CourseOutline = {
  title: string;
  subtitle: string;
  audience: string;
  totalMinutes: number;
  objectives: string[];
  modules: OutlineModule[];
};

export type ContentBlock =
  | {
      type: "hero";
      eyebrow: string;
      title: string;
      body: string;
    }
  | {
      type: "richText";
      title: string;
      paragraphs: string[];
    }
  | {
      type: "keyPoints";
      title: string;
      items: string[];
    }
  | {
      type: "exampleCard";
      title: string;
      body: string;
    }
  | {
      type: "warningCard";
      title: string;
      body: string;
    }
  | {
      type: "quiz";
      title: string;
      question: string;
      options: string[];
      answerIndex: number;
      explanation: string;
    }
  | {
      type: "summaryCard";
      title: string;
      items: string[];
    };

export type CourseLesson = {
  id: string;
  title: string;
  durationMinutes: number;
  contentBlocks: ContentBlock[];
};

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  lessons: CourseLesson[];
};

export type GeneratedCourse = {
  title: string;
  description: string;
  audience: string;
  durationMinutes: number;
  objectives: string[];
  modules: CourseModule[];
};

