import { authApi } from ".";

export async function getCategories() {
    const res = await authApi.get("/categories");
    return res.data;
}

export async function getCategoryById(id: string) {
    const res = await authApi.get(`/categories/${id}`);
    return res.data;
}

export async function createCategory(data: FormData) {
    const res = await authApi.post("/categories", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function updateCategory(id: string, data: FormData) {
    const res = await authApi.put(`/categories/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function deleteCategory(id: string) {
    const res = await authApi.delete(`/categories/${id}`);
    return res.data;
}
