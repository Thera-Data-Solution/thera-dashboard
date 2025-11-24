import { authApi } from ".";

export async function getGallery() {
    const res = await authApi.get("/gallery");
    return res.data;
}

export async function getGalleryById(id: string) {
    const res = await authApi.get(`/gallery/${id}`);
    return res.data;
}

export async function createGallery(data: FormData) {
    const res = await authApi.post("/gallery", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function updateGallery(id: string, data: FormData) {
    const res = await authApi.put(`/gallery/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function deleteGalley(id: string) {
    const res = await authApi.delete(`/gallery/${id}`);
    return res.data;
}