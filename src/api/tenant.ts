import { authApi } from ".";

export async function getTenant() {
    const res = await authApi.get("/tenants");
    return res.data;
}

export async function createTenant(data: FormData) {
    const res = await authApi.post("/tenants", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function updateTenant(id: string, data: FormData) {
    const res = await authApi.put(`/tenants/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function deleteTenant(id: string) {
    const res = await authApi.delete(`/tenants/${id}`);
    return res.data;
}
