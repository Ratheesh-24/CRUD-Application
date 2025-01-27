import { useState, useEffect } from 'react';

export default function TimesheetForm({ initialData, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        employeeId: '',
        date: '',
        hoursWorked: '',
        taskDetails: ''
    });

    const [errors, setErrors] = useState({
        employeeId: '',
        date: '',
        hoursWorked: '',
        taskDetails: ''
    });

    const [touched, setTouched] = useState({
        employeeId: false,
        date: false,
        hoursWorked: false,
        taskDetails: false
    });

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                employeeId: initialData.employeeId || '',
                date: formatDateForInput(initialData.date) || '',
                hoursWorked: initialData.hoursWorked || '',
                taskDetails: initialData.taskDetails || ''
            });
        }
    }, [initialData]);

    const validateField = (name, value) => {
        switch (name) {
            case 'employeeId':
                if (!value) {
                    return '*Employee ID is required';
                }
                break;
            case 'date':
                if (!value) {
                    return '*Date is required';
                } else if (isNaN(new Date(value))) {
                    return '*Please enter a valid date';
                }
                break;
            case 'hoursWorked':
                if (!value) {
                    return '*Hours worked is required';
                } else if (isNaN(value) || value <= 0) {
                    return '*Please enter a valid number of hours worked';
                }
                break;
            case 'taskDetails':
                if (!value.trim()) {
                    return '*Task details are required';
                }
                break;
            default:
                return '';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            employeeId: validateField('employeeId', formData.employeeId),
            date: validateField('date', formData.date),
            hoursWorked: validateField('hoursWorked', formData.hoursWorked),
            taskDetails: validateField('taskDetails', formData.taskDetails)
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, formData[name])
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setTouched({
            employeeId: true,
            date: true,
            hoursWorked: true,
            taskDetails: true
        });

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {initialData ? 'Update Timesheet' : 'Add New Timesheet'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Employee ID Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employee ID
                            </label>
                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.employeeId && errors.employeeId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {touched.employeeId && errors.employeeId && (
                                <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
                            )}
                        </div>

                        {/* Date Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.date && errors.date ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {touched.date && errors.date && (
                                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                            )}
                        </div>

                        {/* Hours Worked Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hours Worked
                            </label>
                            <input
                                type="number"
                                name="hoursWorked"
                                value={formData.hoursWorked}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.hoursWorked && errors.hoursWorked ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {touched.hoursWorked && errors.hoursWorked && (
                                <p className="mt-1 text-sm text-red-600">{errors.hoursWorked}</p>
                            )}
                        </div>

                        {/* Task Details Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Details
                            </label>
                            <textarea
                                name="taskDetails"
                                value={formData.taskDetails}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.taskDetails && errors.taskDetails ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {touched.taskDetails && errors.taskDetails && (
                                <p className="mt-1 text-sm text-red-600">{errors.taskDetails}</p>
                            )}
                        </div>

                        {/* Form Buttons */}
                        <div className="flex justify-end space-x-3 mt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                                         hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 
                                         focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {initialData ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
