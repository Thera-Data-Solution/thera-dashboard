import { QueryClient } from '@tanstack/react-query';
import { authApi } from '.';
import axios from 'axios';

export const queryClient = new QueryClient();

// Kita tidak perlu lagi API_BASE_URL dan TOKEN di sini karena authApi sudah menanganinya
// const API_BASE_URL = 'https://potential-elysee-keps-8395b96e.koyeb.app/api';
// const TOKEN = 'da8e470c-39f6-4b6c-85de-92739b3df417';

export const apiService = {
  get: async <T>(endpoint: string) => {
    try {
      const response = await authApi.get<T>(`/${endpoint}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  post: async <T, U>(endpoint: string, data: U | FormData) => {
    try {
      // Axios akan otomatis mengatur Content-Type jika data adalah FormData
      const response = await authApi.post<T>(`/${endpoint}`, data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  put: async <T, U>(endpoint: string, id: string, data: U | FormData) => {
    try {
      const response = await authApi.put<T>(`/${endpoint}/${id}`, data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  delete: async <T>(endpoint: string, id: string) => {
    try {
      const response = await authApi.delete<T>(`/${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
};