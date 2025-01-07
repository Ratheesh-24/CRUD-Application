import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const dataToSend = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      const response = await fetch('http://localhost:4000/api/employees/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      
      
      if (data.success) {
        setError('');
        toast.success('Registration successful! Redirecting to login...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Navigate after a short delay to show the toast
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.message);
        setError(data.message);
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 w-screen overflow-x-hidden">
      <div className="w-full max-w-md mx-auto">
        <div className="backdrop-blur-lg bg-white/80 p-6 rounded-2xl shadow-xl border border-white/40">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-1 text-sm text-gray-600">Join our community today!</p>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-lg bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
                text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500/30 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

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

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
                text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500/30 focus:border-transparent transition duration-200"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-200 
                text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500/30 focus:border-transparent transition duration-200"
                placeholder="Enter your mobile number"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white rounded-xl hover:opacity-90 transition-all duration-200 
              shadow-lg hover:shadow-blue-500/25 text-sm font-medium"
            >
              Create Account
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <Link to="/login" className="hover:text-blue-600 transition-colors duration-200">
              Already have an account?{' '}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}