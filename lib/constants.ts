import type { DiagramTheme } from './validators/diagram'

export const DIAGRAM_THEMES = ['default', 'dark', 'forest', 'base', 'neutral'] as const

export const DEFAULT_THEME: DiagramTheme = 'default'

export interface LineColorPreset {
  id: string
  label: string
  color: string
}

export const LINE_COLOR_PRESETS: LineColorPreset[] = [
  { id: 'white', label: 'White (Default)', color: '#ffffff' },
  { id: 'black', label: 'Black', color: '#000000' },
  { id: 'sky', label: 'Sky Blue', color: '#38bdf8' },
  { id: 'mint', label: 'Mint Green', color: '#34d399' },
  { id: 'violet', label: 'Violet', color: '#a78bfa' },
  { id: 'amber', label: 'Amber', color: '#fbbf24' },
  { id: 'coral', label: 'Coral Rose', color: '#fb7185' },
  { id: 'slate', label: 'Muted Slate', color: '#94a3b8' },
]

export const FILL_COLOR_PRESETS: LineColorPreset[] = [
  { id: 'dark', label: 'Dark Surface', color: '#1c1c20' },
  { id: 'transparent', label: 'Outline (Transparent)', color: 'transparent' },
  { id: 'slate', label: 'Slate Blue', color: '#1e293b' },
  { id: 'emerald', label: 'Emerald Deep', color: '#064e3b' },
  { id: 'violet', label: 'Deep Violet', color: '#3b0764' },
  { id: 'white', label: 'Crisp White', color: '#ffffff' },
]

export const DEFAULT_LINE_COLOR = '#ffffff'
export const DEFAULT_FILL_COLOR = '#1c1c20'
export const DEFAULT_CANVAS_BG = 'dark' as const

/** Determine if a color is light based on perceived luminance */
export function isLightColor(color: string): boolean {
  if (!color || color === 'transparent') return false
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) || 0
    const g = parseInt(hex.substring(2, 4), 16) || 0
    const b = parseInt(hex.substring(4, 6), 16) || 0
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 150
  }
  return false
}

export const DEFAULT_DIAGRAM_CODE = `flowchart LR
  A[Start] --> B{Is it a good idea?}
  B -- Yes --> C[Do it!]
  B -- No --> D[Think again]
  D --> B`

export type TemplateCategoryId = 'all' | 'flows' | 'architecture' | 'planning' | 'analytics'

export interface TemplateCategory {
  id: TemplateCategoryId
  label: string
  description: string
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'all', label: 'All Charts', description: 'Browse all available diagram types' },
  { id: 'flows', label: 'Flows & Logic', description: 'Decision trees, workflows, and state transitions' },
  { id: 'architecture', label: 'Software Architecture', description: 'APIs, microservices, databases, and class structures' },
  { id: 'planning', label: 'Project & Planning', description: 'Timelines, Gantt charts, and Git branch workflows' },
  { id: 'analytics', label: 'Data & Metrics', description: 'Pie charts, priority quadrants, and structured breakdowns' },
]

export interface DiagramTemplateItem {
  id: string
  label: string
  category: Exclude<TemplateCategoryId, 'all'>
  badge: string
  description: string
  code: string
}

