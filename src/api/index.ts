// src/api/auth.ts
import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const TENANT_ID = import.meta.env.VITE_TENANT;

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

if (TENANT_ID) {
  headers["x-tenant-id"] = TENANT_ID;
}

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers
});

export { AxiosError, authApi };
