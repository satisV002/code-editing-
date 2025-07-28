import React, { useState } from 'react';
import { X, Edit, FileText, Code, Palette } from 'lucide-react';
import { CodeFile } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FileTabProps {
  file: CodeFile;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onRename: (newName: string) => void;
  canClose: boolean;
}

const FILE_ICONS = {
  html: FileText,
  css: Palette,
  javascript: Code,
};

export function FileTab({ 
  file, 
  isActive, 
  onSelect, 
  onClose, 
  onRename, 
  canClose 
}: FileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(file.name);

  const Icon = FILE_ICONS[file.language];

  const handleRename = () => {
    if (editName.trim() && editName !== file.name) {
      onRename(editName.trim());
    }
    setIsEditing(false);
    setEditName(file.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(file.name);
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 px-3 py-2 text-sm border-r border-tab-border cursor-pointer group transition-colors min-w-0",
        isActive 
          ? "bg-tab-active text-foreground border-b-2 border-b-primary" 
          : "bg-tab hover:bg-tab-hover text-muted-foreground"
      )}
      onClick={!isEditing ? onSelect : undefined}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      
      {isEditing ? (
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="h-6 text-xs px-1 py-0 min-w-0 flex-1"
          autoFocus
        />
      ) : (
        <span 
          className={cn(
            "truncate flex-1 min-w-0",
            file.modified && "italic"
          )}
          onDoubleClick={() => setIsEditing(true)}
        >
          {file.name}
          {file.modified && <span className="text-orange ml-1">•</span>}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-secondary"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
        
        {canClose && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}