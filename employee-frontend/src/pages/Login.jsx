import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.success) {
        login(data.data.token, data.data.employee);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 w-screen overflow-x-hidden">
      <div className="w-full max-w-md mx-auto">
        <div className="backdrop-blur-lg bg-white/80 p-8 rounded-2xl shadow-xl border border-white/40">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-lg bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
                text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500/30 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white rounded-xl hover:opacity-90 transition-all duration-200 
              shadow-lg hover:shadow-blue-500/25 text-sm font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to="/register" className="hover:text-blue-600 transition-colors duration-200">
              Don't have an account?{' '}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 