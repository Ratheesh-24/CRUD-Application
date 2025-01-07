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
    <div className="w-screen h-screen bg-blue-50 overflow-y-auto">
      <div className="container mx-auto min-h-screen flex items-center justify-center py-4">
        <div className="w-[400px] bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-lg border border-gray-200/60">
          <div className="text-center mb-3">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-1 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          {error && (
            <div className="mb-2 p-2 rounded bg-red-50 border border-red-400 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
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
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-gray-600 hover:text-blue-600">
              Don't have an account? <span className="font-semibold text-blue-600">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 