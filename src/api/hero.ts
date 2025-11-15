import { authApi } from ".";

export async function getHero() {
    const res = await authApi.get("/hero");
    return res.data;
}
export async function createOrUpdateHero(data: FormData) {
    const res = await authApi.post("/hero", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}