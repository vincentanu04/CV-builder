import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Check, Eye, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteResume,
  getResumeMetadatas,
  ResumeMetadata,
  updateResumeMetadataTitle,
} from '@/api/resume';
import { FORBIDDEN_MESSAGE } from '@/api/errors';
import { Input } from './ui/input';
import { ConfirmDelete } from './confirm-delete';

interface ResumeListProps {
  setPreviewingResumeID: (resumeMetadataId: number) => void;
}
const ResumeList = ({ setPreviewingResumeID }: ResumeListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const queryClient = useQueryClient();
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

  const updateMetadataTitleMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      updateResumeMetadataTitle(id, { title }),
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      queryClient.invalidateQueries({ queryKey: ['resume_metadatas'] });
      // Reset editing state
      setEditingId(null);
    },
    onError: (error) => {
      // toast({
      //   title: 'Error',
      //   description: 'Failed to update resume title',
      //   variant: 'destructive',
      // });
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: (id: number) => deleteResume(id),
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      queryClient.invalidateQueries({ queryKey: ['resume_metadatas'] });
    },
  });

  useEffect(() => {
    if (isError) {
      console.log(error);

      if (error?.message === FORBIDDEN_MESSAGE) {
        navigate('/');
      }
    }
  }, [isError, error, navigate]);

  const startEditing = (metadata: ResumeMetadata) => {
    setEditingId(metadata.id);
    setEditedTitle(metadata.title);
  };

  const saveTitle = (id: number) => {
    if (editedTitle.trim() === '') {
      // toast({
      //   title: 'Error',
      //   description: 'Title cannot be empty',
      //   variant: 'destructive',
      // });
      return;
    }

    updateMetadataTitleMutation.mutate({ id, title: editedTitle });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    console.log(id);
    deleteResumeMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error, please try again!</div>;
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {resume_metadatas.map((metadata) => (
        <Card key={metadata.id}>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between mb-2'>
              {editingId === metadata.id ? (
                <div className='flex items-center gap-2'>
                  <Input
                    value={editedTitle}
                    onChange={(e: any) => setEditedTitle(e.target.value)}
                    className='h-8'
                    autoFocus
                  />
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => saveTitle(metadata.id)}
                      disabled={updateMetadataTitleMutation.isPending}
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
                  <div className='flex items-center gap-2'>
                    <h3 className='font-semibold text-lg flex-grow'>
                      {metadata.title}
                    </h3>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => startEditing(metadata)}
                    >
                      <Pencil className='h-4 w-4 text-blue-300' />
                    </Button>
                  </div>
                  <ConfirmDelete
                    resumeTitle={metadata.title}
                    deleteFunc={() => handleDelete(metadata.resume_id)}
                  />
                </>
              )}
            </div>
            <p className='text-sm text-gray-400'>
              Last updated:{' '}
              {new Date(metadata.updated_at)
                .toLocaleDateString('en-GB')
                .replace(/\//g, '-')}
            </p>
          </CardContent>
          <CardFooter className='justify-between'>
            <Button variant='outline' size='sm' asChild>
              <Link to={`/resume/${metadata.resume_id}`}>
                <Pencil className='w-4 h-4 mr-2' />
                Edit
              </Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPreviewingResumeID(metadata.resume_id)}
            >
              <Eye className='w-4 h-4 mr-2' />
              Preview
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ResumeList;
