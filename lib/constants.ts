import type { DiagramTheme } from './validators/diagram'

export const DIAGRAM_THEMES = ['default', 'dark', 'forest', 'base', 'neutral'] as const

export const DEFAULT_THEME: DiagramTheme = 'default'

export const DEFAULT_DIAGRAM_CODE = `flowchart LR
  A[Start] --> B{Is it a good idea?}
  B -- Yes --> C[Do it!]
  B -- No --> D[Think again]
  D --> B`

export const DIAGRAM_TEMPLATES = [
  {
    id: 'flowchart',
    label: 'Flowchart',
    description: 'Basic decision flowchart',
    code: `flowchart LR
  A[Start] --> B{Decision?}
  B -- Yes --> C[Do it!]
  B -- No --> D[End]`,
  },
  {
    id: 'sequence',
    label: 'Sequence Diagram',
    description: 'Communication between actors',
    code: `sequenceDiagram
  participant A as Alice
  participant B as Bob
  A->>B: Hello Bob!
  B-->>A: Hi Alice!
  A->>B: How are you?
  B-->>A: Great!`,
  },
  {
    id: 'class',
    label: 'Class Diagram',
    description: 'Object-oriented class structure',
    code: `classDiagram
  class Animal {
    +String name
    +int age
    +makeSound()
  }
  class Dog {
    +fetch()
  }
  class Cat {
    +purr()
  }
  Animal <|-- Dog
  Animal <|-- Cat`,
  },
  {
    id: 'state',
    label: 'State Diagram',
    description: 'System state transitions',
    code: `stateDiagram-v2
  [*] --> Idle
  Idle --> Processing: start
  Processing --> Success: done
  Processing --> Error: fail
  Success --> [*]
  Error --> Idle: retry`,
  },
  {
    id: 'er',
    label: 'ER Diagram',
    description: 'Entity-relationship model',
    code: `erDiagram
  USER {
    uuid id PK
    string email
    string name
  }
  DIAGRAM {
    uuid id PK
    uuid user_id FK
    string title
    text code
  }
  USER ||--o{ DIAGRAM : "owns"`,
  },
  {
    id: 'gantt',
    label: 'Gantt Chart',
    description: 'Project timeline',
    code: `gantt
  title Project Timeline
  dateFormat  YYYY-MM-DD
  section Planning
    Research       :a1, 2024-01-01, 7d
    Design         :a2, after a1, 5d
  section Development
    Implementation :a3, after a2, 14d
    Testing        :a4, after a3, 7d`,
  },
  {
    id: 'pie',
    label: 'Pie Chart',
    description: 'Proportional data visualization',
    code: `pie title Browser Market Share
  "Chrome" : 65
  "Safari" : 19
  "Firefox" : 4
  "Edge" : 4
  "Other" : 8`,
  },
  {
    id: 'gitgraph',
    label: 'Git Graph',
    description: 'Git branching model',
    code: `gitGraph
  commit
  branch feature
  checkout feature
  commit
  commit
  checkout main
  merge feature
  commit`,
  },
] as const

export const SHARE_SLUG_LENGTH = 10
export const DEBOUNCE_MS = 300
export const EXPORT_SCALES = [1, 2, 3] as const
