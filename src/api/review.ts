import { authApi } from ".";

export async function getTestimoni() {
    const res = await authApi.get("/booking/testimoni");
    return res.data;
}

export async function updateTestimoni(id: string, data: { showTesti: boolean }) {
    const res = await authApi.post(`/booking/testimoni/${id}`, data);
    return res.data;
}
