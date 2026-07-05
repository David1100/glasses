const API_URL = "https://fullmedicapp.com/api";

export async function getProducts(params = {}) {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = queryParams ? `${API_URL}/products?${queryParams}` : `${API_URL}/products`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching products");
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return { data: [], meta: { total: 0, page: 1, per_page: 10, total_pages: 1 } };
    }
}

export async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/categorys`);
        if (!response.ok) throw new Error("Error fetching categories");
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function getFaceTypes() {
    try {
        const response = await fetch(`${API_URL}/faceTypes`);
        if (!response.ok) throw new Error("Error fetching face types");
        return await response.json();
    } catch (error) {
        console.error("Error fetching face types:", error);
        return [];
    }
}

export function getImageUrl(path) {
    if (!path) return "/placeholder.png";
    if (path.startsWith('https')) return path;
    return `${API_URL}${path}`;
}