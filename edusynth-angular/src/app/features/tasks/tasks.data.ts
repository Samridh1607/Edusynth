export interface TaskItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface TaskCategory {
  id: string;
  icon: string;
  title: string;
  tasks: TaskItem[];
}

export const TASK_CATEGORIES: TaskCategory[] = [
  {
    id: 'cat-existing',
    icon: '⭐',
    title: 'Core Tasks',
    tasks: [
      {
        id: 'comparison',
        icon: '📚',
        title: 'Book Comparison',
        description:
          'Compare content across multiple academic books to identify similarities, differences, and knowledge gaps.',
      },
      {
        id: 'qa',
        icon: '💬',
        title: 'Q&A Based on a Book',
        description:
          'Generate and answer questions based on specific book content using AI-powered analysis and comprehension.',
      },
    ],
  },
  {
    id: 'cat-content',
    icon: '✍️',
    title: 'Content Creation & Enrichment',
    tasks: [
      {
        id: 'question-generation',
        icon: '❓',
        title: 'Question Generation from Book / Topic',
        description:
          'Auto-generate questions at specified difficulty levels (recall, application, analysis) and types (MCQ, short answer, case-based) from a chapter, topic, or uploaded document.',
      },
      {
        id: 'distractor-generator',
        icon: '🎯',
        title: 'Distractor Generator for MCQs',
        description:
          'Generate high-quality, plausible wrong options that test for common misconceptions — the hardest part of MCQ writing.',
      },
    ],
  },
  {
    id: 'cat-analysis',
    icon: '🔍',
    title: 'Analysis & Gap Detection',
    tasks: [
      {
        id: 'duplicate-detector',
        icon: '🔄',
        title: 'Duplicate / Near-Duplicate Question Detector',
        description:
          'Scan a question bank to flag semantically similar questions even when worded differently. Reduces redundancy before printing question papers.',
      },
      {
        id: 'syllabus-coverage',
        icon: '🗺️',
        title: 'Syllabus Coverage Analyzer',
        description:
          'Upload a question bank and a syllabus; the tool highlights over-tested, under-tested, or missing topics with a visual heatmap of coverage.',
      },
    ],
  },
  {
    id: 'cat-docs',
    icon: '📄',
    title: 'Document & Paper Workflows',
    tasks: [
      {
        id: 'paper-generator',
        icon: '📝',
        title: 'Question Paper Generator',
        description:
          'Auto-assemble a balanced question paper from the bank given constraints: total marks, time limit, topic distribution, difficulty mix, and question types.',
      },
      {
        id: 'marking-scheme',
        icon: '✅',
        title: 'Answer Key & Marking Scheme Generator',
        description:
          'Generate a structured answer key with point breakdowns and model answers for a given set of questions, ready for evaluators.',
      },
    ],
  },
  {
    id: 'cat-knowledge',
    icon: '💡',
    title: 'Knowledge & Concepts Tools',
    tasks: [
      {
        id: 'glossary-extractor',
        icon: '📖',
        title: 'Glossary / Key Terms Extractor',
        description:
          'Extract domain-specific terms from a book or chapter and generate definitions in context — useful for creating study guides or lecture notes.',
      },
    ],
  },
];
