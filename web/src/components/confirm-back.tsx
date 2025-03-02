import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConfirmBackProps {
  isResumeChanged: boolean;
}

export const ConfirmBack = ({ isResumeChanged }: ConfirmBackProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (!isResumeChanged) {
      // if unchanged, just go back. if changed, trigger the alert dialong content
      navigate('/home');
      return;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={'sm'}
          className='pr-4 py-1 h-fit self-center md:self-start'
          variant={'outline'}
          onClick={handleBack}
        >
          <ChevronLeft /> Back
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. If you leave now, your changes will be
            lost. Are you sure you want to go back?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              navigate('/home');
            }}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
