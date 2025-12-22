import axios, { AxiosError } from "axios";

const API_BASE_URL = '/be/api';

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers,
});

export { AxiosError, authApi };
