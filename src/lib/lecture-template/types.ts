export type LectureLevel = "beginner" | "intermediate" | "advanced";
export type CalloutVariant = "note" | "warning" | "insight";
export type DiagramType = "flowchart" | "sequence" | "class" | "state" | "er" | "gantt" | "pie" | "mindmap";
export type DiagramDirection = "TB" | "LR" | "BT" | "RL";
export type DiagramTheme = "default" | "dark" | "forest" | "neutral" | "base";
export type LectureComponentType =
  | "callout"
  | "concept_card"
  | "step_list"
  | "code_block"
  | "comparison"
  | "summary"
  | "quote"
  | "quiz"
  | "question_set"
  | "free_response"
  | "practice_task"
  | "diagram"
  | "glossary_term"
  | "tabs"
  | "accordion"
  | "timeline"
  | "checklist"
  | "flashcard"
  | "worked_example"
  | "mistake_correction"
  | "resource_links"
  | "instructor_note";

export interface SourceLocator {
  line?: number;
  column?: number;
  context?: string;
}

export interface TemplateProblem {
  code: string;
  message: string;
  locator?: SourceLocator;
  field?: string;
  heading?: string;
  sectionTitle?: string;
  componentType?: string;
  hint?: string;
}

export type ParseError = TemplateProblem;
export type ValidationError = TemplateProblem;

export interface ParsedFrontmatter {
  value: Record<string, unknown>;
  locator: SourceLocator;
  raw: string;
}

export type MarkdownBlock =
  | {
      kind: "paragraph";
      text: string;
      locator: SourceLocator;
    }
  | {
      kind: "bullet_list" | "numbered_list";
      items: string[];
      locator: SourceLocator;
    }
  | {
      kind: "code_fence";
      language: string;
      code: string;
      locator: SourceLocator;
    }
  | {
      kind: "table";
      rows: string[];
      locator: SourceLocator;
    }
  | {
      kind: "heading";
      depth: number;
      text: string;
      locator: SourceLocator;
    }
  | ParsedComponentBlock;

export interface ParsedComponentBlock {
  kind: "component";
  raw: string;
  data: unknown;
  locator: SourceLocator;
  sectionTitle?: string;
  componentType?: string;
  yamlErrors: ParseError[];
}

export interface ParsedHeading {
  kind: "Overview" | "Learning Objectives" | "Section" | "Key Takeaways" | "Other";
  text: string;
  title?: string;
  locator: SourceLocator;
}

export interface ParsedSection {
  title: string;
  locator: SourceLocator;
  blocks: MarkdownBlock[];
  anchor: string;
}

export interface ParsedLectureTemplate {
  frontmatter: ParsedFrontmatter;
  preOverviewContent: MarkdownBlock[];
  overview?: {
    locator: SourceLocator;
    blocks: MarkdownBlock[];
  };
  objectives?: {
    locator: SourceLocator;
    blocks: MarkdownBlock[];
  };
  sections: ParsedSection[];
  takeaways?: {
    locator: SourceLocator;
    blocks: MarkdownBlock[];
  };
  headings: ParsedHeading[];
  errors: ParseError[];
}

export interface LectureMetadata {
  title: string;
  description: string;
  audience: string;
  duration: string;
  level: LectureLevel;
}

export interface CourseMetadata {
  title: string;
  description: string;
  audience?: string;
  level?: LectureLevel;
  duration?: string;
}

export type CourseMetadataValidationResult =
  | {
      status: "absent";
      path: string;
      errors: [];
    }
  | {
      status: "valid";
      path: string;
      metadata: CourseMetadata;
      errors: [];
    }
  | {
      status: "invalid";
      path: string;
      errors: ValidationError[];
    };

export interface LectureCollectionEntry {
  slug: string;
  order: number;
  templatePath: string;
}

export interface LectureCollection {
  basePath: string;
  entries: LectureCollectionEntry[];
  courseMetadata: CourseMetadataValidationResult;
}

export interface LectureValidationResult {
  slug: string;
  templatePath: string;
  valid: boolean;
  errors: ValidationError[];
  template?: LectureTemplate;
}

export interface CollectionValidationResult {
  lectureCount: number;
  results: LectureValidationResult[];
  courseMetadata: CourseMetadataValidationResult;
  allPassed: boolean;
}

export interface CalloutComponent {
  type: "callout";
  variant: CalloutVariant;
  title: string;
  body: string;
}

export interface ConceptCardComponent {
  type: "concept_card";
  title: string;
  body: string;
}

export interface StepListComponent {
  type: "step_list";
  title: string;
  steps: string[];
}

export interface CodeBlockComponent {
  type: "code_block";
  language: string;
  code: string;
}

