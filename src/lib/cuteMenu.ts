export const getParentPath = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    return "/" + parts.slice(0, 2).join("/");
};