import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { CodeFile } from '@/types/editor';
import { Button } from '@/components/ui/button';

interface PreviewPaneProps {
  files: CodeFile[];
  autoRefresh?: boolean;
}

export function PreviewPane({ files, autoRefresh = true }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePreviewHTML = () => {
    const htmlFile = files.find(f => f.language === 'html');
    const cssFile = files.find(f => f.language === 'css');
    const jsFile = files.find(f => f.language === 'javascript');

    let html = htmlFile?.content || '<body></body>';
    
    // Inject CSS if available
    if (cssFile?.content) {
      const cssTag = `<style>${cssFile.content}</style>`;
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${cssTag}</head>`);
      } else if (html.includes('<body>')) {
        html = html.replace('<body>', `<head>${cssTag}</head><body>`);
      } else {
        html = `<head>${cssTag}</head>${html}`;
      }
    }

    // Inject JavaScript if available
    if (jsFile?.content) {
      const jsTag = `<script>${jsFile.content}</script>`;
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${jsTag}</body>`);
      } else {
        html = `${html}${jsTag}`;
      }
    }

    // Add base tag to prevent external links from breaking the iframe
    const baseTag = '<base target="_blank">';
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}`);
    } else {
      html = `<head>${baseTag}</head>${html}`;
    }

    return html;
  };

  const refreshPreview = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    const html = generatePreviewHTML();
    
    try {
      const iframe = iframeRef.current;
      iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      
      iframe.onload = () => {
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Error updating preview:', error);
      setIsLoading(false);
    }
  };

  const openInNewTab = () => {
    const html = generatePreviewHTML();
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  useEffect(() => {
    if (autoRefresh) {
      const timer = setTimeout(refreshPreview, 300);
      return () => clearTimeout(timer);
    }
  }, [files, autoRefresh]);

  useEffect(() => {
    refreshPreview();
  }, []);

  return (
    <div className="flex flex-col h-full bg-preview border border-preview-border">
      <div className="flex items-center justify-between p-2 border-b border-preview-border bg-muted">
        <h3 className="text-sm font-medium">Live Preview</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPreview}
            disabled={isLoading}
            className="h-7 px-2"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
            className="h-7 px-2"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-modals allow-popups allow-same-origin"
          title="Code Preview"
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Loading preview...</div>
          </div>
        )}
      </div>
    </div>
  );
}