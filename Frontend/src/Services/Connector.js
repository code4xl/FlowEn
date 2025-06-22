//This will create an axios instance so no need to create and call the axios functions everywhere just call the function and pass data to this Connector object.
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with a base URL
export const axiosInstance = axios.create({
  baseURL: apiUrl || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This enables sending/receiving HTTP-only cookies
});

// API Connector Function
export const apiConnector = (method, url, bodyData, headers, params) => {
  console.log('API Connector: ', method, url, bodyData, headers, params);
  
  // No need to handle tokens manually - they're in HTTP-only cookies
  headers = headers || {};
  
  console.log('Making request with HTTP-only cookies');
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers,
    params: params || null,
  });
};