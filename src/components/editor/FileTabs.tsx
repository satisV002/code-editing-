import React from 'react';
import { Plus } from 'lucide-react';
import { CodeFile } from '@/types/editor';
import { FileTab } from './FileTab';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FileTabsProps {
  files: CodeFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCloseFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onAddFile: (name: string, language: 'html' | 'css' | 'javascript') => void;
}

export function FileTabs({
  files,
  activeFileId,
  onSelectFile,
  onCloseFile,
  onRenameFile,
  onAddFile,
}: FileTabsProps) {
  const handleAddFile = (language: 'html' | 'css' | 'javascript') => {
    const extension = language === 'javascript' ? 'js' : language;
    const baseName = `new-file.${extension}`;
    let fileName = baseName;
    let counter = 1;

    while (files.some(f => f.name === fileName)) {
      fileName = `new-file-${counter}.${extension}`;
      counter++;
    }

    onAddFile(fileName, language);
  };

  return (
    <div className="flex items-center bg-tab border-b border-tab-border overflow-x-auto">
      <div className="flex min-w-0 flex-1">
        {files.map((file) => (
          <FileTab
            key={file.id}
            file={file}
            isActive={file.id === activeFileId}
            onSelect={() => onSelectFile(file.id)}
            onClose={() => onCloseFile(file.id)}
            onRename={(newName) => onRenameFile(file.id, newName)}
            canClose={files.length > 1}
          />
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 mx-2 hover:bg-tab-hover"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAddFile('html')}>
            HTML File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddFile('css')}>
            CSS File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddFile('javascript')}>
            JavaScript File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}