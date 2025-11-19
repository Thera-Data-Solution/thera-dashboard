import { authApi } from ".";

export async function getLinks() {
  const res = await authApi.get("/links");
  return res.data;
}

export async function createLinks(data: FormData) {
  const res = await authApi.post("/links", data);
  return res.data;
}

export async function getById(id: string) {
  const res = await authApi.get("/links/" + id);
  return res.data;
}

export async function updateLink(id: string, data: FormData) {
  const res = await authApi.put(`/links/${id}`, data);
  return res.data;
}

export async function orderUp(id: string) {
  const res = await authApi.post(`/links/${id}/order/up`);
  return res.data;
}

export async function orderDown(id: string) {
  const res = await authApi.post(`/links/${id}/order/down`);
  return res.data;
}

export async function deleteLink(id: string) {
  const res = await authApi.delete(`/links/${id}`);
  return res.data;
}
