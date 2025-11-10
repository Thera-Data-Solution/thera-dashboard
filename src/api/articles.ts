import { authApi } from ".";

export async function getArticles() {
    const res = await authApi.get("/articles");
    return res.data;
}

export async function getArticleById(id: string) {
    const res = await authApi.get(`/articles/${id}`);
    return res.data;
}

export async function createArticle(data: FormData) {
    const res = await authApi.post("/articles", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export async function updateArticle(id: string, data: FormData) {
    const res = await authApi.put(`/articles/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}