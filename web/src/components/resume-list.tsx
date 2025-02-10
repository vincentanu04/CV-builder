import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResumeMetadatas, ResumeMetadata } from '@/api/resume';
import { FORBIDDEN_MESSAGE } from '@/api/errors';

const ResumeList = () => {
  const navigate = useNavigate();

  const {
    data: resume_metadatas = [],
    isLoading,
    isError,
    error,
  } = useQuery<ResumeMetadata[], Error>({
    queryKey: ['resume_metadatas'],
    queryFn: getResumeMetadatas,
    retry: (_, error) => error.message !== FORBIDDEN_MESSAGE,
  });

  useEffect(() => {
    if (isError && error?.message === FORBIDDEN_MESSAGE) {
      navigate('/');
    }
  }, [isError, error, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error, please try again!</div>;
  }

  console.log(resume_metadatas);
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {resume_metadatas.map((resume) => (
        <Card key={resume.id}>
          <CardContent className='pt-6'>
            <h3 className='font-semibold text-lg mb-2'>{resume.title}</h3>
            <p className='text-sm text-gray-400'>
              Last updated:{' '}
              {new Date(resume.updated_at)
                .toLocaleDateString('en-GB')
                .replace(/\//g, '-')}
            </p>
          </CardContent>
          <CardFooter className='justify-between'>
            <Button variant='outline' size='sm' asChild>
              <Link to={`/resume/${resume.id}/edit`}>
                <Pencil className='w-4 h-4 mr-2' />
                Edit
              </Link>
            </Button>
            <Button variant='outline' size='sm' asChild>
              <Link to={`/resume/${resume.id}/preview`}>
                <Eye className='w-4 h-4 mr-2' />
                Preview
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ResumeList;
