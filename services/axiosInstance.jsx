
import useAuthStore from '@/store/AuthStore';
import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'http://dhk.cracktech.org:8004/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // withCredentials: false,
});

console.log("Here Comes Interceptor")

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    
    const { authorization } = useAuthStore.getState();

    console.log('Token in store:', authorization);
    
    if (authorization) {
      config.headers.Authorization = `MedicalHigherStudy ${authorization}`;
    }

    return config;
  },
  (error) => {
    console.log("ERror ---->",error)
    return Promise.reject(error);
  }
);

export const getAuthHeaders = () => {
  const { authorization } = useAuthStore.getState();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (authorization) {
    headers['Authorization'] = `MedicalHigherStudy ${authorization}`;
    console.log('🔑 Auth header added manually:', headers.Authorization);
  } else {
    console.log('🔴 No authorization token found');
  }
  
  return headers;
};


console.log("Here Comes Interceptor")

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
