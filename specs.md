# CV-Builder Product Specifications & Enhancement Plan

**Document Version:** 1.0  
**Last Updated:** May 10, 2026  
**Status:** Design & Planning Phase

---

## Table of Contents

1. [Implementation Status](#implementation-status)
2. [Recent Changes Implemented](#recent-changes-implemented)
3. [Current Feature Set](#current-feature-set)
4. [Enhancement Strategy Overview](#enhancement-strategy-overview)
5. [Detailed Feature Specifications](#detailed-feature-specifications)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Technical Considerations](#technical-considerations)

---

## Recent Changes Implemented

### 1. Auto-Save with Timestamp Badge

#### Implementation Details

**Component:** `web/src/components/AutosaveIndicator.tsx`

**Props:**
```typescript
interface AutosaveIndicatorProps {
  state: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedTime: Date | null;
}
```

**Features:**
- **Real-time status indicator** with visual feedback (icon + text)
- **Timestamp display** showing time since last save:
  - "now" (within 60 seconds)
  - "Xm ago" (up to 59 minutes)
  - "Xh ago" (1+ hours)
- **Auto-updating time display** every 30 seconds
- **Visual states with color coding:**
  - Saving: Yellow (⟳ rotating icon)
  - Saved: Green (✓ checkmark, no animation)
  - Error: Red (✕ warning, retrying)
  - Idle: Gray (◦ dot, pulsing animation)

**Styling:** Minimal badge design with 0.75rem font, semi-transparent background (rgba 5% opacity), pulse animation during save/idle states.

**Integration Point:** Rendered in ResumeForm.tsx only when in edit mode (`isEdit === true`).

---

### 2. Unsaved Changes Modal Logic Update

**Change:** Modal no longer shows when editing existing resume (autosave is managing persistence).

**Before:**
```typescript
<ConfirmBack isResumeChanged={isResumeChanged} isGuest={isGuest} />
```

**After:**
```typescript
<ConfirmBack isResumeChanged={isEdit ? false : isResumeChanged} isGuest={isGuest} />
```

**Behavior:**
- **Create Mode** (new resume): Shows "Unsaved Changes" warning when navigating away
- **Edit Mode** (existing resume): No warning (autosave is handling)
- **Guest Mode**: No warning regardless

---

### 3. Package Lock File Cleanup

**Action:** Reverted `web/package-lock.json` to clean state

**Reason:** npm install regenerated lock file with dependency reordering (no version changes), creating unnecessary git noise.

**Implementation:**
```bash
git checkout web/package-lock.json
```

---

## Current Feature Set

### Backend (Go/Gorilla Mux)

**Authentication:**
- Cookie-based JWT auth flow
- `auth.WithJWTAuth` middleware wrapper for protected routes
- User context propagation

**Resume Management:**
- CRUD operations on resume documents
- Resume metadata (title, template_name)
- Resume data storage as ordered JSON

**Database:**
- PostgreSQL via pgx/database/sql
- SQL migrations in `server/db/migrations/`
- Structured schema with users, resumes tables

### Frontend (React + TypeScript + Vite)

**Form Architecture:**
- Component-based form sections (Profile, Education, Experience, Projects, Awards, Additional, Skills, Remarks)
- Auto-resizing textarea inputs (using scrollHeight-based calculation)
- React Hook Form compatible (form state management)

**Resume Preview:**
- react-pdf/renderer for PDF generation
- Real-time preview with PDFViewer
- PDF download capability
- Hyphenation disabled (words wrap to next line instead of breaking)

**Auto-Save System:**
- 1200ms debounce on form changes
- Request queuing to prevent concurrent saves
- Payload comparison to skip redundant saves
- State tracking: `idle` → `saving` → `saved` / `error`

**Layout:**
- Split-panel design: Form editor (left) + PDF preview (right)
- Responsive: Stack on mobile, hamburger navigation
- Tailwind CSS + custom Form.css styling

---

## Enhancement Strategy Overview

### Problem Statement

**Current Limitations:**
1. **Rigid Structure**: Fixed sections with no custom sections or reordering
2. **Engineer-Focused**: Design assumes technical resume format (Projects, GitHub, etc.)
3. **Single Template**: Only "Libre Baskerville" design available
4. **Limited Content Types**: Text inputs only, no rich text formatting
5. **No Discipline Presets**: No guidance for non-technical fields

### Vision

Transform CV-Builder from a **specialized engineer resume builder** into a **flexible, multi-discipline resume platform** that supports:
- Lawyers, doctors, designers, marketers, academics, creatives, executives
- Custom sections and content types
- Visual customization (colors, fonts, layouts)
- Rich formatting and free-form content
- Template system with discipline-specific presets

---

## Detailed Feature Specifications

### Feature 1: Flexible Section Architecture

#### 1.1 Custom Sections

**Objective:** Allow users to create, rename, reorder, and delete sections beyond the fixed template.

**Design:**

**Section Model:**
```typescript
interface Section {
  id: string;           // UUID or auto-generated
  name: string;         // User-editable ("Portfolio", "Publications", "Bar Admissions")
  type: 'standard' | 'custom';
  position: number;     // Sort order
  isVisible: boolean;   // Toggle visibility on resume
  items: SectionItem[]; // Variable content
}

interface SectionItem {
  id: string;
  fields: {
    [key: string]: string | string[];
  };
}
```

**UI Changes:**

**Inline Section Interaction (no separate panel):**

Each section in the form is a self-contained, interactive unit with all controls surfaced directly within it:

- **Drag handle** (⠿ grip icon) on the left of the section header — drag to reorder sections in-place
- **Inline title editing** — clicking the section title converts it to an editable input field; pressing Enter or blurring confirms the rename
- **Visibility toggle** (eye icon) on the section header row — toggles whether the section appears in the PDF without removing it from the form
- **Delete button** (trash icon) on the section header row, shown on hover — triggers a confirmation popover inline, not a modal
- **Add Section button** — a subtle `+ Add section` row that appears below the last section, opens a small inline picker (section name input + optional template preset)

**Section Header Row Layout:**
```
[⠿] [Section Title / Editable Input]        [👁] [🗑]
```

**Add Section Inline Picker:**
- Appears as an expandable row below the last section
- Input for section name
- Optional dropdown: "Start from preset" (Education, Experience, custom blank)
- Confirm with Enter or a small checkmark button

**Section Reordering:**
- Drag-and-drop directly in the form using the grip handle
- Visual feedback: subtle highlight on hover, ghost card while dragging, drop zone indicator between sections
- Keyboard: arrow keys on focused drag handle to move sections up/down

**API Changes:**

Backend update resume endpoint should accept:
```typescript
{
  sections: Section[];
  profile: ProfileData;
  // No more hardcoded "education", "experience", etc.
}
```

**Database Migration:**
- Modify resume `data` column to support dynamic sections
- Ensure backward compatibility with existing resumes (auto-migrate on read)

#### 1.2 Default Sections (Pre-built Templates)

**Standard sections** users can add with one click:

| Discipline | Default Sections |
|---|---|
| **Engineering** | Profile, Education, Experience, Projects, Technical Skills, Certifications, Remarks |
| **Design/Creative** | Profile, Education, Experience, Portfolio, Skills, Awards, Tools & Software |
| **Healthcare** | Profile, Education, Experience, Licenses & Certifications, Clinical Skills, Publications |
| **Law** | Profile, Education, Experience, Bar Admissions, Publications, Awards |
| **Marketing/Sales** | Profile, Education, Experience, Key Achievements, Skills, Certifications, Languages |
| **Academic** | Profile, Education, Publications, Research, Teaching, Awards |

Each template section pre-configures common field names.

---

### Feature 2: Version History

> **Recommendation: Version History over Undo**
>
> Both undo and version history address "I made a mistake, I want to go back." The question is scope:
>
> - **Undo/Redo** is session-scoped — it disappears when the page refreshes, and native browser `Ctrl+Z` already handles in-field text edits. A custom undo stack would only add value for structural changes (section reorder, delete), which are infrequent and already covered by a confirmation step.
> - **Version History** is persistent — it survives across sessions, devices, and days. Because autosave already runs every 1200ms, creating periodic snapshots is a natural extension. Users frequently return to a resume days later and want to recover an older state.
>
> **Decision: Version History** is the right Feature 2. It is more uniquely valuable to this product, complements the autosave system already in place, and covers a wider time horizon than undo ever could. In-session undo for text fields is already provided by the browser natively.

#### 2.1 Version Snapshots

**Objective:** Automatically store resume snapshots at meaningful points so users can browse and restore past states.

**Snapshot Triggers:**
- Every autosave (deduplicated — only stored if content changed from previous snapshot)
- Manual "Save Version" action (user-named checkpoint)
- Before destructive operations (section delete, section reorder)

**Retention Policy:**
- Keep the last **20 auto-save snapshots**
- Keep all **manual (named) checkpoints** indefinitely (up to a per-user cap of 50)
- Oldest auto-save snapshots are pruned when the cap is reached

**Data Model:**
```typescript
interface ResumeVersion {
  id: string;
  resumeId: string;
  createdAt: Date;
  label: string | null;       // null = auto-save, string = user-named
  isManual: boolean;
  snapshot: ResumeData;       // full resume payload at that point
  changesSummary: string | null; // optional: "Added 2 items to Experience"
}
```

**Backend:**
- New table `resume_versions` (see DB schema in Technical Considerations)
- `POST /api/resumes/{id}/versions` — create a named checkpoint
- `GET /api/resumes/{id}/versions` — list versions (metadata only, no snapshots)
- `GET /api/resumes/{id}/versions/{versionId}` — fetch a specific snapshot
- `POST /api/resumes/{id}/versions/{versionId}/restore` — restore snapshot as current resume data

#### 2.2 Version History UI

**Location:** Collapsible panel accessible from the resume editor toolbar (clock icon), or from the "..." overflow menu.

**Version Timeline:**
```
Version History
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
★ "Before LinkedIn update"   [Restore]
  Today, 3:45 PM

  Auto-save                  [Preview] [Restore]
  Today, 3:30 PM

  Auto-save                  [Preview] [Restore]
  Today, 2:10 PM

  Auto-save                  [Preview] [Restore]
  Yesterday, 5:55 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[+ Save Named Checkpoint]
```

- **Preview** — opens a read-only PDF preview of that version in a modal/drawer without restoring it
- **Restore** — replaces current resume data with the snapshot; current state is auto-saved as a new snapshot before the restore so it is not lost
- **Save Named Checkpoint** — prompts for an optional label and saves the current state immediately

**Visual design:** Minimal timeline list, no separate page navigation. Named checkpoints are visually distinguished (star icon, bold label).

#### 2.3 Integration with Autosave

The existing autosave flow is extended to write a version snapshot after each successful save, subject to the deduplication and retention rules above. No additional debounce is needed — version writes happen server-side as part of the same save transaction.

```
form change → 1200ms debounce → PUT /resumes/{id} → (if data changed) INSERT resume_versions
```

#### 2.4 Version Comparison

**Objective:** Let users see exactly what changed between two versions at a glance.

**UI:** A "Compare" button next to each version in the timeline opens a diff panel beside (or below) the timeline list.

```
Compare v4 ↔ v5
━━━━━━━━━━━━━━━━━━
Experience > Description:
- "Helped build API"
+ "Led architecture of microservices API handling 10M requests/day"

Skills > Added:
+ "System Design"
```

**Implementation notes:**
- Field-level diff (not line-level): compare each named field within each section between the two snapshots
- Additions shown in green, removals in red, unchanged fields hidden by default with a "Show unchanged" toggle
- Comparison is read-only; user can choose to restore either compared version from within the panel
- Component: `web/src/components/VersionHistory/VersionCompare.tsx`

---

### Feature 3: Rich Text & Free-Form Content

#### 3.1 Template System

**Objective:** Support different visual designs (currently hardcoded to Libre Baskerville).

**Available Templates:**

| Template | Design | Best For | Features |
|---|---|---|---|
| **Libre** (current) | Elegant serif | Traditional/Conservative | Single column, serif font, minimal |
| **Modern** | Clean sans-serif | Tech/Startups | Two-column, card-based sections |
| **Minimal** | Ultra-simple | ATS optimization | Plain text, no styling |
| **Executive** | Professional | Leadership/Management | Narrative format, summary focus |
| **Creative** | Colorful sidebar | Design/Marketing | Accent color, visual emphasis |
| **Academic** | Structured | Research/Academia | Bibliography format, publication list |

#### 3.2 Template Selection Flow

**Create Resume Page:**
```
Step 1: Choose Discipline
- Engineering
- Design
- Healthcare
- Law
- Marketing
- Academic

Step 2: Choose Template
[Template Preview Cards - click to select]
- Libre (Classic, Elegant)
- Modern (Clean, Tech-Focused)
- Creative (Bold, Design-Forward)
- Minimal (Simple, ATS-Safe)

Step 3: Customize (Optional)
- Pick color accent
- Pick font (if template supports)
- Density (spacing)

[Create Resume Button]
```

**Template Switching (After Creation):**
- Settings panel in resume editor
- "Change Template" dropdown
- Live preview on selection
- Confirm with "Apply" button (cannot undo, but can switch back)

#### 3.3 Template Architecture (Backend)

**Component Structure:**
```
web/src/components/Templates/
├── TemplateRegistry.ts       (template metadata + list)
├── Libre.tsx                 (current design)
├── Modern.tsx                (new)
├── Creative.tsx              (new)
├── Minimal.tsx               (new)
└── utils/
    ├── applyTheme.ts         (color/font injection)
    └── renderSection.ts      (generic section renderer)
```

**Template Interface:**
```typescript
interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  layout: 'single-column' | 'two-column' | 'sidebar';
  supportsColors: boolean;
  supportsFonts: string[];
  Component: React.ComponentType<CVProps>;
}
```

---

### Feature 4: Discipline-Specific Presets & Smart Suggestions

#### 4.1 Discipline Profiles

**Objective:** Provide tailored guidance, default sections, and field suggestions per professional discipline.

**Discipline Config Structure:**

```typescript
interface DisciplineProfile {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultSections: Section[];
  fieldSuggestions: {
    [sectionName]: string[];
  };
  examples: ResumeSample[];
  tips: string[];
  commonSkills: string[];
}
```

**Engineering Discipline:**
```typescript
{
  id: 'engineering',
  name: 'Software Engineering',
  defaultSections: [
    { name: 'Profile', fields: ['name', 'email', 'phone', 'location'] },
    { name: 'Technical Skills', fields: ['category', 'skills_list'] },
    { name: 'Experience', fields: ['company', 'title', 'date_range', 'description'] },
    { name: 'Projects', fields: ['name', 'description', 'tech_stack', 'link'] },
    { name: 'Education', fields: ['school', 'degree', 'date', 'gpa'] },
  ],
  fieldSuggestions: {
    'Experience': [
      'Led team of X engineers',
      'Reduced load time by X%',
      'Deployed to production',
      'Mentored junior developers'
    ]
  },
  commonSkills: ['JavaScript', 'Python', 'Go', 'React', 'Node.js', 'PostgreSQL', ...],
  tips: [
    'Include GitHub link in profile',
    'Use quantifiable metrics (reduced latency by 40%)',
    'List frameworks and languages clearly'
  ]
}
```

**Healthcare Discipline:**
```typescript
{
  id: 'healthcare',
  name: 'Healthcare Professional',
  defaultSections: [
    { name: 'Profile', fields: ['name', 'email', 'phone', 'location', 'license_number'] },
    { name: 'Licenses & Certifications', fields: ['credential', 'issuer', 'date'] },
    { name: 'Experience', fields: ['facility', 'title', 'specialty', 'date_range', 'description'] },
    { name: 'Education', fields: ['institution', 'degree', 'specialization', 'graduation_date'] },
    { name: 'Clinical Skills', fields: ['skill', 'proficiency'] },
    { name: 'Publications', fields: ['title', 'journal', 'date'] },
  ],
  fieldSuggestions: {
    'Experience': [
      'Managed patient care for X patients',
      'Collaborated with multidisciplinary team',
      'Improved patient outcomes',
      'Implemented clinical protocols'
    ]
  },
  commonSkills: ['Patient Care', 'Clinical Assessment', 'EMR', 'Surgery', 'Diagnosis', ...],
  tips: [
    'Include license numbers and expiration dates',
    'Highlight patient volume and complexity',
    'List clinical certifications prominently'
  ]
}
```

**Similar configs for:** Design, Law, Marketing, Academic, Creative

#### 4.2 Smart Field Suggestions

**UI Implementation:**

When user focuses on a text field:
```
[Field Name Input]  [? Help Icon - shows suggestion]
[RichTextEditor]

// On hover help icon or after 2 seconds idle:
Suggestion Panel:
━━━━━━━━━━━━━━━━━━
💡 Common phrases for this role:
• Led a team of 5+ engineers
• Improved API response time by 30%
• Designed and implemented X feature
• Mentored junior developers

[Use] [Dismiss] [More]
```

**Data Structure:**
```typescript
interface FieldSuggestion {
  disciplineId: string;
  sectionName: string;
  fieldName: string;
  suggestions: string[];
  priority: 'high' | 'medium' | 'low';
}
```

---

### Feature 5: Visual Design Flexibility

#### 5.1 Color & Theme Customization

**Objective:** Let users personalize resume appearance without coding.

**Customization Options:**

**Color Picker:**
- Primary accent color (affects headers, section titles, links)
- Secondary accent color (optional, for template variants)
- Text color (dark, medium, light)
- Live preview in background

**Font Selection:**
```
Primary Font (header):
○ Libre Baskerville (serif, elegant)
○ Inter (sans-serif, clean)
○ Playfair Display (serif, bold)
○ Roboto (sans-serif, professional)

Body Font:
○ Lato (sans-serif)
○ Source Sans Pro (sans-serif)
○ EB Garamond (serif)
```

**Layout Density:**
- Compact (narrow spacing, smaller margins) - fits more content
- Standard (default)
- Spacious (generous margins, breathing room) - premium look

**Column Layout (for supported templates):**
- Single column
- Two-column (experience/skills side-by-side)
- Sidebar layout (contact/skills on left, content on right)

#### 5.2 Settings Panel

**Location:** Resume editor top-right, collapsible panel

**Sections:**
- **Appearance**
  - Primary accent color picker
  - Font selector dropdowns
  - Density slider
  - Layout toggle (single/two-column)
- **Template**
  - Current template (read-only)
  - Change template button
- **Visibility**
  - Show/hide specific sections
  - Show/hide specific fields

**Save Behavior:**
- Settings auto-saved to resume metadata
- Persist across sessions
- Export settings with PDF/JSON

---

### Feature 6: Smart Content Suggestions

#### 6.1 Context-Aware Hints

**Objective:** Help users write better content for their discipline without being prescriptive.

**Implementation:**

**Help Context Menu:**
```
When user selects text field in "Experience > Description":
// Card appears after 2 seconds of typing OR on demand

Tips for Your Role: [Software Engineer]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Use action verbs: Led, Built, Designed, Optimized
✓ Include metrics: "reduced latency by 40%"
✓ Quantify impact: "served 10M users"
✗ Avoid: "responsible for", "helped with"

Example phrases:
• Architected microservices using Go and PostgreSQL
• Reduced API latency from 500ms to 100ms
• Led migration from monolith to distributed system
• Mentored 3 junior engineers

[Show more examples] [Dismiss]
```

**Per-Discipline Tips Database:**

```typescript
const disciplineGuidance = {
  engineering: {
    actionVerbs: ['Built', 'Architected', 'Optimized', 'Designed', 'Deployed', ...],
    metrics: ['% improvement', '# users served', 'response time', 'uptime %', ...],
    antiPatterns: ['responsible for', 'helped with', 'involved in', ...],
    templates: [
      'Designed {noun} using {technology}',
      'Reduced {metric} by {percentage}%',
      'Led migration from {old} to {new}'
    ]
  },
  healthcare: {
    actionVerbs: ['Diagnosed', 'Treated', 'Managed', 'Collaborated', 'Implemented', ...],
    metrics: ['# patients', 'case complexity', 'patient satisfaction %', ...],
    templates: [
      'Managed care for {# patients} across {specialty}',
      'Implemented {protocol} improving {outcome}',
      'Collaborated with {team} on {initiative}'
    ]
  },
  // ... similar for other disciplines
}
```

---

### Feature 7: Import & Export Flexibility

#### 7.1 Import Sources

**LinkedIn Import:**
- OAuth connector to LinkedIn profile
- Auto-parse profile, experience, education, skills
- Map fields to CV-builder sections
- Merge with existing resume or create new

**Google Docs Integration:**
- Connect to Google Drive
- Select resume document
- Parse headers/sections automatically
- Intelligent field mapping

**JSON Import (Existing):**
- Load previously exported resume
- Supports old and new data formats

**PDF Upload (Future):**
- AI-powered PDF parsing (OCR + NLP)
- Extract sections, dates, skills
- Manual review and correction before saving

#### 7.2 Export Options

**Current:**
- PDF download (with selected template)
- JSON download (full data)

**New:**

**Markdown Export:**
```
# John Doe
📧 john@example.com | 📱 (555) 123-4567 | 📍 San Francisco

## Technical Skills
- **Languages:** JavaScript, Python, Go
- **Frameworks:** React, Node.js
- **Databases:** PostgreSQL, MongoDB

## Experience
### Senior Engineer, Acme Corp (2022 - Present)
- Led migration to microservices, reducing latency by 40%
- Mentored 3 junior engineers
```

**LaTeX Export:**
```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\title{John Doe -- Resume}
\begin{document}
\section{Technical Skills}
Languages: JavaScript, Python, Go
...
\end{document}
```

**HTML Export:**
- Standalone HTML file with embedded CSS
- Responsive design, works on any device
- Easy to host on personal website

**ATS-Safe Plain Text:**
- Removes all formatting
- Single column layout
- Ensures parseable by applicant tracking systems

---

### Feature 8: Collaboration & Feedback

#### 8.1 Share & Feedback Mode

**Objective:** Get feedback on resume without sharing edit access.

**Share Link:**
- Generate public link to resume (view-only)
- Configurable expiration date
- Disable after download (optional)

**Feedback Mode (Optional Auth):**
- Recipient can leave comments on specific fields
- Highlight text, add feedback bubble
- Export feedback as document
- Original creator reviews comments in sidebar

**UI Pattern:**
```
Share Resume Panel:
━━━━━━━━━━━━━━━━━━
Generate Link: [Generate Public Link]
Link: https://cvbuilder.app/preview/abc123xyz

Feedback Options:
☑ Allow feedback comments
☐ Require login to view
☐ Expire link after 7 days

Shared With: [List of emails]
```

---

### Feature 9: ATS Compliance

#### 9.1 ATS Mode

**Objective:** Generate ATS-friendly plain-text version for blind applications.

**ATS-Safe Mode:**
- Single column layout
- No colors, images, special formatting
- Plain fonts (Arial, Times New Roman)
- Clear section headers (ALL CAPS or simple formatting)
- Compatible with 90%+ of ATS systems

**UI:**
```
Resume Settings
━━━━━━━━━━━━━━━━━━
☐ ATS Mode (Strips formatting for applicant tracking)

When enabled:
- PDF export becomes plain text PDF
- No colors or graphics
- Standard fonts only
- Single column layout
```

#### 9.2 ATS Validation Warnings

**Real-time checks:**
- ⚠️ "Unusual characters detected (may confuse ATS)" → highlights problem area
- ⚠️ "Very long bullet point (ATS may truncate)" → suggest breaking up
- ⚠️ "Date format should be MM/YYYY or YYYY-MM" → format suggestion
- ✓ "ATS-friendly format detected" → green check

---

### Feature 10: Dynamic Content Blocks

#### 10.1 Block System Architecture

**Objective:** Replace rigid form structure with flexible blocks that users can arrange freely.

**Block Types:**

| Block | Use Case | Fields |
|---|---|---|
| **Text Block** | Free-form writing | Content (RichText) |
| **List Block** | Bullet points, skills | Items (array of RichText) |
| **Timeline Block** | Jobs, education | Title, Dates, Description |
| **Metrics Block** | Sales, achievements | Label, Value pairs |
| **Skills Grid** | Skill tags/badges | Skills (array), Proficiency (optional) |
| **Link Block** | Portfolio, GitHub | URL, Label, Thumbnail (opt) |
| **Table Block** | Structured data | Headers, Rows |

**Block Model:**
```typescript
interface ContentBlock {
  id: string;
  type: BlockType;
  position: number;
  data: BlockData;
  visibility: boolean;
}

type BlockType = 'text' | 'list' | 'timeline' | 'metrics' | 'skills' | 'link' | 'table';

type BlockData = 
  | { content: string }                    // TextBlock
  | { items: string[] }                    // ListBlock
  | { title, dateFrom, dateTo, description } // TimelineBlock
  | { metrics: Array<{label, value}> }    // MetricsBlock
  | { skills: string[], proficiency? }    // SkillsBlock
  | { url: string, label: string, thumbnail?: string } // LinkBlock
  | { headers: string[], rows: string[][] }; // TableBlock
```

#### 10.2 Block-Based Form Layout

**Section Rendering:**
```
[Section Header] [+ Add Block] [Edit Section] [Delete Section]

[Draggable] Text Block
╔════════════════════════╗
║ Free-form content area ║
╚════════════════════════╝
[Edit] [Delete] [↑↓ Reorder]

[Draggable] Timeline Block
╔════════════════════════╗
║ Senior Engineer        ║
║ 2022 - Present         ║
║ Acme Corp              ║
║ Led migration...       ║
╚════════════════════════╝
[Edit] [Delete] [↑↓ Reorder]

[Draggable] Skills Block
╔════════════════════════╗
║ JavaScript (Expert)    ║
║ Python (Intermediate)  ║
║ Go (Beginner)          ║
╚════════════════════════╝
[Edit] [Delete] [↑↓ Reorder]
```

**Add Block Dialog:**
```
Select Block Type:
[Text] [List] [Timeline] [Metrics] [Skills] [Link] [Table]

Block Configuration:
[Form varies by type]

[Create Block] [Cancel]
```

#### 10.3 Drag-and-Drop Reordering

**Implementation:**
- React Beautiful DnD or Dnd-kit library
- Drag handle (⋮⋮) on left of each block
- Visual feedback: highlight zone on hover, ghost element while dragging
- Keyboard support: arrow keys to move

**Behavior:**
- Can reorder within section
- Can move blocks between sections (opt-in per template)
- Undo/redo support for block operations

---

## Implementation Roadmap

### Phase 1: Core Flexibility (Months 1-2)

**Focus:** Remove engineer bias, support any discipline

**Deliverables:**
1. Custom sections (add, rename, reorder, delete)
2. Discipline profiles (5 initial: Engineering, Design, Healthcare, Law, Marketing)
3. Smart field suggestions (context-aware tips)
4. Rich text editor (bold, italic, lists)
5. Multiple template system (Libre, Modern, Minimal - 3 templates)

**Dependencies:**
- TipTap editor integration
- Custom section schema migration
- Discipline config database

**Estimated Effort:** 120 story points

**Success Metrics:**
- Support 5+ professional disciplines
- Users can create custom sections
- 50% reduction in complaints about "too engineer-focused"

---

### Phase 2: Visual Customization (Months 2-3)

**Focus:** Let users personalize appearance

**Deliverables:**
1. Color picker (primary, secondary, text colors)
2. Font selector (3-5 font options per template)
3. Layout density slider (compact/standard/spacious)
4. Template switching UI
5. Settings persistence

**Dependencies:**
- react-color library for color picker
- Google Fonts integration
- Template theming system

**Estimated Effort:** 80 story points

**Success Metrics:**
- 80% of users customize at least one design element
- Time to customize < 2 minutes

---

### Phase 3: Advanced Features (Months 3-4)

**Focus:** Collaboration, version history, ATS compliance

**Deliverables:**
1. Share & feedback mode
2. ATS compliance checker & ATS-safe export
3. Import from LinkedIn
4. Markdown/LaTeX/HTML export formats

**Dependencies:**
- LinkedIn OAuth setup
- ATS validation rules engine

**Estimated Effort:** 100 story points

**Success Metrics:**
- 40% of users share resume for feedback
- ATS mode catches 95%+ of formatting issues

---

### Phase 4: Block System & Final Polish (Months 4-5)

**Focus:** Ultimate flexibility with block-based editor

**Deliverables:**
1. Dynamic content blocks (text, list, timeline, metrics, skills, link)
2. Drag-and-drop block reordering
3. Block type converter (e.g., list → timeline)
4. Block templates per discipline
5. Performance optimization for large resumes

**Dependencies:**
- Dnd-kit library
- Block renderer system
- Data migration scripts

**Estimated Effort:** 140 story points

**Success Metrics:**
- Users can build any resume structure
- NPS score increases to 8.0+
- Support tickets about "too rigid" drop to near-zero

---

## Technical Considerations

### Database Schema Changes

**Current:**
```sql
CREATE TABLE resumes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  template_name VARCHAR(50),
  title VARCHAR(255),
  data JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Future (with flexibility):**
```sql
ALTER TABLE resumes ADD COLUMN
  template_version INT DEFAULT 2;

ALTER TABLE resumes MODIFY COLUMN
  data JSONB, -- now supports flexible section structure

CREATE TABLE resume_versions (
  id SERIAL PRIMARY KEY,
  resume_id INT REFERENCES resumes(id),
  version INT,
  data JSONB,
  change_summary VARCHAR(500),
  created_at TIMESTAMP,
  is_auto_save BOOLEAN DEFAULT false
);

CREATE TABLE resume_settings (
  id SERIAL PRIMARY KEY,
  resume_id INT REFERENCES resumes(id),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  font_primary VARCHAR(100),
  font_body VARCHAR(100),
  layout_density ENUM('compact', 'standard', 'spacious'),
  column_layout ENUM('single', 'two-column', 'sidebar'),
  ats_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMP
);

CREATE TABLE discipline_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  config JSONB, -- discipline defaults, suggestions, templates
  created_at TIMESTAMP
);
```

### Frontend Architecture

**New Component Structure:**
```
web/src/
├── components/
│   ├── Form/
│   │   ├── Form.tsx (existing)
│   │   ├── AutoResizeTextarea.tsx (existing)
│   │   ├── RichTextEditor.tsx (new)
│   │   └── BlockEditor/
│   │       ├── BlockEditor.tsx (new)
│   │       ├── TextBlock.tsx (new)
│   │       ├── ListBlock.tsx (new)
│   │       ├── TimelineBlock.tsx (new)
│   │       └── ...
│   ├── Settings/
│   │   ├── ResumeSettings.tsx (new)
│   │   ├── ColorPicker.tsx (new)
│   │   └── FontSelector.tsx (new)
│   ├── Templates/
│   │   ├── Libre.tsx (existing, refactored)
│   │   ├── Modern.tsx (new)
│   │   ├── Minimal.tsx (new)
│   │   ├── TemplateRegistry.ts (new)
│   │   └── utils/ (new)
│   └── VersionHistory/
│       ├── VersionTimeline.tsx (new)
│       └── VersionCompare.tsx (new)
├── hooks/
│   ├── useRichTextEditor.ts (new)
│   ├── useBlockEditor.ts (new)
│   ├── useDisciplineGuidance.ts (new)
│   └── useVersionHistory.ts (new)
├── contexts/
│   ├── DisciplineContext.tsx (new)
│   └── TemplateContext.tsx (new)
└── services/
    ├── disciplineService.ts (new)
    ├── importService.ts (new)
    └── exportService.ts (new)
```

### API Endpoints

**New Endpoints:**

```
POST   /api/resumes/{id}/sections
GET    /api/resumes/{id}/sections/{sectionId}
PATCH  /api/resumes/{id}/sections/{sectionId}
DELETE /api/resumes/{id}/sections/{sectionId}

GET    /api/resumes/{id}/versions
GET    /api/resumes/{id}/versions/{versionId}
POST   /api/resumes/{id}/versions/{versionId}/restore

POST   /api/resumes/{id}/settings
GET    /api/resumes/{id}/settings

GET    /api/disciplines
GET    /api/disciplines/{disciplineId}

POST   /api/import/linkedin
POST   /api/import/google-docs
POST   /api/export/{resumeId}/markdown
POST   /api/export/{resumeId}/latex
POST   /api/export/{resumeId}/html
POST   /api/export/{resumeId}/txt

POST   /api/resumes/{id}/share
POST   /api/resumes/{id}/share/{shareId}/feedback
```

### Performance & Scalability

**Concerns:**
- Large JSON documents (many custom sections) → pagination/chunking
- Real-time collaboration (future) → WebSocket infrastructure
- PDF rendering with rich content → client-side processing

**Mitigation:**
- Lazy-load sections (only render visible sections in editor)
- Cache compiled PDF templates
- Debounce autosave (already implemented: 1200ms)
- Use react-window for large section lists

### Security & Privacy

**Access Control:**
- Verify user owns resume before returning/modifying
- Share links should use secure tokens (UUID v4)
- Feedback links should be ephemeral

**Data:**
- Don't expose discipline configs with sensitive info
- Sanitize HTML from rich text editor (DOMPurify)
- Store passwords securely (existing auth)

---

## Success Criteria

### User Adoption
- [ ] 60%+ of new users select non-engineering discipline on signup
- [ ] 40%+ use custom sections
- [ ] 25%+ customize colors/fonts

### Product Quality
- [ ] NPS score 7.5+
- [ ] Support tickets about "too rigid" < 5% of total
- [ ] PDF generation time < 2 seconds

### Technical
- [ ] All endpoints have <100ms latency (p99)
- [ ] Autosave success rate > 99%
- [ ] No data loss incidents
- [ ] TypeScript strict mode enforced

---

## Future Roadmap (Beyond Phase 4)

1. **AI Content Generation:** Generate bullet points from role + company
2. **Real-time Collaboration:** Multiple users editing same resume
3. **Mobile App:** Native iOS/Android for on-the-go editing
4. **Integrated Analytics:** Track resume views, PDF downloads, profile page clicks
5. **Marketplace:** Buy/sell professional templates from designers
6. **Headless API:** Third-party integrations (job boards, recruiters)

---

**Document End**
