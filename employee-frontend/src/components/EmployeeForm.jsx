import { useState, useEffect } from 'react';

export default function EmployeeForm({ employee, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        mobileNo: ''
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        mobileNo: false
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                mobileNo: employee.mobileNo || ''
            });
        }
    }, [employee]);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    return '*Name is required';
                } else if (value.trim().length < 2) {
                    return '*Name must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    return '*Email is required';
                } else if (!emailRegex.test(value)) {
                    return '*Please enter a valid email address';
                }
                break;
            case 'mobileNo':
                const mobileRegex = /^[0-9]{10}$/;
                if (!value.trim()) {
                    return '*Mobile number is required';
                } else if (!mobileRegex.test(value)) {
                    return '*Please enter a valid 10-digit mobile number';
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
            email: validateField('email', formData.email),
            mobileNo: validateField('mobileNo', formData.mobileNo)
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            mobileNo: true
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
                        {employee ? 'Update Employee' : 'Add New Employee'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.name && errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {touched.name && errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.email && errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {touched.email && errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Mobile Number Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                ${touched.mobileNo && errors.mobileNo ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {touched.mobileNo && errors.mobileNo && (
                                <p className="mt-1 text-sm text-red-600">{errors.mobileNo}</p>
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
                                {employee ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
