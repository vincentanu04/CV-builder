'use client';

import { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function ResumeNotification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification after a short delay when page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    // Find the resume section and scroll to it
    const resumeSection = document.getElementById('resume-showcase');
    if (resumeSection) {
      resumeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-4 right-4 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300'>
      <Card className='border border-primary shadow-md bg-background'>
        <CardContent className='p-4 flex items-start gap-3'>
          <div className='p-1.5 rounded-full bg-primary/10 shrink-0 mt-0.5'>
            <FileText className='h-4 w-4 text-primary' />
          </div>

          <div className='flex-1'>
            <div className='flex items-start justify-between mb-1'>
              <p className='text-sm font-medium'>Check out our sample resume</p>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 rounded-full -mt-1 -mr-1'
                onClick={() => setIsVisible(false)}
              >
                <X className='h-3 w-3' />
                <span className='sr-only'>Dismiss</span>
              </Button>
            </div>
            <p className='text-xs text-muted-foreground mb-2'>
              See what you can create with our resume builder
            </p>
            <Button
              variant='link'
              className='h-auto p-0 text-xs text-primary font-medium'
              onClick={() => {
                handleScroll();
                setIsVisible(false);
              }}
            >
              View sample →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
