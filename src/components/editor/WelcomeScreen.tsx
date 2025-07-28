import React from 'react';
import { Code, FileText, Palette, Zap, Monitor, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeScreenProps {
  onCreateProject: () => void;
}

export function WelcomeScreen({ onCreateProject }: WelcomeScreenProps) {
  const features = [
    {
      icon: Code,
      title: 'Multi-Language Support',
      description: 'Write HTML, CSS, and JavaScript with full syntax highlighting'
    },
    {
      icon: Monitor,
      title: 'Live Preview',
      description: 'See your changes instantly with real-time preview'
    },
    {
      icon: FileText,
      title: 'Multiple Files',
      description: 'Organize your code with tabs and file management'
    },
    {
      icon: Save,
      title: 'Local Storage',
      description: 'Save and manage projects locally in your browser'
    },
    {
      icon: Palette,
      title: 'Customizable',
      description: 'Dark/light themes and adjustable font sizes'
    },
    {
      icon: Zap,
      title: 'Fast & Private',
      description: 'Everything runs in your browser - no server required'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary/10 to-orange/10 rounded-full mb-6">
            <Code className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-orange bg-clip-text text-transparent">
            Code Editor
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A powerful, browser-based code editor for web development. 
            Write, preview, and manage your HTML, CSS, and JavaScript projects with ease.
          </p>
          <Button 
            onClick={onCreateProject}
            size="lg"
            className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary to-orange hover:from-primary/90 hover:to-orange/90"
          >
            <Code className="w-5 h-5 mr-2" />
            Start Coding
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                  index % 3 === 2 ? 'bg-orange/10' : 'bg-primary/10'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    index % 3 === 2 ? 'text-orange' : 'text-primary'
                  }`} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React, Monaco Editor, and modern web technologies
          </p>
        </div>
      </div>
    </div>
  );
}