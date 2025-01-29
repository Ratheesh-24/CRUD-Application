import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ProjectForm = ({ onSubmit, onClose, project, employees }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Not Started',
        employeeId: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
        employeeId: ''
    });

    const [touched, setTouched] = useState({
        name: false,
        description: false,
        startDate: false,
        endDate: false,
        status: false,
        employeeId: false
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
                status: project.status || 'Not Started',
                employeeId: project.employeeId || ''
            });
        }
    }, [project]);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    return '*Name is required';
                } else if (value.trim().length < 2) {
                    return '*Name must be at least 2 characters';
                }
                break;
            case 'description':
                if (!value.trim()) {
                    return '*Description is required';
                }
                break;
            case 'startDate':
                if (!value.trim()) {
                    return '*Start date is required';
                }
                break;
            case 'endDate':
                if (!value.trim()) {
                    return '*End date is required';
                }
                break;
            case 'status':
                if (!value.trim()) {
                    return '*Status is required';
                }
                break;
            case 'employeeId':
                if (!value.trim()) {
                    return '*Employee is required';
                }
                break;
            default:
                return '';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            name: validateField('name', formData.name),
            description: validateField('description', formData.description),
            startDate: validateField('startDate', formData.startDate),
            endDate: validateField('endDate', formData.endDate),
            status: validateField('status', formData.status),
            employeeId: validateField('employeeId', formData.employeeId)
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

        // Validate field if it's been touched
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
            employeeId: true
        });

        if (validateForm()) {
            try {
                await onSubmit(formData);
                onClose();
            } catch (error) {
                toast.error(error.message || 'Failed to save project');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white max-h-[80vh] overflow-y-auto">
                <div className="mt-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {project ? 'Update Project' : 'Create New Project'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.name && errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                required
                            />
                            {touched.name && errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.description && errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                rows="3"
                            />
                            {touched.description && errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Start Date Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.startDate && errors.startDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                required
                            />
                            {touched.startDate && errors.startDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                            )}
                        </div>

                        {/* End Date Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.endDate && errors.endDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                required
                            />
                            {touched.endDate && errors.endDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                            )}
                        </div>

                        {/* Status Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.status && errors.status ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                required
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {touched.status && errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>

                        {/* Employee Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employee
                            </label>
                            <select
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.employeeId && errors.employeeId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.firstName} {employee.lastName}
                                    </option>
                                ))}
                            </select>
                            {touched.employeeId && errors.employeeId && (
                                <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
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
                                {project ? 'Update Project' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;