import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import EmployeeForm from '../components/EmployeeForm';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/employees');
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (formData) => {
    try {
      const response = await fetch('http://localhost:4000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        fetchEmployees();
        setShowForm(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create employee');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/employees/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchEmployees();
        setShowForm(false);
        setSelectedEmployee(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/employees/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          fetchEmployees();
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-200">
            {error}
          </div>
        )}
        
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add Employee
          </button>
        </div>

        <div className="bg-[#1e293b] shadow-xl rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-[#2d3748]/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{employee.mobileNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowForm(true);
                      }}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <EmployeeForm
            employee={selectedEmployee}
            onSubmit={selectedEmployee ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setSelectedEmployee(null);
            }}
          />
        )}
      </div>
    </div>
  );
} 