import React, { useState, useEffect } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Toolbar } from './Toolbar';
import { FileTabs } from './FileTabs';
import { CodeEditor } from './CodeEditor';
import { PreviewPane } from './PreviewPane';
import { ProjectManager } from './ProjectManager';
import { SettingsPanel } from './SettingsPanel';
import { WelcomeScreen } from './WelcomeScreen';
import { Button } from '@/components/ui/button';
import { FolderOpen, Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function CodeEditorApp() {
  const {
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
  } = useEditor();

  const [fontSize, setFontSize] = useLocalStorage('editor-font-size', 14);
  const [showProjectManager, setShowProjectManager] = useState(!currentProject);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (currentProject) {
      const timer = setTimeout(() => {
        saveProject();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentProject, saveProject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'n':
            e.preventDefault();
            newProject();
            break;
          case 't':
            e.preventDefault();
            if (currentProject) {
              addFile('new-file.html', 'html');
            }
            break;
          case 'w':
            e.preventDefault();
            if (activeFileId && currentProject?.files.length > 1) {
              deleteFile(activeFileId);
            }
            break;
          case '`':
            e.preventDefault();
            // Toggle theme would be handled by the theme hook
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, currentProject, saveProject, newProject, addFile, deleteFile]);

  if (!currentProject) {
    return (
      <div className="h-screen flex flex-col">
        <Toolbar
          onSave={() => {}}
          onNewProject={() => newProject()}
          onExport={() => {}}
          onImport={importProject}
          canSave={false}
        />
        {projects.length === 0 ? (
          <WelcomeScreen onCreateProject={() => newProject()} />
        ) : (
          <div className="flex-1 flex">
            <div className="w-full max-w-2xl mx-auto">
              <ProjectManager
                projects={projects}
                currentProject={currentProject}
                onLoadProject={loadProject}
                onDeleteProject={deleteProject}
                onNewProject={newProject}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar
        onSave={saveProject}
        onNewProject={() => newProject()}
        onExport={exportProject}
        onImport={importProject}
        canSave={!!currentProject}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <div className="flex flex-col border-r border-border bg-muted/50">
          <Sheet open={showProjectManager} onOpenChange={setShowProjectManager}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="m-2 justify-start gap-2">
                <FolderOpen className="h-4 w-4" />
                Projects
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96">
              <SheetHeader>
                <SheetTitle>Project Manager</SheetTitle>
                <SheetDescription>
                  Manage your code projects and create new ones.
                </SheetDescription>
              </SheetHeader>
              <ProjectManager
                projects={projects}
                currentProject={currentProject}
                onLoadProject={(id) => {
                  loadProject(id);
                  setShowProjectManager(false);
                }}
                onDeleteProject={deleteProject}
                onNewProject={(name) => {
                  newProject(name);
                  setShowProjectManager(false);
                }}
              />
            </SheetContent>
          </Sheet>

          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="m-2 justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96">
              <SheetHeader>
                <SheetTitle>Editor Settings</SheetTitle>
                <SheetDescription>
                  Customize your coding environment.
                </SheetDescription>
              </SheetHeader>
              <SettingsPanel
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <FileTabs
            files={currentProject.files}
            activeFileId={activeFileId}
            onSelectFile={setActiveFileId}
            onCloseFile={deleteFile}
            onRenameFile={renameFile}
            onAddFile={addFile}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              {activeFile && (
                <CodeEditor
                  value={activeFile.content}
                  onChange={(value) => updateFile(activeFile.id, value)}
                  language={activeFile.language}
                  fontSize={fontSize}
                />
              )}
            </div>

            {/* Preview Pane */}
            <div className="w-1/2 border-l border-border">
              <PreviewPane files={currentProject.files} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}