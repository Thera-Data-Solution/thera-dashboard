import { authApi } from ".";

export async function getTranslate() {
    const res = await authApi.get("/translations");
    return res.data;
}

export async function getTranslateById(id: string) {
    const res = await authApi.get(`/translations/${id}`);
    return res.data;
}


export async function createTranslate(data: FormData) {
    const res = await authApi.post("/translations", data);
    return res.data;
}

export async function updateTranslate(id: string, data: FormData) {
    const res = await authApi.put(`/translations/${id}`, data);
    return res.data;
}

export async function deleteTranslate(id: string) {
    const res = await authApi.delete(`/translations/${id}`);
    return res.data;
}
