import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import EmployeeForm from '../components/EmployeeForm';
import Navbar from '../components/Navbar';
import { getAllEmployees, deleteEmployee, updateEmployee } from '../services/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      if (response && response.data) {
        setEmployees(response.data);
        setError('');
      } else {
        setError('No data received from server');
        toast.error('Failed to fetch employees');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch employees');
      toast.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await deleteEmployee(id);
        if (response.success) {
          toast.success('Employee deleted successfully');
          await fetchEmployees();
        } else {
          toast.error(response.message || 'Failed to delete employee');
        }
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Failed to delete employee');
      }
    }
  };

  return (
    <div className="bg-[#f8fafc] w-screen min-h-screen">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your team members and their information</p>
          </div>
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
            text-white rounded-xl hover:opacity-90 transition-all duration-200 
            shadow-lg hover:shadow-blue-500/25 text-sm font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Employee
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">All Employees</h2>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {employees.length} total
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Contact Information
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 font-medium text-sm">
                            {employee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500 sm:hidden">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                      <div className="text-sm text-gray-500">{employee.mobileNo}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowForm(true);
                          }}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                        >
                          <PencilIcon className="h-5 w-5 transition-transform transform hover:scale-110" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        >
                          <TrashIcon className="h-5 w-5 transition-transform transform hover:scale-110" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Form Modal */}
        {showForm && (
          <EmployeeForm
            employee={selectedEmployee}
            onClose={() => {
              setShowForm(false);
              setSelectedEmployee(null);
            }}
            onSubmit={async (formData) => {
              try {
                if (selectedEmployee) {
                  const response = await updateEmployee(selectedEmployee.id, formData);
                  if (response.success) {
                    toast.success('Employee updated successfully');
                  } else {
                    toast.error(response.message || 'Failed to update employee');
                  }
                } else {
                  toast.success('Employee created successfully');
                }
                await fetchEmployees();
                setShowForm(false);
                setSelectedEmployee(null);
              } catch (err) {
                console.error('Form submission error:', err);
                toast.error('Failed to save employee');
              }
            }}
          />
        )}
      </div>
    </div>
  );
} 