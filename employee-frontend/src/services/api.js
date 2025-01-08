import axios from 'axios';

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
    console.log('Signup Request Data:', userData); // Log request data
    const response = await api.post('/employees/signup', userData);
    console.log('Signup Response:', response.data); // Log response
    return response.data;
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    // Return a structured error response
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed. Please try again.'
    };
  }
};

export const login = async (credentials) => {
  try {
    console.log('Login Request Data:', credentials); // Log request data
    const response = await api.post('/employees/login', credentials);
    console.log('Login Response:', response.data); // Log response
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

export const getAllEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Fetch employees error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    console.log('Update Employee Data:', { id, employeeData }); // Log request data
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Update employee error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete employee error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export default api; 