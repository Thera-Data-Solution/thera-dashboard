// src/api/auth.ts
import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-tenant-id": import.meta.env.VITE_TENANT,
  },
});

export { AxiosError, authApi };
