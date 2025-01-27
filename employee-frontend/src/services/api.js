import axios from 'axios';
import { data } from 'react-router-dom';

// Get the API URL from environment variables, with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Enable if using cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for better error handling
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers
    });
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

// API functions
export const signup = async (userData) => {
  try {
    console.log('Signup Request Data:', userData);
    const response = await api.post('/employees/signup', userData);
    console.log('Signup Response:', response.data);
    return response.data; // This already contains { token, employee }
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      message: error.response?.data?.message || 'Registration failed. Please try again.'
    };
  }
};

export const login = async (credentials) => {
  try {
    console.log('Login Request Data:', credentials);
    const response = await api.post('/employees/login', credentials);
    console.log('Login Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please try again.'
    };
  }
};

export const getAllEmployees = async (params = {}) => {
    try {
        const queryString = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 6,
            sortBy: params.sortBy || 'name',
            sortOrder: params.sortOrder || 'asc',
            search: params.search || '',
            filterBy: params.filterBy || 'all'
        }).toString();

        const response = await api.get(`/employees?${queryString}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

export const updateEmployee = async (id, employeeData) => {
    try {
        // Make sure we're using the local development URL
        const response = await axios.put(
            `${API_URL}/employees/${id}`,
            employeeData,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error.response?.data || error;
    }
};

export const deleteEmployee = async (id) => {
    try {
        const response = await axios.delete(
            `${API_URL}/employees/${id}`,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            }
        );

        console.log('Delete response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error.response?.data || error;
    }
};

export const createEmployee = async (employeeData) => {
  try {
    // Only send required fields
    const { name, email, mobileNo } = employeeData;
    
    const response = await axios.post(
      `${API_URL}/employees`,
      { name, email, mobileNo },
      {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Create employee response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error.response?.data || error;
  }
};

export const exportEmployeesCSV = async () => {
    try {
        console.log('Using API URL:', API_URL); // Debug log
        const response = await axios.get(
            `${API_URL}/employees/export`,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                responseType: 'blob'
            }
        );

        // Check if the response is CSV
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('text/csv')) {
            return response.data;
        }

        // If response is not CSV, it's probably an error
        const textResponse = await response.data.text();
        try {
            const errorData = JSON.parse(textResponse);
            throw new Error(errorData.message || 'Export failed');
        } catch (e) {
            throw new Error('Failed to export employees');
        }
    } catch (error) {
        console.error('Export error:', error);
        throw error;
    }
};

//Timesheet Logic

export const getAllTimesheets = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/timesheets`,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
                
            }
        );

        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching timesheets:', error);
        throw error;
    }
};

export const createTimesheet = async (timesheetData) => {
    try {
        const response = await axios.post(
            `${API_URL}/timesheets`,
            timesheetData,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating timesheet:', error);
        throw error.response?.data || error;
    }
};

export const updateTimesheet = async (id, timesheetData) => {
    try {
        // Ensure id is a number
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            throw new Error('Invalid timesheet ID');
        }

        const response = await axios.put(
            `${API_URL}/timesheets/${numericId}`,
            timesheetData,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return { success: false, error: 'Timesheet not found' };
        }
        if (error.response?.data) {
            return error.response.data;
        }
        return { success: false, error: error.message };
    }
};

export const deleteTimesheet = async (id) => {
    try {
        // Ensure id is a number
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            throw new Error('Invalid timesheet ID');
        }

        const response = await axios.delete(
            `${API_URL}/timesheets/${numericId}`,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return { success: false, error: 'Timesheet not found' };
        }
        if (error.response?.data) {
            return error.response.data;
        }
        return { success: false, error: error.message };
    }
};

export const getProfile = async (employeeId) => {
    try {
        const response = await api.get(`/profile/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error.response?.data || error;
    }
};

export const updateProfile = async (employeeId, profileData) => {
    try {
        // Handle profile image separately if it's a File object
        let formData;
        if (profileData.profileImage instanceof File) {
            formData = new FormData();
            formData.append('profileImage', profileData.profileImage);
            
            // Append other profile data
            Object.keys(profileData).forEach(key => {
                if (key !== 'profileImage') {
                    formData.append(key, profileData[key]);
                }
            });

            const response = await api.put(`/profile/${employeeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // If no new image, send regular JSON
            const response = await api.put(`/profile/${employeeId}`, profileData);
            return response.data;
        }
    } catch (error) {
        console.error('Error updating profile:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error.response?.data || error;
    }
};

export default api; 