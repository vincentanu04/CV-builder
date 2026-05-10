import { useGetAuthMeQuery, usePostAuthLogoutMutation } from '@/api/client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { capitalizeFirstCharacter } from '@/utils/text';
import { useNavigate } from 'react-router-dom';

const UserNav = () => {
  const { data: user } = useGetAuthMeQuery();
  const [logout] = usePostAuthLogoutMutation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='h-8 w-8 hover:cursor-pointer'>
          <AvatarImage
            src='/avatars/01.png'
            alt='@username'
          />
          <AvatarFallback>
            {user ? user.email[0].toUpperCase() : '?'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56 bg-background text-foreground border-gray-600'
        align='end'
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1 gap-1.5'>
            <p className='text-sm font-medium leading-none text-[#7a7a7a]'>
              {user?.email ? user.email : '-'}
            </p>
            <p className='text-sm font-medium leading-none text-[#7a7a7a]'>
              {user?.plan
                ? `${capitalizeFirstCharacter(
                    user.plan
                  )} Plan`
                : '-'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
