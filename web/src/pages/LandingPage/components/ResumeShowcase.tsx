import CV from '@/components/CV/CV';
import { makeExampleSectionedData } from '@/formData';
import { PDFViewer, StyleSheet } from '@react-pdf/renderer';

const exampleData = makeExampleSectionedData();

export const ResumeShowcase = () => {
  return (
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
            <CV sections={exampleData.sections} />
          </PDFViewer>
        </div>
      </div>
    </section>
  );
};
