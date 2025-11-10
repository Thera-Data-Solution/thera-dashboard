import { authApi } from ".";

export async function getSchedules() {
    const res = await authApi.get("/schedules");
    return res.data;
}

export async function createSchedules(data: FormData) {
    const res = await authApi.post("/schedules", data);
    return res.data;
}

export async function updateSchedules(id: string, data: FormData) {
    const res = await authApi.put(`/schedules/${id}`, data);
    return res.data;
}

export async function deleteSchedules(id: string) {
    const res = await authApi.delete(`/schedules/${id}`);
    return res.data;
}
