import API_BASE_URL from '../config/api.js';

// Update your API calls to use the base URL
const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/employees/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  // ... rest of your code
}; 