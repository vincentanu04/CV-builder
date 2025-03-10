import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, Sparkles, Star } from 'lucide-react';

export const Features = () => {
  return (
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
        <div className='flex flex-wrap gap-8 justify-center'>
          <Card className='border-2 transition-all duration-300 hover:shadow-lg  hover:-translate-y-1 w-full sm:w-[40%] md:w-[30%]'>
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
          <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-[40%] md:w-[30%]'>
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
          <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-[40%] md:w-[30%]'>
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
          {/* <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-[40%] md:w-[30%]'>
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
        </Card> */}
          <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-[40%] md:w-[30%]'>
            <CardHeader>
              <div className='p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <Star className='h-6 w-6 text-primary' />
              </div>
              <CardTitle>Grammar & Phrasing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Automatically check for grammar issues and get suggestions for
                stronger action verbs and phrasing.
              </p>
            </CardContent>
          </Card>
          <Card className='border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-[40%] md:w-[30%]'>
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
  );
};
