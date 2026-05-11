import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Check, Eye, Pencil, X } from 'lucide-react';
import { Suspense, useState } from 'react';
import {
  useGetResumesQuery,
  useDeleteResumeMutation,
  usePatchResumeTitleMutation,
  type Resume,
} from '@/api/client';
import { Input } from './ui/input';
import { ConfirmDelete } from './confirm-delete';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface ResumeListProps {
  setPreviewingResumeID: (id: string, title: string) => void;
}

const ResumeList = ({
  setPreviewingResumeID,
}: ResumeListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const { data, isLoading, isError } = useGetResumesQuery();
  const [updateTitle, { isLoading: isTitlePending }] = usePatchResumeTitleMutation();
  const [deleteResume] = useDeleteResumeMutation();

  const resumes = data?.resumes ?? [];
  const limited = data?.limited ?? false;

  const startEditing = (resume: Resume) => {
    setEditingId(resume.id);
    setEditedTitle(resume.title);
  };

  const saveTitle = (id: string) => {
    if (editedTitle.trim() === '') return;
    updateTitle({ id, updateResumeTitleRequest: { title: editedTitle } });
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteResume({ id });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error, please try again!</div>;
  }

  return (
    <section className='mt-2 sm:mt-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-5'>
        <h2 className='text-xl font-semibold'>
          Your Resumes
        </h2>
        {limited ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size='lg'
                  asChild
                  className='w-full sm:w-auto opacity-50 hover:opacity-50'
                  disabled
                >
                  <span className='hover:cursor-not-allowed'>
                    Create New Resume
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side='bottom'
                align='start'
                alignOffset={-40}
              >
                <p>
                  You have reached the maximum number of
                  resumes for this plan!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            size='lg'
            asChild
            className='w-full sm:w-auto'
          >
            <Link to='/resume/new' className='no-underline'>
              Create New Resume
            </Link>
          </Button>
        )}
      </div>
      <Suspense fallback={<div>Loading resumes...</div>}>
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {resumes.length > 0 ? (
            resumes.map((resume) => (
              <Card
                key={resume.id}
                className='w-full flex flex-col'
              >
                <CardContent className='pt-6 flex-1'>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2'>
                    {editingId === resume.id ? (
                      <div className='flex items-center gap-2 w-full'>
                        <Input
                          value={editedTitle}
                          onChange={(e: any) =>
                            setEditedTitle(e.target.value)
                          }
                          className='h-8 flex-grow'
                          autoFocus
                        />
                        <div className='flex gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => saveTitle(resume.id)}
                            disabled={isTitlePending}
                          >
                            <Check className='h-4 w-4 text-green-500' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={cancelEditing}
                          >
                            <X className='h-4 w-4 text-red-500' />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className='flex items-center gap-2 w-full justify-between'>
                          <div className='flex items-center gap-2'>
                            <h3 className='font-semibold text-lg truncate max-w-[200px] sm:max-w-none text-wrap'>
                              {resume.title}
                            </h3>
                            <Button
                              variant='icon'
                              className='h-8 w-8 '
                              onClick={() => startEditing(resume)}
                            >
                              <Pencil className='h-4 w-4 text-blue-300' />
                            </Button>
                          </div>
                          <ConfirmDelete
                            resumeTitle={resume.title}
                            deleteFunc={() => handleDelete(resume.id)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <p className='text-sm text-gray-400'>
                    Last updated:{' '}
                    {new Date(resume.updatedAt)
                      .toLocaleDateString('en-GB')
                      .replace(/\//g, '-')}
                  </p>
                </CardContent>
                <CardFooter className='flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between'>
                  <Button
                    variant='outline'
                    size='sm'
                    asChild
                    className='w-full sm:w-auto'
                  >
                    <Link to={`/resume/${resume.id}`}>
                      <Pencil className='w-4 h-4 mr-2' />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setPreviewingResumeID(resume.id, resume.title)
                    }
                    className='w-full sm:w-auto'
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    Preview
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className='text-gray-500'>
              No resumes... start creating!
            </div>
          )}
        </div>
      </Suspense>
    </section>
  );
};

export default ResumeList;
