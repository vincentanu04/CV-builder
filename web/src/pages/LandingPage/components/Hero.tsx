import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { handleScroll } from '@/utils/scroll';
import {
  AtomIcon,
  Construction,
  ConstructionIcon,
  FileText,
  Sparkles,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className=' py-12 min-h-[calc(100vh-4rem)] relative flex justify-center items-center'>
      <div className='container mx-auto px-8 animate-in fade-in slide-in-from-bottom-5 relative z-10'>
        <div className='flex flex-col lg:flex-row gap-8 items-start'>
          <div className='flex-1 space-y-6'>
            <Badge className='shadow-lg shadow-muted py-1 font-thin'>
              Build your professional future
            </Badge>
            <h1 className='text-4xl font-bold sm:text-5xl md:text-6xl'>
              Craft the perfect resume that gets you hired
            </h1>
            <p className='max-w-[600px] text-muted-foreground text-lg md:text-xl'>
              Create stunning, ATS-friendly resumes with our AI-powered
              platform. Stand out from the crowd and land your dream job.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Button
                size='lg'
                className='gap-2'
                onClick={() => {
                  navigate('/resume/new');
                }}
              >
                <FileText className='h-4 w-4' />
                Create Resume as Guest
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='gap-2'
                onClick={() => handleScroll('features')}
              >
                <Sparkles className='h-4 w-4' />
                View Features
              </Button>
            </div>
            <div className='flex items-center gap-4 pt-4'>
              <div className='flex -space-x-2'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden'
                  >
                    <img
                      src={`https://picsum.photos/id/64/250/500`}
                      alt='User avatar'
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
              </div>
              <div className='text-sm text-muted-foreground'>
                <span className='font-medium text-foreground'>10,000+</span>{' '}
                professionals trust us
              </div>
            </div>
          </div>
          {/* Resume Previews to the right */}
          <div className='flex-1 relative h-auto hidden lg:block'>
            <div className='absolute left-1/2 right-2/3 w-72 h-96 rotate-6 shadow-xl  rounded-md border-4 border-background z-10'>
              <img
                src='Resume_preview.jpg'
                alt='Resume preview'
                className='h-full w-full '
              />
            </div>
            <div className='absolute top-12 right-1/3 w-72 h-96 -rotate-3 shadow-xl rounded-md border-4 border-background z-20'>
              <img
                src='Resume_preview.jpg'
                alt='Resume preview'
                className='h-full w-full '
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
