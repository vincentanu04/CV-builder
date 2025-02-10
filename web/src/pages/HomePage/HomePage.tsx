import { Suspense, useEffect, useState } from 'react';
import ResumeList from '@/components/resume-list';
import QuickActions from '@/components/quick-actions';
import MainNav from '@/components/main-nav';
import UserNav from '@/components/user-nav';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getResume } from '@/api/resume';
import { Button } from '@/components/ui/button';
import CV from '@/components/CV/CV';
import { PDFViewer } from '@react-pdf/renderer';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
  const { user, loading: userLoading } = useAuth();
  const [previewingResumeID, setPreviewingResumeID] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/');
    }
  }, [userLoading, user, navigate]);

  const { data: previewingResume } = useQuery({
    queryKey: ['resume', previewingResumeID],
    queryFn: () => getResume(previewingResumeID as number),
    enabled: !!previewingResumeID,
  });

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b  px-20'>
        <div className='container mx-auto  py-4 flex justify-between items-center'>
          <Link to='/home'>
            <h1 className='text-2xl font-bold'>CV Builder</h1>
          </Link>
          <div className='flex items-center space-x-4'>
            <MainNav />
            <UserNav />
          </div>
        </div>
      </header>

      <main className='flex-col flex-grow container mx-auto px-20 py-8'>
        <QuickActions />

        <section className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Your Resumes</h2>
          <Suspense fallback={<div>Loading resumes...</div>}>
            <ResumeList setPreviewingResumeID={setPreviewingResumeID} />
          </Suspense>
        </section>
      </main>
      {previewingResumeID && previewingResume && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='h-[95vh] border-2 border-primary bg-background relative rounded-lg shadow-lg w-3/4 max-w-4xl flex flex-col items-center p-2'>
            <Button
              onClick={() => setPreviewingResumeID(null)}
              className='absolute top-2 right-2'
            >
              ✖
            </Button>
            <h2 className='text-xl font-semibold mt-1 mb-3'>
              {previewingResume.title}
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
                <CV
                  profile={previewingResume.data.profile}
                  education={previewingResume.data.education}
                  experience={previewingResume.data.experience}
                  projects={previewingResume.data.projects}
                  awards={previewingResume.data.awards}
                  additional={previewingResume.data.additional}
                  skills={previewingResume.data.skills}
                  remarks={previewingResume.data.remarks}
                />
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
