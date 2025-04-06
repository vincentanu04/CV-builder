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
import {
  fromOrderedJSON,
  toOrderedJSON,
} from '@/utils/json';

const HomePage = () => {
  const { user, loading: userLoading } = useAuth();
  const [previewingResumeID, setPreviewingResumeID] =
    useState<number | null>(null);
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

  const previewingResumeObj = previewingResume?.data
    ? fromOrderedJSON(previewingResume.data)
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
          setPreviewingResumeID={setPreviewingResumeID}
        />
      </main>

      {previewingResumeID &&
        previewingResume &&
        previewingResumeObj && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4'>
            <div className='h-[90vh] sm:h-[95vh] border-2 border-primary bg-background relative rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 max-w-4xl flex flex-col items-center p-2'>
              <Button
                onClick={() => setPreviewingResumeID(null)}
                className='absolute top-2 right-2 z-10'
              >
                ✖
              </Button>
              <h2 className='text-lg sm:text-xl font-semibold mt-1 mb-2 sm:mb-3 px-8'>
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
                    profile={previewingResumeObj.profile}
                    education={
                      previewingResumeObj.education
                    }
                    experience={
                      previewingResumeObj.experience
                    }
                    projects={previewingResumeObj.projects}
                    awards={previewingResumeObj.awards}
                    additional={
                      previewingResumeObj.additional
                    }
                    skills={previewingResumeObj.skills}
                    remarks={previewingResumeObj.remarks}
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
