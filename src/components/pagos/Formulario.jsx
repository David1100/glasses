import { useState } from "react";
import { RiAccountPinBoxFill, RiArrowRightLine, RiCaravanFill, RiMapPinLine } from "react-icons/ri";
import { useEnvioStore } from "../../hooks/useEnvioStore";

export default function Formulario({onShipping}) {
    const { setDetalleEnvio,detalleEnvio } = useEnvioStore();
    const [form, setForm] = useState({
        email:detalleEnvio?.email ?? "",
        nombre: detalleEnvio?.nombre ?? "",
        apellidos: detalleEnvio?.apellidos ?? "",
        direccion: detalleEnvio?.direccion ?? "",
        ciudad: detalleEnvio?.ciudad ?? "",
        codigoPostal: detalleEnvio?.codigoPostal ?? "",
        pais: detalleEnvio?.pais ?? "",
        telefono: detalleEnvio?.telefono ?? "",
        shipping: detalleEnvio?.shipping ?? "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name==='shipping'){
            onShipping(value)
        }
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.nombre.trim()) newErrors.nombre = "Nombre requerido";
        if (!form.apellidos.trim()) newErrors.apellidos = "Apellidos requeridos";
        if (!form.direccion.trim()) newErrors.direccion = "Dirección requerida";
        if (!form.ciudad.trim()) newErrors.ciudad = "Ciudad requerida";
        if (!form.codigoPostal.trim()) newErrors.codigoPostal = "Código postal requerido";
        if (!form.telefono.trim()) newErrors.telefono = "Teléfono requerido";
        if (!form.email.trim()) newErrors.email = "Email requerido";

        if (!/^[0-9]+$/.test(form.codigoPostal))
            newErrors.codigoPostal = "Solo números";

        if (!/^[0-9]{7,15}$/.test(form.telefono))
            newErrors.telefono = "Teléfono inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const jsonData = {
            ...form,
        };
        setDetalleEnvio(jsonData);
        location.href= '/metodoPago'
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div
                className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2
                        className="text-xl font-bold flex items-center gap-2"
                    >
                        <RiAccountPinBoxFill className="text-primary" />
                        Información de Contacto
                    </h2>
                </div>
                <div className="space-y-4">
                    <label className="block">
                        <span
                            className="text-sm font-medium  mb-1 block"
                        >Correo Electrónico</span >
                        <input
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2 text-gray-700"
                            placeholder="ejemplo@correo.com"
                            type="email" value={form.email} name="email"
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </label>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <RiMapPinLine className="text-primary" />
                    Dirección de Envío
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium ">Nombre</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2 text-gray-700"
                            type="text"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium ">Apellidos</label>
                        <input
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2 text-gray-700"
                            type="text"
                        />
                        {errors.apellidos && <p className="text-red-500 text-xs">{errors.apellidos}</p>}
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="block text-sm font-medium ">Dirección</label>
                        <input
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2 text-gray-700"
                            type="text"
                        />
                        {errors.direccion && <p className="text-red-500 text-xs">{errors.direccion}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium ">Ciudad</label>
                        <input
                            name="ciudad"
                            value={form.ciudad}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2 text-gray-700"
                            type="text"
                        />
                        {errors.ciudad && <p className="text-red-500 text-xs">{errors.ciudad}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium ">Código Postal</label>
                        <input
                            name="codigoPostal"
                            value={form.codigoPostal}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2 text-gray-700"
                            type="text"
                        />
                        {errors.codigoPostal && (
                            <p className="text-red-500 text-xs">{errors.codigoPostal}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium ">País</label>
                        <select
                            name="pais"
                            value={form.pais}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2.5 text-gray-700"
                        >
                            <option>España</option>
                            <option>México</option>
                            <option>Argentina</option>
                            <option>Colombia</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium ">Teléfono</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-white border-gray-300 shadow border outline-none transition-all px-4 py-2 text-gray-700"
                            type="tel"
                        />
                        {errors.telefono && (
                            <p className="text-red-500 text-xs">{errors.telefono}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 mt-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <RiCaravanFill className="text-primary" />
                    Método de Envío
                </h2>

                <div className="space-y-3">
                    <label className={`${form.shipping === "standard" ? 'bg-primary/10 border-primary' : 'bg-transparent border-gray-200 '} relative flex items-center p-4 rounded-lg border cursor-pointer`}>
                        <input
                            type="radio"
                            name="shipping"
                            value="standard"
                            checked={form.shipping === "standard"}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <div className="ml-4 grow">
                            <span className="block text-sm font-semibold text-gray-400">
                                Envío Estándar
                            </span>
                        </div>
                        <span className="text-sm font-bold">Gratis</span>
                    </label>
                    <label className={`${form.shipping === "express" ? 'bg-primary/10 border-primary' : 'bg-transparent border-gray-200 '} relative flex items-center p-4 rounded-lg border cursor-pointer`}>
                        <input
                            type="radio"
                            name="shipping"
                            value="express"
                            checked={form.shipping === "express"}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <div className="ml-4 grow">
                            <span className="block text-sm font-semibold text-gray-400">
                                Envío Express
                            </span>
                        </div>
                        <span className="text-sm font-bold ">€9.90</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-linear-to-r from-primary to-secondary text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2"
                >
                    Continuar al Pago
                    <RiArrowRightLine />
                </button>
            </div>
        </form>
    );
}
