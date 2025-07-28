import { useState, useCallback } from 'react';
import { CodeFile, Project } from '@/types/editor';
import { useLocalStorage } from './useLocalStorage';
import { saveAs } from 'file-saver';

export function useEditor() {
  const [projects, setProjects] = useLocalStorage<Project[]>('code-editor-projects', []);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeFileId, setActiveFileId] = useState<string>('');

  const createFile = useCallback((name: string, language: 'html' | 'css' | 'javascript'): CodeFile => ({
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    content: getDefaultContent(language),
    language,
    modified: false,
  }), []);

  const createProject = useCallback((name: string): Project => {
    const htmlFile = createFile('index.html', 'html');
    const cssFile = createFile('styles.css', 'css');
    const jsFile = createFile('script.js', 'javascript');

    return {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      files: [htmlFile, cssFile, jsFile],
      activeFileId: htmlFile.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }, [createFile]);

  const newProject = useCallback((name: string = 'New Project') => {
    const project = createProject(name);
    setProjects(prev => [...prev, project]);
    setCurrentProject(project);
    setActiveFileId(project.activeFileId);
  }, [createProject, setProjects]);

  const loadProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      setActiveFileId(project.activeFileId);
    }
  }, [projects]);

  const saveProject = useCallback(() => {
    if (!currentProject) return;

    const updatedProject = { ...currentProject, updatedAt: Date.now() };
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    setCurrentProject(updatedProject);
  }, [currentProject, setProjects]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setActiveFileId('');
    }
  }, [currentProject, setProjects]);

  const addFile = useCallback((name: string, language: 'html' | 'css' | 'javascript') => {
    if (!currentProject) return;

    const newFile = createFile(name, language);
    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      activeFileId: newFile.id,
      updatedAt: Date.now(),
    };

    setCurrentProject(updatedProject);
    setActiveFileId(newFile.id);
  }, [currentProject, createFile]);

  const updateFile = useCallback((fileId: string, content: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.map(file =>
        file.id === fileId
          ? { ...file, content, modified: true }
          : file
      ),
      updatedAt: Date.now(),
    };

    setCurrentProject(updatedProject);
  }, [currentProject]);

  const renameFile = useCallback((fileId: string, newName: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.map(file =>
        file.id === fileId
          ? { ...file, name: newName, modified: true }
          : file
      ),
      updatedAt: Date.now(),
    };

    setCurrentProject(updatedProject);
  }, [currentProject]);

  const deleteFile = useCallback((fileId: string) => {
    if (!currentProject || currentProject.files.length <= 1) return;

    const fileIndex = currentProject.files.findIndex(f => f.id === fileId);
    const updatedFiles = currentProject.files.filter(f => f.id !== fileId);
    let newActiveFileId = activeFileId;

    if (fileId === activeFileId) {
      newActiveFileId = updatedFiles[Math.max(0, fileIndex - 1)]?.id || updatedFiles[0]?.id;
    }

    const updatedProject = {
      ...currentProject,
      files: updatedFiles,
      activeFileId: newActiveFileId,
      updatedAt: Date.now(),
    };

    setCurrentProject(updatedProject);
    setActiveFileId(newActiveFileId);
  }, [currentProject, activeFileId]);

  const exportProject = useCallback(() => {
    if (!currentProject) return;

    const projectData = JSON.stringify(currentProject, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    saveAs(blob, `${currentProject.name}.json`);
  }, [currentProject]);

  const importProject = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target?.result as string);
        const importedProject: Project = {
          ...projectData,
          id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          updatedAt: Date.now(),
        };
        setProjects(prev => [...prev, importedProject]);
        setCurrentProject(importedProject);
        setActiveFileId(importedProject.activeFileId);
      } catch (error) {
        console.error('Failed to import project:', error);
      }
    };
    reader.readAsText(file);
  }, [setProjects]);

  const activeFile = currentProject?.files.find(f => f.id === activeFileId);

  return {
    projects,
    currentProject,
    activeFile,
    activeFileId,
    setActiveFileId,
    newProject,
    loadProject,
    saveProject,
    deleteProject,
    addFile,
    updateFile,
    renameFile,
    deleteFile,
    exportProject,
    importProject,
  };
}

function getDefaultContent(language: 'html' | 'css' | 'javascript'): string {
  switch (language) {
    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>Welcome to your new project!</p>
        <button id="clickMe">Click me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
    case 'css':
      return `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #0056b3;
}`;
    case 'javascript':
      return `// Welcome to your JavaScript file!
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickMe');
    let clickCount = 0;
    
    button.addEventListener('click', function() {
        clickCount++;
        button.textContent = \`Clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
        
        if (clickCount === 5) {
            button.style.backgroundColor = '#28a745';
            button.textContent = 'Great job!';
        }
    });
    
    console.log('JavaScript loaded successfully!');
});`;
    default:
      return '';
  }
}