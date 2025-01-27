import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import TimesheetForm from '../components/TimesheetForm';
import { getAllTimesheets, deleteTimesheet, updateTimesheet, createTimesheet } from '../services/api';
import { toast } from 'react-toastify';

export default function TimesheetPage() {
  const [timesheets, setTimesheets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [error, setError] = useState('');

  // Fetch all timesheets
  const fetchTimesheets = async () => {
    try {
      const response = await getAllTimesheets();
      console.log('API Response:', response); // Debugging the API response
      if (response.success && response.data) {
        setTimesheets(response.data); // Ensure the data matches your backend structure
        setError('');
      } else {
        setError('No data received from server');
        toast.error('Failed to fetch timesheets');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch timesheets');
      toast.error('Failed to fetch timesheets');
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  // Handle delete timesheet
  const handleDelete = async (id) => {
    try {
      const response = await deleteTimesheet(id);
      if (response.success) {
        toast.success('Timesheet deleted successfully');
        await fetchTimesheets();
      } else {
        toast.error(response.error || 'Failed to delete timesheet');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete timesheet');
    }
  };

  // Handle form submission (create/update)
  const handleFormSubmit = async (formData) => {
    try {
      let response;
      if (selectedTimesheet && selectedTimesheet.id) {
        // Ensure we're passing a number
        const timesheetId = parseInt(selectedTimesheet.id, 10);
        response = await updateTimesheet(timesheetId, formData);
        
        if (response.success) {
          toast.success('Timesheet updated successfully');
          setShowForm(false);
          setSelectedTimesheet(null);
          await fetchTimesheets();
        } else {
          const errorMsg = response.error?.includes('not found')
            ? 'Timesheet not found. It may have been deleted.'
            : response.error || 'Failed to update timesheet';
          toast.error(errorMsg);
        }
      } else {
        response = await createTimesheet(formData);
        if (response.success) {
          toast.success('Timesheet created successfully');
          setShowForm(false);
          await fetchTimesheets();
        } else {
          toast.error(response.error || 'Failed to create timesheet');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'An error occurred while saving');
    }
  };

  // Add this function at the top of your component
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-');
  };

  return (
    <div>
      <div className="mb-6 ml-4">
        <h1 className="text-2xl font-bold text-gray-900">Timesheet Records</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your team's timesheet entries
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm max-w-5xl ml-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Timesheet
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>

                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                 
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Task Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-right pr-16 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(timesheets) && timesheets.map((timesheet) => (
                  <tr key={timesheet.id} className="hover:bg-gray-50 transition-colors duration-200">
                       <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {timesheet.employeeId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(timesheet.date)}
                      </div>
                    </td>
                 
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {timesheet.hoursWorked}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {timesheet.taskDetails}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setSelectedTimesheet(timesheet);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(timesheet.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!Array.isArray(timesheets) || timesheets.length === 0) && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No timesheets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <TimesheetForm
          onClose={() => {
            setShowForm(false);
            setSelectedTimesheet(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={selectedTimesheet}
        />
      )}
    </div>
  );
}
