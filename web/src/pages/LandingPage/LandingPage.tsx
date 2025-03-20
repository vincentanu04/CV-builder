'use client';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { ResumeNotification } from '@/components/resume-notification';
import { useState } from 'react';
import AccountCard from '@/components/account-card';
import { FadeIn } from '@/components/fade-in';
import { ResumeShowcase } from './components/ResumeShowcase';
import { Features } from './components/Features';
import { Hero } from './components/Hero';
import { handleScroll } from '@/utils/scroll';

const LandingPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const scrollToLoginCard = () => {
    const loginSection = document.getElementById('scrolling-login');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleGoLogin = () => {
    scrollToLoginCard();
    setIsSignUp(false);
  };

  const handleGoSignup = () => {
    scrollToLoginCard();
    setIsSignUp(true);
  };

  return (
    <div className='flex flex-col min-h-screen relative overflow-hidden scroll-smooth bg-gradient-to-b from-background via-background to-background/95'>
      {/* Background Pattern that spans the entire page */}
      <div className='fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none animate-pattern'></div>

      <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10'>
        <div className='container mx-auto flex h-16 items-center justify-between py-4 px-8'>
          <div className='flex items-center gap-2'>
            <FileText className='h-6 w-6 text-primary' />
            <span className='text-xl font-bold'>CV Builder</span>
          </div>
          <nav className='hidden md:flex gap-6'>
            <a
              className='text-sm font-medium hover:text-primary'
              onClick={() => handleScroll('features')}
            >
              Features
            </a>
            <a className='text-sm font-medium hover:text-primary'>Templates</a>
            {/* <a
              href='#reviews'
              className='text-sm font-medium hover:text-primary'
            >
              Reviews
            </a>
            <a
              href='#pricing'
              className='text-sm font-medium hover:text-primary'
            >
              Pricing
            </a> */}
          </nav>
          <div className='flex items-center gap-4'>
            <a
              className='text-sm font-medium hover:text-primary'
              onClick={handleGoLogin}
            >
              Log in
            </a>
            <Button asChild size='sm' onClick={handleGoSignup}>
              <a>Sign up</a>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex flex-col flex-1'>
        {/* Hero Section with Resume Previews to the right */}
        <FadeIn>
          <Hero />
        </FadeIn>

        <FadeIn>
          <ResumeShowcase />
        </FadeIn>

        {/* Curved connector between sections */}
        <div className='relative h-16 bg-muted'>
          <div
            className='absolute bottom-0 left-0 right-0 h-16 bg-background'
            style={{
              borderTopLeftRadius: '50% 100%',
              borderTopRightRadius: '50% 100%',
            }}
          ></div>
        </div>

        {/* Features Section */}
        <FadeIn>
          <Features />
        </FadeIn>

        {/* Angled connector between sections */}
        <div className='relative h-16'>
          <div
            className='absolute bottom-0 left-0 right-0 h-16 bg-primary/5'
            style={{
              clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)',
            }}
          ></div>
        </div>

        {/* Call to Action */}
        <FadeIn>
          <section className='py-12 md:py-16 md:pb-24  relative'>
            <div className='absolute inset-0 bg-grid-pattern opacity-8 pointer-events-none animate-pattern'></div>
            <div className='container mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-5 relative z-10'>
              <h2
                className='text-3xl font-bold tracking-tighter sm:text-4xl mb-6 pt-6'
                id='scrolling-login'
              >
                Ready to build your professional resume?
              </h2>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-0'>
                Join thousands of job seekers who have successfully landed
                interviews with resumes created on our platform.
              </p>
            </div>
            <div className='absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none'></div>
            <div className='absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/0 to-background/100 -mt-24'></div>
            <div className='container mx-auto px-8 animate-in fade-in slide-in-from-bottom-5 relative z-10'>
              <div className='max-w-md mx-auto'>
                <div className='relative'>
                  <div className='absolute -top-6 -left-6 h-24 w-24 rounded-full bg-muted blur-xl'></div>
                  <div className='absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-muted blur-xl'></div>
                  <AccountCard isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>

      <footer className='border-t py-6 md:py-8 mt-auto relative'>
        <div className='absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none'></div>
        <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-8 relative z-10'>
          <div className='flex items-center gap-2'>
            <FileText className='h-5 w-5 text-primary' />
            <span className='font-semibold'>CV Builder</span>
          </div>

          <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground'>
            <a href='#' className='hover:text-primary'>
              Features
            </a>
            <a href='#' className='hover:text-primary'>
              Templates
            </a>
            {/* <a href='#' className='hover:text-primary'>
              Pricing
            </a>
            <a href='#' className='hover:text-primary'>
              About
            </a> */}
            <a href='#' className='hover:text-primary'>
              Contact
            </a>
          </div>

          <div className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} CV Builder. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Non-intrusive Resume Notification */}
      <ResumeNotification />
    </div>
  );
};

export default LandingPage;
