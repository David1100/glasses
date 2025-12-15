import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Product = {
    id: number;
    price: number;
    reference: string;
    montura: string;
    marca: string;
    cantidad: number;
    img: string;
    material: string;
}

type CartStore = {
    cart: Product[];
    addToCart: (product: Product) => void;
    deleteToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product: Product) => {
                const cart = get().cart;
                const existingProduct = cart.find(
                    (p) => p.reference === product.reference
                );

                if (!existingProduct) {
                    set({ cart: [...cart, { ...product, cantidad: 1 }] });
                }
            },

            deleteToCart: (product: Product) => {
                const cart = get().cart;

                // Si la cantidad es 1, elimina solo ese producto
                const updatedCart = cart.filter(
                    (p) => !(p.reference === product.reference)
                );
                set({ cart: updatedCart });
            },
            removeFromCart: (reference: string) => {
                const updatedCart = get().cart.filter((p) => p.reference !== reference);
                set({ cart: updatedCart });
            },

            clearCart: () => {
                set({ cart: [] });
            },

            totalItems: () => {
                return get().cart.reduce((total, p) => total + p.cantidad, 0);
            },

            totalPrice: () => {
                return get().cart.reduce((total, p) => total + p.price * p.cantidad, 0);
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
