'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Star, Users, Sparkles } from 'lucide-react';
import { ResumeNotification } from '@/components/resume-notification';
import { PDFViewer, StyleSheet } from '@react-pdf/renderer';
import CV from '@/components/CV/CV';
import { exampleFormData } from '@/formData';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import AccountCard from '@/components/account-card';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

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
              href='#features'
              className='text-sm font-medium hover:text-primary'
            >
              Features
            </a>
            <a
              href='#templates'
              className='text-sm font-medium hover:text-primary'
            >
              Templates
            </a>
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
        <section className=' py-12 min-h-[calc(100vh-4rem)] relative'>
          <div className='container mx-auto px-8 animate-in fade-in slide-in-from-bottom-5 relative z-10'>
            <div className='flex flex-col lg:flex-row gap-8 items-start'>
              {/* Hero Content */}
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
                    <Sparkles className='h-4 w-4' />
                    Create Resume as Guest
                  </Button>
                  <Button size='lg' variant='outline' className='gap-2'>
                    <FileText className='h-4 w-4' />
                    View Templates
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
                <div className='absolute left-1/2 right-2/3 w-72 h-96 rotate-6 shadow-xl rounded-md border-4 border-background z-10'>
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

        {/* Resume Showcase Section (below signup) */}
        <section
          id='resume-showcase'
          className='py-16 md:py-24 bg-muted relative overflow-hidden'
        >
          <div className='absolute inset-0 bg-dot-pattern opacity-8 pointer-events-none'></div>
          <div className='absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-muted -mt-1'></div>
          <div className='container mx-auto px-8 animate-in fade-in slide-in-from-bottom-5 relative z-10'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                See What Your Resume Could Look Like
              </h2>
              <p className='mt-4 text-xl text-muted-foreground max-w-3xl mx-auto'>
                Our platform helps you create professional, ATS-friendly resumes
                like this one
              </p>
            </div>

            {/* Sample Resume */}
            <div className='flex justify-center w-full pl-2 rounded-md'>
              <PDFViewer
                style={
                  StyleSheet.create({
                    viewer: {
                      border: 0,
                      padding: 0,
                      height: '100dvh',
                      width: '75%',
                      overflow: 'hidden',
                      borderRadius: '.25em',
                    },
                  }).viewer
                }
                showToolbar={false}
              >
                <CV
                  profile={exampleFormData.profile}
                  education={exampleFormData.education}
                  experience={exampleFormData.experience}
                  projects={exampleFormData.projects}
                  awards={exampleFormData.awards}
                  additional={exampleFormData.additional}
                  skills={exampleFormData.skills}
                  remarks={exampleFormData.remarks}
                />
              </PDFViewer>
            </div>
          </div>
        </section>

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
        <section id='features' className='py-12 md:py-18 relative'>
          <div className='absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none'></div>
          <div className='container mx-auto px-8 animate-in fade-in slide-in-from-bottom-5 relative z-10'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Powerful Resume Building Features
              </h2>
              <p className='mt-4 text-xl text-muted-foreground max-w-3xl mx-auto'>
                Everything you need to create professional, ATS-friendly resumes
                that get you noticed
              </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              <Card className='border-2 transition-all duration-300 hover:shadow-lg  hover:-translate-y-1'>
                <CardHeader>
                  <div className='p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                    <FileText className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>Professional Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Choose from a variety of pre-designed templates that are
                    optimized for ATS systems and hiring managers.
                  </p>
                </CardContent>
              </Card>

              <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
                <CardHeader>
                  <div className='p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                    <Sparkles className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>AI-Powered Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Get intelligent recommendations to improve your resume's
                    content, structure, and impact.
                  </p>
                </CardContent>
              </Card>

              <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
                <CardHeader>
                  <div className='p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                    <CheckCircle className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>ATS Compliance Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Ensure your resume passes through Applicant Tracking Systems
                    with our built-in compliance checker.
                  </p>
                </CardContent>
              </Card>

              <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
                <CardHeader>
                  <div className='p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                    <Users className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>Peer Review System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Share your resume with peers and professionals to get
                    valuable feedback and suggestions.
                  </p>
                </CardContent>
              </Card>

              <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
                <CardHeader>
                  <div className='p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                    <Star className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>Grammar & Phrasing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Automatically check for grammar issues and get suggestions
                    for stronger action verbs and phrasing.
                  </p>
                </CardContent>
              </Card>

              <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
                <CardHeader>
                  <div className='p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                    <FileText className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>Resume Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Save, retrieve, update, and manage multiple versions of your
                    resume for different job applications.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

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
