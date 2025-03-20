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
import { api } from '@/api/auth';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface AccountCardProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
}

const AccountCard = ({ isSignUp, setIsSignUp }: AccountCardProps) => {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    try {
      const response = await axios.post(
        `${api}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      setError(
        (err as any).response?.data?.message ||
          'Login failed. Please try again.'
      );
    }
  };

  const handleSignup = async () => {
    if (email === '' || password === '') {
      setError('Please enter your email and password!');
      return;
    }

    try {
      const response = await axios.post(
        `${api}/register`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      setError(
        (err as any).response?.data?.error || 'Signup failed. Please try again.'
      );
    }
  };

  return (
    <Card className='relative border-2 shadow-lg mt-12'>
      <CardHeader>
        <CardTitle className='text-2xl tracking-wider'>
          {isSignUp ? 'Create your FREE account!' : 'Welcome back!'}
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
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className='text-xs text-red-500'>{error}</p>}
            </div>
            <Button
              type='submit'
              className='w-full'
              onClick={isSignUp ? handleSignup : handleLogin}
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
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
