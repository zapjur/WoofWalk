import axios, { AxiosInstance } from 'axios';

let baseURL;

if (typeof navigator !== 'undefined' && navigator.userAgent) {
    const isMacOS = navigator.userAgent.indexOf('Mac OS') !== -1;
    baseURL = isMacOS ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
} else {
    baseURL = 'http://10.0.2.2:8080';
}
const apiClient: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    config => {
        // token tu
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default apiClient;
