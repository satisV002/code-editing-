import React from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsPanelProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export function SettingsPanel({ fontSize, onFontSizeChange }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const [autoSave, setAutoSave] = useLocalStorage('editor-auto-save', true);
  const [wordWrap, setWordWrap] = useLocalStorage('editor-word-wrap', true);
  const [minimap, setMinimap] = useLocalStorage('editor-minimap', false);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-semibold">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Font Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => onFontSizeChange(value)}
              min={10}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="word-wrap">Word Wrap</Label>
            <Switch
              id="word-wrap"
              checked={wordWrap}
              onCheckedChange={setWordWrap}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="minimap">Show Minimap</Label>
            <Switch
              id="minimap"
              checked={minimap}
              onCheckedChange={setMinimap}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save">Auto Save</Label>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground space-y-1">
            <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd> Save Project</div>
            <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+N</kbd> New Project</div>
            <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+T</kbd> New File</div>
            <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+W</kbd> Close File</div>
            <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+`</kbd> Toggle Theme</div>
          </div>
        </CardContent>
      </Card>
      </div>
    </ScrollArea>
  );
}