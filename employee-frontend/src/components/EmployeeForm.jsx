import { useState, useEffect } from 'react';

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="w-[400px] bg-white rounded-lg p-5 shadow-xl">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {employee ? 'Update Employee' : 'Add New Employee'}
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              placeholder="Mobile Number"
              value={formData.mobileNo}
              onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {employee ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
