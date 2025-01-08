import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as loginAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAPI(formData);
      console.log('Login response:', response);

      // Check for success and data structure
      if (response.success && response.data) {
        // Store the token from the correct path
        const token = response.data.token;
        const employeeData = response.data.employee;

        localStorage.setItem('token', token);
        
        // Update auth context with employee data
        authLogin({
          ...employeeData,
          token
        });

        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        const errorMessage = response?.message || 'Login failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Send the token to your backend
      const response = await loginAPI({
        googleToken: credentialResponse.credential,
        email: decoded.email
      });

      if (response.success && response.data) {
        const token = response.data.token;
        const employeeData = response.data.employee;

        localStorage.setItem('token', token);
        authLogin({
          ...employeeData,
          token
        });

        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Please try again.');
    }
  };

  // Add check for missing Google Client ID
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    console.error('Google Client ID is not configured');
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40">
          <div className="text-red-600 text-center">
            <h3 className="font-bold mb-2">Configuration Error</h3>
            <p>Google OAuth is not configured properly.</p>
            <p className="text-sm mt-2">Please check your environment variables and ensure VITE_GOOGLE_CLIENT_ID is set.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
            text-white rounded-xl hover:opacity-90 transition-all duration-200 
            shadow-lg hover:shadow-blue-500/25 text-sm"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
              toast.error('Google login failed. Please try again.');
            }}
            useOneTap
            flow="implicit"
            auto_select={false}
            ux_mode="popup"
          />
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link to="/register" className="hover:text-blue-600 transition-colors duration-200">
            Don't have an account? <span className="text-blue-600">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 