import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  Check,
  CheckCircle,
  CreditCard,
  FileText,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Features = () => {
  const navigate = useNavigate();
  return (
    <section id='features' className='pt-12 relative'>
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

        <div className='text-center mt-16 mb-2 relative'>
          <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 w-full max-w-xs h-16 bg-gradient-to-r from-primary to-accent opacity-10 blur-xl rounded-full'></div>

          <div className='relative inline-block group '>
            <div className='absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-300 text-foregound'></div>
            <Button
              size='lg'
              className='relative px-8 py-6 text-lg text-foregound font-medium flex items-center gap-3 bg-background border-2 border-primary hover:border-accent shadow-lg group-hover:shadow-xl transition-all duration-300'
              onClick={() => {
                navigate('/pricing');
              }}
            >
              <CreditCard className='h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300' />
              <span className=''>View Plans & Pricing</span>
              <ArrowRight className='h-5 w-5 text-primary ml-1 group-hover:translate-x-1 transition-transform duration-300' />
            </Button>
          </div>

          <div className='mt-6 flex flex-col items-center justify-center gap-1'>
            <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
              <Zap className='h-4 w-4 text-primary' />
              <span>Unlock premium features with our Pro plan</span>
            </div>
            <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
              <Check className='h-4 w-4 text-accent' />
              <span>
                Or continue with our powerful free features — no payment
                required
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
