export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript';
  modified: boolean;
}

export interface Project {
  id: string;
  name: string;
  files: CodeFile[];
  activeFileId: string;
  createdAt: number;
  updatedAt: number;
}

export interface EditorSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
}

export interface EditorPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
}