import { z } from 'zod'

export const MAX_DIAGRAM_CODE_SIZE = 100_000 // ~100 KB

export const DIAGRAM_THEMES = [
  'default',
  'dark',
  'forest',
  'base',
  'neutral',
] as const

export type DiagramTheme = (typeof DIAGRAM_THEMES)[number]

export const diagramSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or fewer')
    .trim(),
  code: z
    .string()
    .max(MAX_DIAGRAM_CODE_SIZE, `Diagram code must be under ${MAX_DIAGRAM_CODE_SIZE / 1000}KB`)
    .default(''),
  theme: z.enum(['default', 'dark', 'forest', 'base', 'neutral']).default('default'),
  is_public: z.boolean().default(false),
})

export type DiagramPayload = z.infer<typeof diagramSchema>

export const diagramUpdateSchema = diagramSchema.partial()
