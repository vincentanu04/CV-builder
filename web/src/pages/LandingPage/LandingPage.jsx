import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';

const api = 'https://your-backend-api.com';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email == '' || password == '') {
      setError('Enter your email and password');
      return;
    }

    try {
      console.log(email, password);
      const response = await fetch(`${api}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.log(err);
      setError('Something went wrong. Please try again later.', err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if the token exists in cookies or localStorage
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('authToken='))
          ?.split('=')[1];

        if (!token) {
          return;
        }

        const response = await fetch(`${api}/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log('Token verified. Redirecting to home page.');
          navigate('/home');
        } else {
          console.log('Token invalid. Staying on login page.');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className='page-container'>
      <div className='landing-card'>
        <h1>Welcome to CVBuilder</h1>
        {/* <p>Create and customize your resume easily.</p>
        <div>
          <Link to='/resume'>
            <button>Create Resume as Guest</button>
          </Link>
          <Link to='/login'>
            <button>Login</button>
          </Link>
        </div> */}
      </div>
      <div className='login-card'>
        <div className='login-content'>
          <h2 className='login-card-title'>Login to CVBuilder</h2>
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
              },
            }}
          />
          <div className='or-divider'>
            <span>or</span>
          </div>
          <div className='input-container-container'>
            <div className='input-container'>
              <label htmlFor='email'>Your Email</label>
              <input
                type='email'
                id='email'
                name='email'
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='input-container'>
              <label htmlFor='password'>Your Password</label>
              <input
                type='password'
                id='password'
                name='password'
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <a className='forgot-password' href=''>
            Forgot password
          </a>
          <p className='error-message'>{error}</p>

          <button className='login-button' onClick={handleLogin}>
            Log In
          </button>
          <p className='no-account'>
            Dont have an account? <a href=''>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
