import API_BASE_URL from '../config/api.js';

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
    const response = await fetch(`${API_BASE_URL}/employees/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get all employees
const getAllEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
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