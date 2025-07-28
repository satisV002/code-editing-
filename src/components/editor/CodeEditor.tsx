import React, { useRef, useEffect } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript';
  fontSize?: number;
  readOnly?: boolean;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language, 
  fontSize = 14,
  readOnly = false 
}: CodeEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure Monaco themes
    monaco.editor.defineTheme('light-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#18181b',
        'editor.lineHighlightBackground': '#f1f5f9',
        'editor.selectionBackground': '#3b82f633',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#0f172a',
      }
    });

    monaco.editor.defineTheme('dark-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#18181b',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#27272a',
        'editor.selectionBackground': '#3b82f64d',
        'editorLineNumber.foreground': '#71717a',
        'editorLineNumber.activeForeground': '#f8fafc',
      }
    });

    monaco.editor.setTheme(theme === 'dark' ? 'dark-theme' : 'light-theme');
  };

  useEffect(() => {
    if (editorRef.current) {
      // Get monaco instance from the editor
      const monaco = editorRef.current.getModel()?.getLanguageId ? 
        (window as any).monaco : 
        null;
      if (monaco?.editor) {
        monaco.editor.setTheme(theme === 'dark' ? 'dark-theme' : 'light-theme');
      }
    }
  }, [theme]);

  const editorOptions: EditorProps['options'] = {
    fontSize,
    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    automaticLayout: true,
    wordWrap: 'on',
    tabSize: 2,
    insertSpaces: true,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    padding: { top: 16, bottom: 16 },
    readOnly,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: true,
    smoothScrolling: true,
    contextmenu: true,
    selectOnLineNumbers: true,
    glyphMargin: false,
  };

  return (
    <div className="h-full w-full bg-editor border border-editor-border">
      <Editor
        height="100%"
        language={language === 'javascript' ? 'javascript' : language}
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={editorOptions}
        theme={theme === 'dark' ? 'dark-theme' : 'light-theme'}
      />
    </div>
  );
}