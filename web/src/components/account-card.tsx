import { Label } from '@radix-ui/react-label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAuthMeQuery,
  usePostAuthLoginMutation,
  usePostAuthRegisterMutation,
} from '@/api/client';
import { capitalizeFirstCharacter } from '@/utils/text';

interface AccountCardProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
}

const AccountCard = ({
  isSignUp,
  setIsSignUp,
}: AccountCardProps) => {
  const { data: user } = useGetAuthMeQuery();
  const [login, { isLoading: isLoginLoading }] = usePostAuthLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = usePostAuthRegisterMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isLoading = isLoginLoading || isRegisterLoading;

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError('Please enter your email and password!');
      return;
    }
    setError('');
    try {
      await login({ email, password }).unwrap();
      navigate('/home');
    } catch (err: any) {
      const status = err?.status;
      const message = err?.data?.message;
      if (status === 400) {
        setError(
          capitalizeFirstCharacter(message) || 'Bad request.'
        );
      } else if (status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleSignup = async () => {
    if (email === '' || password === '') {
      setError('Please enter your email and password!');
      return;
    }
    setError('');
    try {
      await register({ email, password }).unwrap();
      navigate('/home');
    } catch (err: any) {
      const status = err?.status;
      const message = err?.data?.message;
      if (status === 400) {
        setError(
          capitalizeFirstCharacter(message) || 'Bad request.'
        );
      } else if (status === 409) {
        setError('An account with this email already exists.');
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <Card className='relative border-2 shadow-lg mt-12'>
      <CardHeader>
        <CardTitle className='text-2xl tracking-wider'>
          {isSignUp
            ? 'Create your FREE account!'
            : 'Welcome back!'}
        </CardTitle>
        <CardDescription>
          {isSignUp
            ? 'Start building professional resumes today'
            : 'Continue building professional resumes today'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email' className='text-sm'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='name@example.com'
                className='bg-background'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password' className='text-sm'>
                Password (min. 8 characters)
              </Label>
              <Input
                id='password'
                type='password'
                name='password'
                placeholder='*********'
                className='bg-background'
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
              {error && (
                <p className='text-xs text-red-500'>
                  {error}
                </p>
              )}
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading}
              onClick={
                isSignUp ? handleSignup : handleLogin
              }
            >
              {isLoading
                ? 'Please wait...'
                : isSignUp
                ? 'Sign Up'
                : 'Log In'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className='text-xs text-muted-foreground text-center w-full'>
          {isSignUp
            ? 'Already have an account? '
            : "Don't have an account yet? "}
          <a
            className='underline underline-offset-2'
            onClick={() => {
              setIsSignUp(!isSignUp);
            }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </a>{' '}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