export const DIAGRAM_TEMPLATES: DiagramTemplateItem[] = [
  // ─── Flows & Logic ──────────────────────────────────────────────────────────
  {
    id: 'flowchart',
    label: 'Decision Flowchart',
    category: 'flows',
    badge: 'Flowchart',
    description: 'Branching decision tree with actions and condition checks',
    code: `flowchart TD
  Start([Start]) --> Input[/User Inputs Prompt/]
  Input --> Check{Valid Syntax?}
  Check -- Yes --> Parse[Parse Mermaid AST]
  Check -- No --> Error[Surface Inline Error]
  Parse --> Render[Render Dynamic SVG]
  Render --> Done([Ready for Export])
  Error --> Input`,
  },
  {
    id: 'state',
    label: 'State Machine',
    category: 'flows',
    badge: 'State Diagram',
    description: 'Finite state machine modeling transitions and lifecycle events',
    code: `stateDiagram-v2
  [*] --> Draft
  Draft --> Reviewing : Submit for Review
  Reviewing --> Approved : Looks Good
  Reviewing --> ChangesRequested : Request Edits
  ChangesRequested --> Draft : Update
  Approved --> Published : Deploy
  Published --> Archived : Deprecate
  Archived --> [*]`,
  },
  {
    id: 'user-journey',
    label: 'User Experience Journey',
    category: 'flows',
    badge: 'Journey',
    description: 'Map user emotions and milestones across product touchpoints',
    code: `journey
  title Onboarding to Merlin
  section Discovery
    Land on homepage: 5: User
    Inspect live preview: 4: User
  section Creation
    Sign up with Google: 5: User
    Pick starter template: 5: User
    Edit diagram code: 4: User
  section Export
    Export PNG 2x: 5: User, Merlin
    Share public link: 5: User`,
  },
  {
    id: 'mindmap',
    label: 'Product Strategy Mindmap',
    category: 'flows',
    badge: 'Mindmap',
    description: 'Radial thought map connecting core strategy, product nodes, and initiatives',
    code: `mindmap
  root((Merlin Product))
    Editor Core
      Realtime Render
      Syntax Highlighting
      Pan and Zoom
    Visual Styling
      Custom Line Strokes
      Node Fill Options
      Dark and Light Canvas
    Export Engine
      Scalable Vector SVG
      High-Res PNG
      Clean JPG
    Cloud Platform
      Supabase Auth
      Postgres Diagrams
      Public Share Links`,
  },

  // ─── Software Architecture ──────────────────────────────────────────────────
  {
    id: 'sequence',
    label: 'API Authentication Flow',
    category: 'architecture',
    badge: 'Sequence',
    description: 'Actor and service interaction sequence with request-response cycles',
    code: `sequenceDiagram
  autonumber
  actor User
  participant Client as Web Browser
  participant Supabase as Supabase Auth
  participant DB as Postgres DB

  User->>Client: Click "Sign in with Google"
  Client->>Supabase: Redirect to OAuth Consent
  Supabase-->>Client: Return Auth Code
  Client->>Supabase: exchangeCodeForSession(code)
  Supabase->>DB: Verify / upsert auth.users
  DB-->>Supabase: User session tokens
  Supabase-->>Client: Set secure HTTP cookies
  Client-->>User: Redirect to /dashboard`,
  },
  {
    id: 'er',
    label: 'Database Schema (ERD)',
    category: 'architecture',
    badge: 'ER Diagram',
    description: 'Relational database schema with keys and cardinality constraints',
    code: `erDiagram
  USERS ||--o{ DIAGRAMS : "creates"
  USERS {
    uuid id PK
    string email
    timestamp created_at
  }
  DIAGRAMS {
    uuid id PK
    uuid user_id FK
    string title
    text code
    string theme
    boolean is_public
    string share_slug UK
    timestamp updated_at
  }`,
  },
  {
    id: 'class',
    label: 'Domain Class Hierarchy',
    category: 'architecture',
    badge: 'Class Diagram',
    description: 'Object-oriented class relationships with methods and properties',
    code: `classDiagram
  class DiagramEntity {
    +UUID id
    +String title
    +String code
    +render() SVG
    +export(format) Blob
  }
  class FlowchartDiagram {
    +Direction direction
    +addNode(node)
  }
  class SequenceDiagram {
    +List~Actor~ actors
    +addMessage(from, to)
  }
  DiagramEntity <|-- FlowchartDiagram
  DiagramEntity <|-- SequenceDiagram`,
  },
  {
    id: 'c4-architecture',
    label: 'Microservices Architecture',
    category: 'architecture',
    badge: 'Architecture',
    description: 'Service topology showing clients, gateways, services, and queues',
    code: `flowchart LR
  subgraph Clients
    Web[Web App / Next.js]
    Mobile[Mobile Client]
  end

  subgraph Gateway [API Gateway]
    Proxy[Next.js Edge Proxy]
  end

  subgraph Core [Backend Services]
    Auth[Supabase Auth]
    API[Diagram API Route]
    Worker[Export Worker]
  end

  subgraph Storage [Persistence]
    DB[(Postgres DB)]
    Cache[(Redis Cache)]
  end

  Clients --> Gateway
  Proxy --> Auth
  Proxy --> API
  API --> DB
  API --> Cache
  API --> Worker`,
  },

  // ─── Project & Planning ─────────────────────────────────────────────────────
  {
    id: 'gantt',
    label: 'Release Sprint Timeline',
    category: 'planning',
    badge: 'Gantt',
    description: 'Multi-week project delivery schedule with phased milestones',
    code: `gantt
  title Merlin v1.0 Launch Schedule
  dateFormat  YYYY-MM-DD
  section Core Engine
    Mermaid renderer     :done, a1, 2026-09-01, 4d
    CodeMirror 6 setup   :done, a2, 2026-09-05, 3d
  section Auth & Storage
    Supabase auth & RLS  :done, b1, 2026-09-08, 3d
    Share slug engine    :done, b2, 2026-09-10, 2d
  section UX & Polish
    Template Hub         :active, c1, 2026-09-11, 2d
    Export pipeline QA   :c2, after c1, 2d`,
  },
  {
    id: 'gitgraph',
    label: 'Git Branching & Release',
    category: 'planning',
    badge: 'Git Graph',
    description: 'Git flow with feature branches, pull requests, and main releases',
    code: `gitGraph
  commit id: "Initial scaffold"
  branch feature/auth
  checkout feature/auth
  commit id: "Supabase SSR"
  commit id: "OAuth callback"
  checkout main
  merge feature/auth id: "Merge Auth"
  branch feature/templates
  checkout feature/templates
  commit id: "Template Gallery"
  checkout main
  merge feature/templates id: "v1.1 Release" tag: "v1.1.0"`,
  },
  {
    id: 'timeline',
    label: 'Product Roadmap Timeline',
    category: 'planning',
    badge: 'Timeline',
    description: 'Chronological timeline organizing releases and milestone deliverables',
    code: `timeline
  title Merlin Engineering Roadmap
  section 2026 Q1
    Foundation : Architecture Spike : Supabase Setup : SSR Authentication
  section 2026 Q2
    Core Engine : CodeMirror 6 : Mermaid Pipeline : Export Options
  section 2026 Q3
    Ecosystem : Template Hub : Public Share Slugs : Team Collaboration`,
  },

  // ─── Data & Metrics ─────────────────────────────────────────────────────────
  {
    id: 'pie',
    label: 'Distribution Pie Chart',
    category: 'analytics',
    badge: 'Pie Chart',
    description: 'Categorical distribution breakdown with percentages',
    code: `pie title Diagram Types Created in Merlin
  "Flowcharts" : 42
  "Sequence Diagrams" : 28
  "Architecture & ERD" : 18
  "Gantt Timelines" : 8
  "Other Charts" : 4`,
  },
  {
    id: 'quadrant',
    label: 'Feature Prioritization Matrix',
    category: 'analytics',
    badge: 'Quadrant',
    description: '2x2 value versus effort decision-making matrix',
    code: `quadrantChart
  title Feature Priority Matrix
  x-axis Low Effort --> High Effort
  y-axis Low Value --> High Value
  quadrant-1 Quick Wins
  quadrant-2 Strategic Bets
  quadrant-3 Reconsider
  quadrant-4 Low Value Traps
  "Live Preview Debounce": [0.25, 0.85]
  "Export to SVG/PNG": [0.35, 0.90]
  "Public Share Link": [0.40, 0.80]
  "Template Gallery": [0.30, 0.82]
  "Realtime Collaborative Editing": [0.90, 0.75]
  "Custom Canvas Plugins": [0.85, 0.30]`,
  },
  {
    id: 'xychart',
    label: 'Monthly Diagram Exports',
    category: 'analytics',
    badge: 'XY Chart',
    description: 'Bar and trend line visual analytics tracking export activity over time',
    code: `xychart-beta
  title "Monthly Diagram Exports"
  x-axis ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  y-axis "Total Exports" 0 --> 600
  bar [120, 220, 310, 420, 480, 560]
  line [110, 205, 290, 395, 460, 545]`,
  },
]

export const SHARE_SLUG_LENGTH = 10
export const DEBOUNCE_MS = 300
export const EXPORT_SCALES = [1, 2, 3] as const
