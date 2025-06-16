// src/services/api.ts
import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Adiciona interceptor para incluir token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Tipo para erros da API
interface ApiError {
    message: string;
    statusCode?: number;
    error?: string;
}

// Função para tratamento de erros
function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        const errorMessage = axiosError.response?.data?.message ||
            axiosError.message ||
            'Erro na requisição';
        throw new Error(errorMessage);
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Erro desconhecido');
}

// Função para login
export const loginUser = async (credentials: { email: string; senha: string }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Função para registro
export const registerUser = async (userData: {
    nome: string;
    email: string;
    senha: string;
    tipo: string;
}) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export default api;