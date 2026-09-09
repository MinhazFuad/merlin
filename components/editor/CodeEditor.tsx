'use client'

import { useEffect, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { useEditorStore } from '@/store/editorStore'
import { EditorView } from '@codemirror/view'

const lightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--surface)',
      color: 'var(--text)',
      height: '100%',
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
    },
    '.cm-content': {
      padding: '12px 0',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--paper-100)',
      borderRight: '1px solid var(--border)',
      color: 'var(--text-muted)',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--accent)',
    },
    '.cm-selectionBackground, ::selection': {
      backgroundColor: 'var(--accent-muted)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--paper-200)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(37, 99, 235, 0.04)',
    },
  },
  { dark: false }
)

interface CodeEditorProps {
  readOnly?: boolean
}

export function CodeEditor({ readOnly = false }: CodeEditorProps) {
  const { code, setCode } = useEditorStore()

  return (
    <div className="h-full overflow-hidden font-mono text-sm">
      <CodeMirror
        value={code}
        height="100%"
        extensions={[markdown()]}
        theme={lightTheme}
        onChange={(value) => !readOnly && setCode(value)}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          history: true,
          foldGutter: false,
          syntaxHighlighting: true,
        }}
        style={{ height: '100%' }}
      />
    </div>
  )
}
