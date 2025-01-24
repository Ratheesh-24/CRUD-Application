import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signup } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    mobileNo: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending registration data:', formData);

      const dataToSend = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      console.log('Transformed registration data:', dataToSend);

      const response = await signup(dataToSend);
      
      console.log('Registration response:', response);

      if (response.token) {
        setError('');
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.message || 'Registration failed');
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('An error occurred. Please try again.');
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-blue-600  bg-clip-text text-transparent">
            Create Account
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
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <input
              type="number"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div>
            <input
              type="tel"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
              text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/30 focus:border-transparent transition duration-200"
              placeholder="Mobile Number"
              value={formData.mobileNo}
              onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-blue-800  
            text-white rounded-xl hover:opacity-90 transition-all duration-200 
            shadow-lg hover:shadow-blue-500/25 text-sm"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="hover:text-blue-600 transition-colors duration-200">
            Already have an account? <span className="text-blue-600">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}