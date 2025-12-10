import { authApi } from ".";

export async function getPartners() {
    const res = await authApi.get("/partner");
    return res.data;
}

export async function getPartnerById(id: string) {
    const res = await authApi.get(`/partner/${id}`);
    return res.data;
}

export async function createPartner(data: FormData) {
    const res = await authApi.post("/partner", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function updatePartner(id: string, data: FormData) {
    const res = await authApi.put(`/partner/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function deletePartner(id: string) {
    const res = await authApi.delete(`/partner/${id}`);
    return res.data;
}
