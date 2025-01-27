import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(credentials);
      
      if (response.token) {
        // Store both token and employee ID
        localStorage.setItem('token', response.token);
        localStorage.setItem('employeeId', response.employee.id);
        
        // Optional: Store other useful employee data
        localStorage.setItem('employeeName', response.employee.name);
        localStorage.setItem('employeeEmail', response.employee.email);

        toast.success('Login successful!');
        // Navigate to dashboard after successful login
        navigate('/employee-dashboard');
      } else {
        setError(response.message || 'Login failed');
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
      toast.error(error.message || 'An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
            Employee Login
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                email: e.target.value
              }))}
            />
          </div>

          <div>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                password: e.target.value
              }))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-blue-800  
            text-white rounded-xl hover:opacity-90 transition-all duration-200 
            shadow-lg hover:shadow-blue-500/25 text-sm disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link to="/register" className="hover:text-blue-600 transition-colors duration-200">
            Don't have an account? <span className="text-blue-600">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 