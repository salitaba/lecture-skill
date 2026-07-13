# Graph Report - src  (2026-07-12)

## Corpus Check
- Corpus is ~29,761 words - fits in a single context window. You may not need a graph.

## Summary
- 582 nodes · 1431 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Routes and Validation|Routes and Validation]]
- [[_COMMUNITY_Collection and Progress|Collection and Progress]]
- [[_COMMUNITY_Navigation and Headers|Navigation and Headers]]
- [[_COMMUNITY_Template Validation|Template Validation]]
- [[_COMMUNITY_Glossary and Anchors|Glossary and Anchors]]
- [[_COMMUNITY_CLI Materialization|CLI Materialization]]
- [[_COMMUNITY_Review Package Model|Review Package Model]]
- [[_COMMUNITY_Teaching Callouts|Teaching Callouts]]
- [[_COMMUNITY_Section Content Components|Section Content Components]]
- [[_COMMUNITY_Diagnostics and Progress Keys|Diagnostics and Progress Keys]]
- [[_COMMUNITY_Assessment Interaction|Assessment Interaction]]
- [[_COMMUNITY_Markdown and Worked Examples|Markdown and Worked Examples]]
- [[_COMMUNITY_Review Package Assembly|Review Package Assembly]]
- [[_COMMUNITY_Buttons and Disclosures|Buttons and Disclosures]]
- [[_COMMUNITY_Cards Diagrams and Tabs|Cards Diagrams and Tabs]]
- [[_COMMUNITY_Page Shell and Fallbacks|Page Shell and Fallbacks]]
- [[_COMMUNITY_Practice and Response Reveals|Practice and Response Reveals]]
- [[_COMMUNITY_Package Preflight|Package Preflight]]
- [[_COMMUNITY_Application Theme|Application Theme]]
- [[_COMMUNITY_Assessment Index|Assessment Index]]
- [[_COMMUNITY_Labeled Corrections|Labeled Corrections]]
- [[_COMMUNITY_Resource Links|Resource Links]]
- [[_COMMUNITY_Package Runtime Metadata|Package Runtime Metadata]]
- [[_COMMUNITY_Apple Icon|Apple Icon]]
- [[_COMMUNITY_App Icon|App Icon]]
- [[_COMMUNITY_Report Contracts|Report Contracts]]
- [[_COMMUNITY_Source Review Paths|Source Review Paths]]
- [[_COMMUNITY_Source Review Paths|Source Review Paths]]

