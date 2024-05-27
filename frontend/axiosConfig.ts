import axios, { AxiosInstance } from 'axios';
import {Platform} from "react-native";

const baseURL = Platform.select({
    ios: 'http://localhost:8080', // URL dla iOS
    android: 'http://10.0.2.2:8080', // URL dla Android Emulator
});
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
