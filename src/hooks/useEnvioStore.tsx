import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Envio = {
    email: string;
    nombre: string;
    apellidos: string;
    direccion: string;
    ciudad: string;
    postal: string;
    pais: string;
    telefono: string;
    shipping:string;
};

type EnvioStore = {
    detalleEnvio: Envio | null;
    setDetalleEnvio: (data: Envio) => void;
    clearDetalleEnvio: () => void;
};

export const useEnvioStore = create<EnvioStore>()(
    persist(
        (set) => ({
            detalleEnvio: null,

            setDetalleEnvio: (data) => {
                set({ detalleEnvio: data });
            },

            clearDetalleEnvio: () => {
                set({ detalleEnvio: null });
            },
        }),
        {
            name: "envio-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
