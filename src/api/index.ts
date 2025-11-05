// src/api/auth.ts
import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getTenantId = () => {
  const host = window.location.hostname;

  if (host.includes("localhost")) return "c78ae261-d987-4570-9220-774846531ddf";
  if (host.includes("theravickya")) return "c78ae261-d987-4570-9220-774846531ddf";
  if (host.includes("breathworkalchemy")) return "788";

  return null;
};

const TENANT_ID = getTenantId();

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

if (TENANT_ID) {
  headers["x-tenant-id"] = TENANT_ID;
}

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers,
});

export { AxiosError, authApi };
