import { Suspense, useEffect, useState } from 'react';
import ResumeList from '@/components/resume-list';
import MainNav from '@/components/main-nav';
import UserNav from '@/components/user-nav';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getResume } from '@/api/resume';
import { Button } from '@/components/ui/button';
import CV from '@/components/CV/CV';
import { PDFViewer } from '@react-pdf/renderer';
import { useQuery } from '@tanstack/react-query';
import { parseResumeData } from '@/utils/json';
import { IconX } from '@tabler/icons-react';

const HomePage = () => {
  const { user, loading: userLoading } = useAuth();
  const [previewState, setPreviewState] =
    useState<{ id: number; title: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/');
    }
  }, [userLoading, user, navigate]);

  const { data: previewingResume } = useQuery({
    queryKey: ['resume', previewState?.id],
    queryFn: () => getResume(previewState!.id),
    enabled: !!previewState,
  });

  const previewingResumeObj = previewingResume?.data
    ? parseResumeData(previewingResume.data)
    : null;

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b px-4 sm:px-8 md:px-12 lg:px-20'>
        <div className='container mx-auto py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0'>
          <Link to='/home'>
            <h1 className='text-2xl font-bold'>
              CV Builder
            </h1>
          </Link>
          <div className='flex items-center space-x-4'>
            <MainNav />
            <UserNav />
          </div>
        </div>
      </header>

      <main className='flex-col flex-grow container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-8'>
        <ResumeList
          setPreviewingResumeID={(id, title) => setPreviewState({ id, title })}
        />
      </main>

      {previewState && previewingResume && previewingResumeObj && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4' style={{ zIndex: 9000 }}>
            <div className='h-[90vh] sm:h-[95vh] border-2 border-primary bg-background relative rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 max-w-4xl flex flex-col items-center p-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setPreviewState(null)}
                className='absolute top-2 right-2 z-10'
              >
                <IconX className='h-4 w-4' />
              </Button>
              <h2 className='text-lg sm:text-xl font-semibold mt-1 mb-2 sm:mb-3 px-8'>
                {previewState.title}
              </h2>
              <div className='w-full flex justify-center items-center h-full'>
                <PDFViewer
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                  }}
                  showToolbar={false}
                >
                  <CV sections={previewingResumeObj.sections} />
                </PDFViewer>
              </div>
            </div>
          </div>
        )}

      <footer className='border-t mt-8'>
        <div className='container mx-auto px-4 py-4 text-center text-sm text-gray-600'>
          © 2025 CV Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
