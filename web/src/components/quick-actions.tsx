import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  return (
    <div className='flex justify-between items-center'>
      <h2 className='text-xl font-semibold'>Quick Actions</h2>
      <div className='space-x-4'>
        <Button size='lg' asChild>
          <Link to='/resume/new' className='no-underline'>
            Create New Resume
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
