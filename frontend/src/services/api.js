import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

// 1. Attach the token before EVERY request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Automatically refresh the token if it expires (403/401 error)
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        // Prevent infinite loops on refresh endpoint
        if (originalRequest.url === '/refresh') {
            return Promise.reject(error);
        }

        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const res = await axios.post(`${API_URL}/refresh`, { token: refreshToken });

                // Save the brand new tokens
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);

                // Retry the original request with the new keycard!
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                // If the refresh token is also dead, kick them out to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
