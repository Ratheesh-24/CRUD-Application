import { useState, useEffect } from 'react';

export default function EmployeeForm({ employee, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        mobileNo: employee.mobileNo || ''
      });
    }
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.mobileNo) {
      setError('All fields are required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {employee ? 'Update Employee' : 'Add New Employee'}
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
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white rounded-xl hover:opacity-90 transition-all duration-200 
              shadow-lg hover:shadow-blue-500/25 text-sm"
            >
              {employee ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
