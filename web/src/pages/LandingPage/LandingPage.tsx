'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  CheckCircle,
  Star,
  Users,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
} from 'lucide-react';
import { ResumeNotification } from '@/components/resume-notification';

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
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
            <a
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
            </a>
          </nav>
          <div className='flex items-center gap-4'>
            <a href='/login' className='text-sm font-medium hover:text-primary'>
              Log in
            </a>
            <Button asChild size='sm'>
              <a href='/signup'>Sign up</a>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex flex-col flex-1'>
        {/* Hero Section with Resume Previews to the right */}
        <section className=' border-b py-12 min-h-[calc(100vh-4rem)]'>
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-grid-pattern opacity-5 z-0'></div>

          <div className='container mx-auto relative z-10 px-8'>
            <div className='flex flex-col lg:flex-row gap-8 items-start'>
              {/* Hero Content */}
              <div className='flex-1 space-y-6'>
                <div className='inline-block rounded-lg px-3 py-1 text-sm text-primary'>
                  Build your professional future
                </div>
                <h1 className='text-4xl font-bold sm:text-5xl md:text-6xl'>
                  Craft the perfect resume that gets you hired
                </h1>
                <p className='max-w-[600px] text-muted-foreground text-lg md:text-xl'>
                  Create stunning, ATS-friendly resumes with our AI-powered
                  platform. Stand out from the crowd and land your dream job.
                </p>
                <div className='flex flex-wrap gap-4'>
                  <Button size='lg' className='gap-2'>
                    <Sparkles className='h-4 w-4' />
                    Create Your Resume
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

        {/* Sign Up Section (below hero) */}
        <section className='py-16 bg-background'>
          <div className='container mx-auto px-8'>
            <div className='max-w-md mx-auto'>
              <div className='relative'>
                <div className='absolute -top-6 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-xl'></div>
                <div className='absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/20 blur-xl'></div>

                <Card className='relative border-2 shadow-lg'>
                  <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                      Start building professional resumes today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className='grid gap-4'>
                        <div className='grid gap-2'>
                          <Label htmlFor='email'>Email</Label>
                          <Input
                            id='email'
                            type='email'
                            placeholder='name@example.com'
                          />
                        </div>
                        <div className='grid gap-2'>
                          <Label htmlFor='password'>Password</Label>
                          <Input id='password' type='password' />
                        </div>
                        <Button type='submit' className='w-full'>
                          Sign Up
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter>
                    <p className='text-xs text-muted-foreground text-center w-full'>
                      By signing up, you agree to our{' '}
                      <a href='#' className='underline underline-offset-2'>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href='#' className='underline underline-offset-2'>
                        Privacy Policy
                      </a>
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Showcase Section (below signup) */}
        <section
          id='resume-showcase'
          className='py-16 md:py-24 bg-muted relative'
        >
          <div className='container mx-auto px-8'>
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
            <div className='flex justify-center'>
              <div className='w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden border-2 transform hover:scale-[1.02] transition-transform duration-300 relative z-10'>
                <div className='p-8 md:p-12'>
                  {/* Resume Header */}
                  <div className='border-b pb-6 mb-6'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                      <div>
                        <h2 className='text-2xl md:text-3xl font-bold text-primary'>
                          Vincent Tanuwidjaja
                        </h2>
                        <div className='flex items-center gap-4 mt-2 flex-wrap'>
                          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <Phone className='h-4 w-4' />
                            <span>(60)11-2660-3557</span>
                          </div>
                          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <Mail className='h-4 w-4' />
                            <span>vincentanu04@gmail.com</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className='mb-6'>
                    <div className='flex items-center gap-2 mb-3'>
                      <GraduationCap className='h-5 w-5 text-primary' />
                      <h3 className='text-lg font-semibold'>Education</h3>
                    </div>
                    <div className='pl-7'>
                      <div className='mb-3'>
                        <div className='flex justify-between items-start'>
                          <span className='font-medium'>
                            Monash University Malaysia
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            2022 - 2024
                          </span>
                        </div>
                        <p className='text-sm mt-1'>
                          Bachelor's in Computer Science
                        </p>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Relevant coursework: Collaborative engineering for web
                          applications, Databases using Oracle, Object-oriented
                          design & implementation, Mobile application
                          development (Android), Data structures and algorithms,
                          Fundamentals of Java and Python, Discrete and
                          continuous mathematics.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className='mb-6'>
                    <div className='flex items-center gap-2 mb-3'>
                      <Briefcase className='h-5 w-5 text-primary' />
                      <h3 className='text-lg font-semibold'>Work Experience</h3>
                    </div>
                    <div className='pl-7'>
                      <div className='mb-4'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <span className='font-medium'>
                              Backend Engineer Intern
                            </span>
                            <span className='text-primary ml-2'>Grab</span>
                          </div>
                          <span className='text-sm text-muted-foreground'>
                            Aug 2024 - Dec 2024
                          </span>
                        </div>
                        <ul className='list-disc pl-5 mt-2 text-sm space-y-1'>
                          <li>Identity and Authorization team.</li>
                          <li>
                            Implemented ReCAPTCHA as a challenge in Grab's login
                            system to protect against fraudsters/bots.
                          </li>
                          <li>
                            Designed and implemented a bot detection system
                            using a form of browser fingerprinting.
                          </li>
                          <li>
                            Built gRPC and REST APIs using Go, Redis, and MySQL
                            in a microservice architecture.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className='flex justify-between items-start'>
                          <div>
                            <span className='font-medium'>
                              Frontend Developer Intern
                            </span>
                            <span className='text-primary ml-2'>
                              MHub Malaysia
                            </span>
                          </div>
                          <span className='text-sm text-muted-foreground'>
                            Nov 2023 - Feb 2024
                          </span>
                        </div>
                        <ul className='list-disc pl-5 mt-2 text-sm space-y-1'>
                          <li>
                            Created reusable React components and pages based of
                            Figma designs using TypeScript for type safety and
                            MUI for styling with customized CSS.
                          </li>
                          <li>
                            Integrated frontend with backend APIs using GraphQL,
                            while working closely with backend devs.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <div className='flex items-center gap-2 mb-3'>
                      <Award className='h-5 w-5 text-primary' />
                      <h3 className='text-lg font-semibold'>
                        Technical Skills
                      </h3>
                    </div>
                    <div className='pl-7'>
                      <div className='flex flex-wrap gap-2'>
                        {[
                          'React',
                          'TypeScript',
                          'Go/Golang',
                          'Node.js',
                          'Express.js',
                          'GraphQL',
                          'MongoDB',
                          'SQL',
                          'Java',
                          'Python',
                        ].map((skill) => (
                          <span
                            key={skill}
                            className='px-2 py-1 bg-primary/10 text-primary rounded text-sm'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Watermark */}
                <div className='absolute bottom-3 right-3 text-xs text-muted-foreground opacity-70'>
                  Created with CV Builder
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className='absolute -top-12 -left-12 h-64 w-64 rounded-full bg-primary/5 z-0'></div>
            <div className='absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-primary/5 z-0'></div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-12 md:py-24'>
          <div className='container mx-auto px-8'>
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
              <Card className='border-2'>
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

              <Card className='border-2'>
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

              <Card className='border-2'>
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

              <Card className='border-2'>
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

              <Card className='border-2'>
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

              <Card className='border-2'>
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

        {/* Call to Action */}
        <section className='py-12 md:py-24 bg-primary/5'>
          <div className='container mx-auto px-8 text-center'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl mb-6'>
              Ready to build your professional resume?
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-8'>
              Join thousands of job seekers who have successfully landed
              interviews with resumes created on our platform.
            </p>
            <Button size='lg' className='gap-2'>
              <Sparkles className='h-4 w-4' />
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      <footer className='border-t py-6 md:py-8 mt-auto'>
        <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-8'>
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
            <a href='#' className='hover:text-primary'>
              Pricing
            </a>
            <a href='#' className='hover:text-primary'>
              About
            </a>
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
}

export default App;
