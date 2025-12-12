import { authApi } from ".";

export type GetArticlesParams = {
    page?: number;
    pageSize?: number;
};


export async function getArticles(params: GetArticlesParams) {
    const stringParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    const searchParams = new URLSearchParams(stringParams);
    const res = await authApi.get(`/articles?${searchParams}`);
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