export interface ComparisonItem {
  label: string;
  left: string;
  right: string;
}

export interface ComparisonComponent {
  type: "comparison";
  title: string;
  leftLabel: string;
  rightLabel: string;
  items: ComparisonItem[];
}

export interface SummaryComponent {
  type: "summary";
  title: string;
  items: string[];
}

export interface QuoteComponent {
  type: "quote";
  quote: string;
  attribution?: string;
  context?: string;
}

export interface QuizComponent {
  type: "quiz";
  anchor: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface QuestionSetQuestion {
  question: string;
  options: string[];
  answer: string;
  feedback?: string;
}

export interface QuestionSetComponent {
  type: "question_set";
  anchor: string;
  title: string;
  instructions?: string;
  questions: QuestionSetQuestion[];
  shuffle_options?: boolean;
}

export interface FreeResponseComponent {
  type: "free_response";
  anchor: string;
  title: string;
  prompt: string;
  guidance?: string;
  placeholder?: string;
}

export interface StarterCode {
  language: string;
  code: string;
}

export interface PracticeRubricItem {
  criterion: string;
  expected: string;
}

export interface PracticeTaskComponent {
  type: "practice_task";
  anchor: string;
  title: string;
  scenario?: string;
  task: string;
  steps?: string[];
  hints?: string[];
  starter_code?: StarterCode;
  solution?: string;
  rubric?: PracticeRubricItem[];
}

export interface DiagramComponent {
  type: "diagram";
  diagram_type: DiagramType;
  title: string;
  code: string;
  direction?: DiagramDirection;
  theme?: DiagramTheme;
}

export interface GlossaryTermComponent {
  type: "glossary_term";
  term: string;
  definition: string;
  context?: string;
  aliases?: string[];
}

export interface TabPanel {
  label: string;
  content: string;
}

export interface TabsComponent {
  type: "tabs";
  title: string;
  tabs: TabPanel[];
  default_tab?: string;
}

export interface AccordionItem {
  title: string;
  body: string;
}

export interface AccordionComponent {
  type: "accordion";
  title: string;
  items: AccordionItem[];
  default_open?: string;
}

export interface TimelineItem {
  label: string;
  detail: string;
  date?: string;
}

export interface TimelineComponent {
  type: "timeline";
  title: string;
  items: TimelineItem[];
  orientation: "vertical" | "horizontal";
}

export interface ChecklistComponent {
  type: "checklist";
  title: string;
  items: string[];
  storage: "session" | "local";
  reset_label?: string;
}

export interface FlashcardComponent {
  type: "flashcard";
  prompt: string;
  answer: string;
  hint?: string;
  category?: string;
}

export interface WorkedExampleComponent {
  type: "worked_example";
  title: string;
  problem: string;
  walkthrough: string[];
  solution: string;
  starter_code?: string;
  language?: string;
  takeaway?: string;
}

export interface MistakeCorrectionComponent {
  type: "mistake_correction";
  title: string;
  mistake: string;
  why_it_fails: string;
  correction: string;
  example_before?: string;
  example_after?: string;
}

export interface ResourceLink {
  label: string;
  url: string;
  description?: string;
  category?: string;
}

export interface ResourceLinksComponent {
  type: "resource_links";
  title: string;
  links: ResourceLink[];
}

export interface InstructorNoteComponent {
  type: "instructor_note";
  title: string;
  body: string;
  audience: "instructor" | "reviewer" | "both";
  timing?: string;
}

export type LectureComponent =
  | CalloutComponent
  | ConceptCardComponent
  | StepListComponent
  | CodeBlockComponent
  | ComparisonComponent
  | SummaryComponent
  | QuoteComponent
  | QuizComponent
  | QuestionSetComponent
  | FreeResponseComponent
  | PracticeTaskComponent
  | DiagramComponent
  | GlossaryTermComponent
  | TabsComponent
  | AccordionComponent
  | TimelineComponent
  | ChecklistComponent
  | FlashcardComponent
  | WorkedExampleComponent
  | MistakeCorrectionComponent
  | ResourceLinksComponent
  | InstructorNoteComponent;

export type RenderBlock =
  | Exclude<MarkdownBlock, ParsedComponentBlock>
  | {
      kind: "component";
      component: LectureComponent;
      locator: SourceLocator;
    };

export interface LectureSection {
  title: string;
  anchor: string;
  blocks: RenderBlock[];
}

export interface LectureTemplate {
  metadata: LectureMetadata;
  overview: RenderBlock[];
  objectives: string[];
  sections: LectureSection[];
  takeaways: string[];
}

export type ValidationResult =
  | {
      valid: true;
      template: LectureTemplate;
      errors: [];
    }
  | {
      valid: false;
      errors: ValidationError[];
    };