## God Nodes (most connected - your core abstractions)
1. `repositoryPath()` - 33 edges
2. `Card()` - 22 edges
3. `validateComponent()` - 18 edges
4. `validateCollection()` - 17 edges
5. `assembleReviewPackage()` - 16 edges
6. `validateTemplateSource()` - 16 edges
7. `isRecord()` - 16 edges
8. `componentFieldError()` - 14 edges
9. `createDoctorReport()` - 14 edges
10. `useProgressOptional()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `runPackageReview()` --calls--> `assembleReviewPackage()`  [EXTRACTED]
  cli/commands/packageReview.ts → lib/lecture-template/reviewPackage.ts
- `CollectionLanding()` --calls--> `sumLectureReadingMinutes()`  [EXTRACTED]
  components/lecture-kit/CollectionLanding.tsx → lib/lecture-template/readingTime.ts
- `CollectionLandingProps` --references--> `CollectionValidationResult`  [EXTRACTED]
  components/lecture-kit/CollectionLanding.tsx → lib/lecture-template/types.ts
- `LecturePageProps` --references--> `ProgressLecture`  [EXTRACTED]
  components/lecture-kit/LecturePage.tsx → lib/lecture-template/progress.ts
- `CollectionProgressProviderProps` --references--> `ProgressLecture`  [EXTRACTED]
  components/lecture-kit/progress/CollectionProgressProvider.tsx → lib/lecture-template/progress.ts

## Communities (29 total, 4 thin omitted)

### Community 0 - "Routes and Validation"
Cohesion: 0.06
Nodes (68): Home(), runReviewSource(), runValidate(), ValidationScreen(), buildLecturePreviewTemplate(), collectLectureEntries(), isCollectionMode(), isMissingDirectory() (+60 more)

### Community 1 - "Collection and Progress"
Cohesion: 0.05
Nodes (61): AnnotationsIndexDisclosure(), CollectionLanding(), CollectionLandingProps, formatMinutes(), CollectionPrimaryAction(), fallbackTemplate(), humanizeSlug(), LearnerState (+53 more)

### Community 2 - "Navigation and Headers"
Cohesion: 0.05
Nodes (46): Icon(), IconName, paths, ProgressMeter(), ProgressMeterProps, AnswerKeyAppendix(), AnswerReviewDisclosure(), ReviewItem (+38 more)

### Community 3 - "Template Validation"
Cohesion: 0.10
Nodes (43): DiagramDirection, DiagramTheme, DiagramType, LectureComponentType, allowedCalloutVariants, allowedChecklistStorage, allowedDiagramDirections, allowedDiagramThemes (+35 more)

### Community 4 - "Glossary and Anchors"
Cohesion: 0.09
Nodes (28): CollectionGlossaryIndex(), GlossaryIndex(), GlossaryIndexProps, SectionRenderer(), uniqueAnchors(), uniqueSectionAnchors(), collectCollectionGlossary(), collectLectureGlossary() (+20 more)

### Community 5 - "CLI Materialization"
Cohesion: 0.14
Nodes (25): main(), APP_ENTRIES, getMaterializedAppDirPath(), materializeAppDir(), relinkNodeModules(), getPackageRoot(), runBuild(), RunBuildOptions (+17 more)

### Community 6 - "Review Package Model"
Cohesion: 0.08
Nodes (29): AssembleReviewPackageOptions, AssembleReviewPackageResult, collectHtmlFiles(), CreateManifestOptions, isExternalResourceUrl(), packageType, resourceLinkStatus(), reviewerFiles (+21 more)

### Community 7 - "Teaching Callouts"
Cohesion: 0.10
Nodes (19): Callout(), Comparison(), InstructorNote(), Summary(), AccordionItem, CalloutComponent, CalloutVariant, ComparisonComponent (+11 more)

### Community 8 - "Section Content Components"
Cohesion: 0.13
Nodes (12): Accordion(), Checklist(), GlossaryTerm(), glossaryAnchorsPerBlock(), RenderBlocks(), StepList(), Timeline(), AccordionComponent (+4 more)

### Community 9 - "Diagnostics and Progress Keys"
Cohesion: 0.24
Nodes (15): runDoctor(), createDoctorReport(), createProgressTrackingReport(), latestPath(), npmVersion(), pathExists(), readPackageJson(), renderDoctorReport() (+7 more)

### Community 10 - "Assessment Interaction"
Cohesion: 0.17
Nodes (10): RadioOptionGroup(), RadioOptionGroupProps, QuestionSet(), QuestionSetItem(), Quiz(), QuestionSetComponent, QuizComponent, useProgressOptional() (+2 more)

### Community 11 - "Markdown and Worked Examples"
Cohesion: 0.19
Nodes (10): CodeBlock(), Props, WorkedExample(), key(), renderBlock(), renderInline(), renderMarkdownBlocks(), CodeBlockComponent (+2 more)

### Community 12 - "Review Package Assembly"
Cohesion: 0.14
Nodes (14): assembleReviewPackage(), choosePackageDirectory(), createFilesystemSafeTimestamp(), createPackageWorksheet(), formatComponentCounts(), pathExists(), readReviewChecklist(), renderManifestCourseMetadataLines() (+6 more)

### Community 13 - "Buttons and Disclosures"
Cohesion: 0.26
Nodes (11): Button(), ButtonAsAnchor, ButtonAsButton, ButtonOwnProps, ButtonProps, ButtonSize, ButtonTone, ButtonVariant (+3 more)

### Community 14 - "Cards Diagrams and Tabs"
Cohesion: 0.17
Nodes (8): Card(), CardAltitude, CardProps, Diagram(), Tabs(), useHydrated(), DiagramComponent, TabsComponent

### Community 15 - "Page Shell and Fallbacks"
Cohesion: 0.19
Nodes (5): ConceptCard(), PageShell(), Quote(), ConceptCardComponent, QuoteComponent

### Community 16 - "Practice and Response Reveals"
Cohesion: 0.26
Nodes (9): DisclosureTrigger(), useDisclosure(), Flashcard(), useHydrated(), FreeResponse(), PracticeTask(), FlashcardComponent, FreeResponseComponent (+1 more)

### Community 17 - "Package Preflight"
Cohesion: 0.21
Nodes (12): activeTemplateExists(), buildCollectionPackageValidation(), buildLectureRecord(), captureRawEvidence(), collectComponentCounts(), collectResourceLinks(), countComponents(), formatUnknownError() (+4 more)

### Community 18 - "Application Theme"
Cohesion: 0.25
Nodes (6): bodyFont, displayFont, metadata, viewport, Theme, ThemeToggle()

### Community 19 - "Assessment Index"
Cohesion: 0.33
Nodes (4): AssessmentGroup, AssessmentIndexDisclosure(), groupAssessmentsByLecture(), AssessmentSummary

### Community 20 - "Labeled Corrections"
Cohesion: 0.33
Nodes (4): LabeledSection(), LabeledSectionProps, MistakeCorrection(), MistakeCorrectionComponent

### Community 21 - "Resource Links"
Cohesion: 0.50
Nodes (4): isExternalUrl(), ResourceLinks(), resourceUrlLabel(), ResourceLinksComponent

### Community 22 - "Package Runtime Metadata"
Cohesion: 0.67
Nodes (4): createReviewPackageManifest(), getGitDirtyStatus(), getReviewPackageRuntimeMetadata(), runMetadataCommand()

### Community 25 - "Report Contracts"
Cohesion: 0.67
Nodes (3): DoctorReport, SourceReviewWorksheet, CourseMetadataValidationResult

## Knowledge Gaps
- **96 isolated node(s):** `size`, `bodyFont`, `displayFont`, `metadata`, `viewport` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `repositoryPath()` connect `Routes and Validation` to `CLI Materialization`, `Review Package Model`, `Diagnostics and Progress Keys`, `Review Package Assembly`, `Package Preflight`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `LectureTemplate` connect `Navigation and Headers` to `Routes and Validation`, `Glossary and Anchors`, `Review Package Model`, `Teaching Callouts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Button()` connect `Buttons and Disclosures` to `Collection and Progress`, `Navigation and Headers`, `Section Content Components`, `Assessment Interaction`, `Cards Diagrams and Tabs`, `Page Shell and Fallbacks`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `size`, `bodyFont`, `displayFont` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routes and Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.05981012658227848 - nodes in this community are weakly interconnected._
- **Should `Collection and Progress` be split into smaller, more focused modules?**
  _Cohesion score 0.05328005328005328 - nodes in this community are weakly interconnected._
- **Should `Navigation and Headers` be split into smaller, more focused modules?**
  _Cohesion score 0.05407925407925408 - nodes in this community are weakly interconnected._