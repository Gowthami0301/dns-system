import axios from 'axios';

const BASE_URL = 'http://localhost:2000'; // Replace with your backend API base URL

// Login API call
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token); // Store token in local storage
    return token;
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Get all domains API call
export const getAllDomains = async () => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await axios.get(`${BASE_URL}/domains`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch domains');
  }
};

// Create domain API call
export const createDomain = async (domainName) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await axios.post(`${BASE_URL}/domains`, { domainName }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create domain');
  }
};

// Delete domain API call
export const deleteDomain = async (domainId) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    await axios.delete(`${BASE_URL}/domains/${domainId}`, { headers: { Authorization: `Bearer ${token}` } });
  } catch (error) {
    throw new Error('Failed to delete domain');
  }
};


// Update domain API call
export const updateDomain = async (domainId, newName, newDnsRecords) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${BASE_URL}/domains/${domainId}`,
      { newName, newDnsRecords },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to update domain');
  }
};