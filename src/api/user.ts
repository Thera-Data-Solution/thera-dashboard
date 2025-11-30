import { authApi } from ".";

export async function getUsers(page = 1) {
    const res = await authApi.get(`/users?page=${page}`);
    return res.data
}

export async function AdminGetUsers(page = 1) {
    const res = await authApi.get(`/users/admin?page=${page}`);
    return res.data
}

export async function DisableUser(id: string) {
    const res = await authApi.post(`/users/disable/${id}`);
    return res.data
}