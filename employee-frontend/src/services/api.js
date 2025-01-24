import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

// Define the base URL for your API
const BASE_URL = 'https://crud-application-a3g2.onrender.com/api'; // Add /api here

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      endpoint: error.config.url,
      method: error.config.method,
      data: error.config.data,
      response: error.response?.data,
      status: error.response?.status
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

        const response = await axios.get(
            `${API_URL}/employees?${queryString}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        );

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

export default api; 