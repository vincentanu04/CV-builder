import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

const ResumeList = () => {
  const [resumes, setResumes] = useState<
    {
      id: number;
      name: string;
      lastUpdated: string;
    }[]
  >([]);

  useEffect(() => {
    async function getResumes() {
      // Simulate API call to fetch resumes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResumes([
        { id: 1, name: 'Software Engineer Resume', lastUpdated: '2023-05-15' },
        { id: 2, name: 'Product Manager Resume', lastUpdated: '2023-05-10' },
        { id: 3, name: 'Data Analyst Resume', lastUpdated: '2023-05-05' },
      ]);
    }

    getResumes();
  }, []);

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {resumes.map((resume) => (
        <Card key={resume.id}>
          <CardContent className='pt-6'>
            <h3 className='font-semibold text-lg mb-2'>{resume.name}</h3>
            <p className='text-sm text-gray-400'>
              Last updated: {resume.lastUpdated}
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
