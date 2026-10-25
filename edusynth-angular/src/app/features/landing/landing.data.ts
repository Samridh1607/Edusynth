export interface Capability {
  category: string;
  image: string;
  imageAlt: string;
  /** Which side of the panorama holds the artwork; the text sits on the other side. */
  artSide: 'left' | 'right';
  title: string;
  description: string;
  tools: string[];
}

export interface Step {
  title: string;
  description: string;
}

export interface Audience {
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/** One card per task category on the Tasks page, in the same order. */
export const CAPABILITIES: Capability[] = [
  {
    category: 'Core Tasks',
    image: 'images/landing/pano-compare.svg',
    imageAlt: 'Two holographic books being scanned and compared',
    artSide: 'right',
    title: 'Understand Any Book',
    description:
      'Put several textbooks side by side to see where they agree, where they differ, and what each one leaves out. Ask questions and get answers grounded in the text.',
    tools: ['Book Comparison', 'Q&A Based on a Book'],
  },
  {
    category: 'Content Creation & Enrichment',
    image: 'images/landing/pano-create.svg',
    imageAlt: 'A light prism refracting a beam into floating question cards',
    artSide: 'left',
    title: 'Create Assessment Content',
    description:
      'Turn a chapter or a topic into ready-to-use questions, complete with believable wrong options for multiple-choice tests.',
    tools: ['Question Generation', 'Distractor Generator for MCQs'],
  },
  {
    category: 'Analysis & Gap Detection',
    image: 'images/landing/pano-analyze.svg',
    imageAlt: 'A radar sweep mapping syllabus coverage and flagging a gap',
    artSide: 'right',
    title: 'Find Gaps & Duplicates',
    description:
      'Check a question bank against the syllabus to see which topics are covered and which are missing, and flag questions that repeat each other.',
    tools: ['Syllabus Coverage Analyzer', 'Duplicate Question Detector'],
  },
  {
    category: 'Document & Paper Workflows',
    image: 'images/landing/pano-papers.svg',
    imageAlt: 'Question fragments assembling into an exam paper beside its answer key',
    artSide: 'left',
    title: 'Build Papers in Minutes',
    description:
      'Assemble a balanced question paper and produce the matching answer key and marking scheme in the same session.',
    tools: ['Question Paper Generator', 'Answer Key & Marking Scheme'],
  },
  {
    category: 'Knowledge & Concepts Tools',
    image: 'images/landing/pano-knowledge.svg',
    imageAlt: 'A constellation of linked key concepts orbiting a glossary hub',
    artSide: 'right',
    title: 'Map Key Concepts',
    description:
      'Pull the essential terms and definitions out of any book so students can revise from a clear glossary.',
    tools: ['Glossary / Key Terms Extractor'],
  },
];

export const STEPS: Step[] = [
  {
    title: 'Bring your material',
    description: 'Choose a book, a topic, or a syllabus to work from.',
  },
  {
    title: 'Pick a task',
    description: 'Select one of the tools, such as question generation or coverage analysis.',
  },
  {
    title: 'Review and use',
    description: 'Check the result, adjust it, and share it with your students or colleagues.',
  },
];

export const AUDIENCES: Audience[] = [
  {
    icon: '🏫',
    title: 'Schools',
    description:
      'Departments share one consistent question bank and produce term papers aligned to the curriculum.',
  },
  {
    icon: '🎓',
    title: 'Universities',
    description:
      'Faculty compare reference texts across courses and check that assessments cover every learning outcome.',
  },
  {
    icon: '📚',
    title: 'Publishers',
    description:
      'Editorial teams create end-of-chapter exercises, glossaries and answer keys alongside each new title.',
  },
  {
    icon: '🧑‍🏫',
    title: 'Training & Coaching Centres',
    description:
      'Instructors produce fresh practice sets for every batch without repeating last year\'s questions.',
  },
];

/** Cycled through in the hero subtitle. */
export const HERO_AUDIENCES = ['teachers', 'schools', 'universities', 'publishers', 'trainers'];

// TODO: placeholder figures. Replace with real customer metrics before release.
export const STATS: Stat[] = [
  { value: 1200, suffix: '+', label: 'Institutions onboard' },
  { value: 85000, suffix: '+', label: 'Educators using EduSynth' },
  { value: 2.4, suffix: 'M', label: 'Questions generated' },
  { value: 70, suffix: '%', label: 'Less time spent preparing papers' },
];
