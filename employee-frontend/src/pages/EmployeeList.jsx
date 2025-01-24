import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import EmployeeForm from '../components/EmployeeForm';
import Navbar from '../components/Navbar';
import { getAllEmployees, deleteEmployee, updateEmployee, createEmployee, exportEmployeesCSV } from '../services/api';
import { toast } from 'react-toastify';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    employeeId: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(6);
  const [pagination, setPagination] = useState({});
  const [filterBy, setFilterBy] = useState('all');

  const fetchEmployees = async () => {
    try {
      let sortByField = 'name';
      let sortDirection = 'asc';

      // Handle different filter options
      switch (filterBy) {
        case 'name_asc':
          sortByField = 'name';
          sortDirection = 'asc';
          break;
        case 'name_desc':
          sortByField = 'name';
          sortDirection = 'desc';
          break;
        case 'recent':
          sortByField = 'createdAt';
          sortDirection = 'desc';
          break;
        case 'oldest':
          sortByField = 'createdAt';
          sortDirection = 'asc';
          break;
        default:
          break;
      }

      const response = await getAllEmployees({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortByField,
        sortOrder: sortDirection,
        search: searchTerm
      });

      if (response.success && response.data) {
        setEmployees(response.data.employees);
        const pagination = response.data.pagination;
        
        if (pagination) {
          setTotalItems(pagination.total);
          setTotalPages(pagination.pages);
        }
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
  }, [filterBy, currentPage, itemsPerPage, searchTerm]);

  const handleDelete = async (id) => {
    setDeleteConfirmation({ show: true, employeeId: id });
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteEmployee(deleteConfirmation.employeeId);
      if (response.success) {
        toast.success('Employee deleted successfully');
        await fetchEmployees();
      } else {
        toast.error(response.message || 'Failed to delete employee');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete employee');
    } finally {
      setDeleteConfirmation({ show: false, employeeId: null });
    }
  };

  const sortEmployees = (employees) => {
    return [...employees].sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase();
      const bValue = b[sortField]?.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  };

  const SortableHeader = ({ field, label }) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
      onClick={() => {
        if (sortField === field) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortDirection('asc');
        }
      }}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortField === field && (
          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortEmployees(filteredEmployees).slice(indexOfFirstItem, indexOfLastItem);

  const Pagination = () => {
    return (
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{' '}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const handleExport = async () => {
    let loadingToast = null;
    try {
        // Show loading toast
        loadingToast = toast.loading('Exporting employees...');
        
        const blob = await exportEmployeesCSV();
        
        // Validate blob
        if (!(blob instanceof Blob)) {
            throw new Error('Invalid export data received');
        }

        // Create URL and trigger download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `employees-${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
        
        // Update loading toast to success
        if (loadingToast) {
            toast.update(loadingToast, {
                render: 'Export completed successfully',
                type: 'success',
                isLoading: false,
                autoClose: 3000
            });
        }
    } catch (error) {
        console.error('Export error:', error);
        
        // Update loading toast to error
        if (loadingToast) {
            toast.update(loadingToast, {
                render: error.message || 'Failed to export employees',
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
        } else {
            toast.error(error.message || 'Failed to export employees');
        }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
        if (selectedEmployee) {
            // Update existing employee
            console.log('Updating employee:', selectedEmployee.id, formData);
            const response = await updateEmployee(selectedEmployee.id, formData);
            
            if (response.success) {
                toast.success('Employee updated successfully');
                setShowForm(false);
                setSelectedEmployee(null);
                await fetchEmployees(); // Refresh the list
            } else {
                toast.error(response.message || 'Failed to update employee');
            }
        } else {
            // Create new employee
            console.log('Creating new employee:', formData);
            const response = await createEmployee(formData);
            
            if (response.success) {
                toast.success('Employee created successfully');
                setShowForm(false);
                await fetchEmployees(); // Refresh the list
            } else {
                toast.error(response.message || 'Failed to create employee');
            }
        }
    } catch (error) {
        console.error('Form submission error:', error);
        toast.error(error.message || 'An error occurred while saving');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your team members and their information
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-end gap-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">View All Employees</option>
              <option value="name_asc">Sort by Name (A to Z)</option>
              <option value="name_desc">Sort by Name (Z to A)</option>
              <option value="recent">Show Recent First</option>
              <option value="oldest">Show Oldest First</option>
            </select>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg 
                       hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>

            <button
              onClick={() => {
                setSelectedEmployee(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Employee
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Mobile
                  </th>
                  <th scope="col" className="px-6 py-3 text-right pr-16 text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap w-1/4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/3">
                        <div className="text-sm text-gray-600">
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/4">
                        <div className="text-sm text-gray-600">
                          {employee.mobileNo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right w-1/6">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {employees.length > 0 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{Math.min(((currentPage - 1) * itemsPerPage) + 1, totalItems)}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </span>{' '}
                      of <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current page
                          return page === 1 || 
                                 page === totalPages || 
                                 Math.abs(currentPage - page) <= 1;
                        })
                        .map((page, index, array) => {
                          // Add ellipsis where there are gaps
                          if (index > 0 && page - array[index - 1] > 1) {
                            return [
                              <span key={`ellipsis-${page}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>,
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            ];
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation({ show: false, employeeId: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 