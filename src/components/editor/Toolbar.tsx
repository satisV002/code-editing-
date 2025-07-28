import React from 'react';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Settings, 
  Sun, 
  Moon,
  Plus,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ToolbarProps {
  onSave: () => void;
  onNewProject: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  canSave: boolean;
}

export function Toolbar({
  onSave,
  onNewProject,
  onExport,
  onImport,
  canSave,
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-background border-b border-border">
      <div className="flex items-center gap-2">
        <h1 
          className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors" 
          onClick={() => navigate('/')}
        >
          Code Editor
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewProject}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={!canSave}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportClick}>
              <Upload className="h-4 w-4 mr-2" />
              Import Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="gap-2"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}