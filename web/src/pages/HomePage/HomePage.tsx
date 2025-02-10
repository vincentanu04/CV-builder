import { Suspense, useEffect } from 'react';
import ResumeList from '@/components/resume-list';
import QuickActions from '@/components/quick-actions';
import MainNav from '@/components/main-nav';
import UserNav from '@/components/user-nav';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/');
    }
  }, [userLoading, user, navigate]);

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b  px-20'>
        <div className='container mx-auto  py-4 flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>CV Builder</h1>
          <div className='flex items-center space-x-4'>
            <MainNav />
            <UserNav user={user} />
          </div>
        </div>
      </header>

      <main className='flex-col flex-grow container mx-auto px-20 py-8'>
        <QuickActions />

        <section className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Your Resumes</h2>
          <Suspense fallback={<div>Loading resumes...</div>}>
            <ResumeList />
          </Suspense>
        </section>
      </main>

      <footer className='border-t mt-8'>
        <div className='container mx-auto px-4 py-4 text-center text-sm text-gray-600'>
          © 2025 CV Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
