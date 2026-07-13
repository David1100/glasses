const API_URL = "https://fullmedicapp.com/api/";
// const API_URL = "http://localhost:3000/api/";

export async function getProducts(params = {}) {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = queryParams ? `${API_URL}products?${queryParams}` : `${API_URL}products`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching products");
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return { data: [], meta: { total: 0, page: 1, per_page: 10, total_pages: 1 } };
    }
}

export async function getProductById(id) {
    try {
        const response = await fetch(`${API_URL}products/${id}`);
        if (!response.ok) throw new Error("Error fetching product");
        return await response.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function getProductBySku(sku) {
    try {
        const data = await getProducts({ per_page: 100 });
        return (data.data || []).find(p => p.sku_product === sku) || null;
    } catch (error) {
        console.error("Error fetching product by SKU:", error);
        return null;
    }
}

export async function getCategories() {
    try {
        const response = await fetch(`${API_URL}categorys`);
        if (!response.ok) throw new Error("Error fetching categories");
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function getFaceTypes() {
    try {
        const response = await fetch(`${API_URL}faceTypes`);
        if (!response.ok) throw new Error("Error fetching face types");
        return await response.json();
    } catch (error) {
        console.error("Error fetching face types:", error);
        return [];
    }
}

export async function getBrands() {
    try {
        const response = await fetch(`${API_URL}brands`);
        if (!response.ok) throw new Error("Error fetching brands");
        return await response.json();
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
}

export function getImageUrl(path) {
    if (!path) return "/placeholder.png";
    if (path.startsWith('https')) return path;
    return `${API_URL}${path.replace(/^\//, '')}`;
}