import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const api = 'http://localhost:8080/api';

const LandingPage = () => {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError('Enter your email and password');
      return;
    }

    try {
      const response = await axios.post(
        `${api}/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data.user);

      if (response.status === 200) {
        setUser(response.data.user);
        console.log('navigating home');
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
      setError('Enter your email and password');
      return;
    }

    try {
      const response = await axios.post(
        `${api}/register`,
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data.user);

      if (response.status === 200) {
        setUser(response.data.user);
        console.log('navigating home');
        navigate('/home');
      }
    } catch (err) {
      console.log(err);
      console.error(err);
      setError(
        (err as any).response?.data?.error || 'Signup failed. Please try again.'
      );
    }
  };

  return (
    <div className='min-h-[100dvh] flex flex-col md:flex-row items-center'>
      <div className='w-full md:flex-1 flex flex-col justify-center items-center p-8 md:p-0'>
        <h1 className="text-3xl md:text-4xl font-bold text-center font-['Libre_Baskerville',Times,serif] mb-8 md:mb-0">
          Welcome to CVBuilder
        </h1>
      </div>
      <div className='w-full md:w-auto p-4 md:m-16'>
        <div className="w-full md:w-auto bg-white text-black font-['Libre_Baskerville',Times,serif] p-8 md:p-12 rounded-[0.1rem] shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_12px_0_rgba(0,0,0,0.2)]">
          <div className='login-content'>
            <h2 className='text-[1.4em] mb-7'>
              {isSignUp ? 'Signup' : 'Login'} to CVBuilder
            </h2>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              text='continue_with'
              logo_alignment='center'
              containerProps={{
                style: {
                  backgroundColor: 'black',
                  borderRadius: ' 5px',
                  boxShadow: ' 0px 4px 6px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                },
              }}
            />
            <div className="flex items-center justify-center gap-3 my-[0.8em] mt-4 relative before:content-[''] before:flex-1 before:h-[0.1px] before:bg-black after:content-[''] after:flex-1 after:h-[0.1px] after:bg-black">
              <span className='px-[5px] text-black text-[0.6em]'>or</span>
            </div>
            <div className='flex flex-col gap-4 mb-2'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='email' className='text-[0.6em]'>
                  Your Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className='border border-[rgb(69,69,69)] px-2 py-1 outline-none transition-[border-bottom] duration-400 h-8 text-[0.6em] text-black focus:border-[var(--accent-clr)]'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='password' className='text-[0.6em]'>
                  Your Password
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className='border border-[rgb(69,69,69)] px-2 py-1 outline-none transition-[border-bottom] duration-400 h-8 text-[0.6em] text-black focus:border-[var(--accent-clr)]'
                />
              </div>
            </div>
            {/* TODO */}
            {/* {!isSignUp && (
              <a
                className='text-right block text-[0.5em] text-[rgb(77,5,115)]'
                href='forgot-password'
              >
                Forgot password
              </a>
            )} */}
            <p className='text-[0.5em] text-red-500 mb-4 h-[0.5em]'>{error}</p>

            <button
              className='w-full py-[0.6em] text-[0.9em] font-semibold mb-4 text-white bg-black text-center cursor-pointer rounded-[5px] transition-all duration-300 ease-in-out hover:shadow-[0px_5px_7px_rgba(0,0,0,0.2)]'
              onClick={isSignUp ? handleSignup : handleLogin}
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
            <p className='text-[0.6em] justify-self-center text-[darkslategray]'>
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <a
                className='text-[rgb(77,5,115)]'
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
