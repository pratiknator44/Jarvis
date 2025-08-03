import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001', // change this to your API base URL
    timeout: 1000000,
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // or from context/state
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('[Request]', config);
        return config;
    },
    (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('[Response]', response);
        return response;
    },
    (error) => {
        console.error('[Response Error]', error);
        if (error.response?.status === 401) {
            // Handle unauthorized access globally
            window.location.href = '/login'; // or navigate programmatically
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
