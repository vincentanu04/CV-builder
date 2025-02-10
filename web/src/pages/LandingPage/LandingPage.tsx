import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const api = 'http://localhost:8080/api';

const LandingPage = () => {
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
    if (email == '' || password == '') {
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

  return (
    <div className='page-container'>
      <div className='landing-card'>
        <h1>Welcome to CVBuilder</h1>
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
