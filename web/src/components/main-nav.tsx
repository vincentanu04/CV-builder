import { Link } from 'react-router-dom';

const MainNav = () => {
  return (
    <nav>
      <ul className='flex space-x-4'>
        <li>
          <Link to='/home' className='text-sm font-medium'>
            Home
          </Link>
        </li>
        <li>
          <Link to='/templates' className='text-sm font-medium'>
            Templates
          </Link>
        </li>
        <li>
          <Link to='/ai-review' className='text-sm font-medium'>
            AI Review
          </Link>
        </li>
        <li>
          <Link to='/peer-review' className='text-sm font-medium'>
            Peer Review
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
