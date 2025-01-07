const API_BASE_URL = import.meta.env.PROD 
  ? '' // Empty string for production (will use relative paths)
  : 'http://localhost:4000';

export default API_BASE_URL; 