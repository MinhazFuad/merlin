import { create } from 'zustand'
import type { DiagramTheme } from '@/lib/validators/diagram'
import { DEFAULT_DIAGRAM_CODE, DEFAULT_THEME } from '@/lib/constants'

interface EditorState {
  code: string
  theme: DiagramTheme
  isDirty: boolean
  isSaving: boolean
  diagramId: string | null
  title: string
  forceRenderTrigger: number
  // Actions
  setCode: (code: string) => void
  setTheme: (theme: DiagramTheme) => void
  setDirty: (dirty: boolean) => void
  setSaving: (saving: boolean) => void
  setDiagramId: (id: string | null) => void
  setTitle: (title: string) => void
  forceRender: () => void
  reset: () => void
  loadDiagram: (diagram: {
    id: string
    title: string
    code: string
    theme: DiagramTheme
  }) => void
}

const initialState = {
  code: DEFAULT_DIAGRAM_CODE,
  theme: DEFAULT_THEME,
  isDirty: false,
  isSaving: false,
  diagramId: null,
  title: 'Untitled diagram',
  forceRenderTrigger: 0,
}

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setCode: (code) => set({ code, isDirty: true }),
  setTheme: (theme) => set({ theme, isDirty: true }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  setDiagramId: (diagramId) => set({ diagramId }),
  setTitle: (title) => set({ title, isDirty: true }),
  forceRender: () => set((s) => ({ forceRenderTrigger: s.forceRenderTrigger + 1 })),
  reset: () => set(initialState),
  loadDiagram: (diagram) =>
    set({
      diagramId: diagram.id,
      title: diagram.title,
      code: diagram.code,
      theme: diagram.theme as DiagramTheme,
      isDirty: false,
    }),
}))
