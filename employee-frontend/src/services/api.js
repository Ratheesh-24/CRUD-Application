import API_BASE_URL from '../config/api';

// Signup
const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Login
const login = async (credentials) => {
  try {
    console.log('Making login request to:', `${API_BASE_URL}/employees/login`);
    
    const response = await fetch(`${API_BASE_URL}/employees/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    console.log('Raw response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login response data:', data);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get all employees
const getAllEmployees = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    return await response.json();
  } catch (error) {
    console.error('Get employees error:', error);
    throw error;
  }
};

// Update employee
const updateEmployee = async (id, employeeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Update employee error:', error);
    throw error;
  }
};

// Delete employee
const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete employee error:', error);
    throw error;
  }
};

export {
  signup,
  login,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
}; 