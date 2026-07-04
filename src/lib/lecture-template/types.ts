export type LectureLevel = "beginner" | "intermediate" | "advanced";
export type CalloutVariant = "note" | "warning" | "insight";
export type LectureComponentType =
  | "callout"
  | "concept_card"
  | "step_list"
  | "code_block"
  | "comparison"
  | "summary"
  | "quote"
  | "quiz";

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

export interface LectureCollectionEntry {
  slug: string;
  order: number;
  templatePath: string;
}

export interface LectureCollection {
  basePath: string;
  entries: LectureCollectionEntry[];
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
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export type LectureComponent =
  | CalloutComponent
  | ConceptCardComponent
  | StepListComponent
  | CodeBlockComponent
  | ComparisonComponent
  | SummaryComponent
  | QuoteComponent
  | QuizComponent;

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
