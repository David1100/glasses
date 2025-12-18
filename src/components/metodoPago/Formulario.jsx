import { useState } from "react";
import { RiAccountPinBoxFill, RiArchive2Line, RiAttachmentLine, RiBallPenLine, RiBankCardFill, RiBitCoinLine, RiFileList3Line, RiLockPasswordFill, RiMapPinLine } from "react-icons/ri";
import FirmaElectronica from "./FirmaElectronica";

export default function Formulario() {
    const [firma, setFirma] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        apellidos: "",
        f_nacimiento: "",
        n_docuemento: "",
        e_mail: "",
        telefono: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const jsonData = {
            ...form,
        };
        setDetalleEnvio(jsonData);
        setJsonPreview(jsonData);
        location.href = '/metodoPago'
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="flex flex-col gap-5 px-0 border-t border-slate-800/50 py-6">
                <div className="flex justify-between items-center">
                    <h2
                        className="text-xl font-bold text-white flex items-center gap-2"
                    >
                        <RiAccountPinBoxFill className="text-secondary" />
                        Información de Contacto
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Nombre</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="text"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Apellidos</label>
                        <input
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="text"
                        />
                        {errors.apellidos && <p className="text-red-500 text-xs">{errors.apellidos}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Fecha de nacimiento</label>
                        <input
                            name="f_nacimiento"
                            value={form.f_nacimiento}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="date"
                        />
                        {errors.f_nacimiento && <p className="text-red-500 text-xs">{errors.f_nacimiento}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300"># de documento</label>
                        <input
                            name="n_docuemento"
                            value={form.n_docuemento}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.n_docuemento && <p className="text-red-500 text-xs">{errors.n_docuemento}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">E-mail</label>
                        <input
                            name="e_mail"
                            value={form.e_mail}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="mail"
                        />
                        {errors.e_mail && <p className="text-red-500 text-xs">{errors.e_mail}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Teléfono</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Pais</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Ciudad</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300"># de seguro social</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Dirección</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <h2
                        className="text-xl font-bold text-white flex items-center gap-2"
                    >
                        <RiMapPinLine className="text-secondary" />
                        Información del Empleo Actual
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Nombre de empresa</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Cargo</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Dirección</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Teléfono</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <RiBitCoinLine className="text-secondary" />
                        Información de Ingresos
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Ingreso mensual</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Frecuencia de pago</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-background-dark border-slate-700 text-white px-4 py-2"
                            type="number"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <h2
                        className="text-xl font-bold text-white flex items-center gap-2"
                    >
                        <RiArchive2Line className="text-secondary" />
                        Documentación
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="group/file relative w-full h-28 bg-[#132023] border-2 border-dashed border-[#325e67] hover:border-primary/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all">
                        <RiFileList3Line className="material-symbols-outlined text-gray-400 group-hover/file:text-secondary mb-1 transition-colors" />
                        <span className="text-xs font-bold text-white">Seguro social</span>
                        <span className="text-[10px] text-text-secondary">PDF o Imagen</span>
                        <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
                    </div>
                    <div className="group/file relative w-full h-28 bg-[#132023] border-2 border-dashed border-[#325e67] hover:border-primary/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all">
                        <RiFileList3Line className="material-symbols-outlined text-gray-400 group-hover/file:text-secondary mb-1 transition-colors" />
                        <span className="text-xs font-bold text-white">Desprendibles de pago(2 ultimos)</span>
                        <span className="text-[10px] text-text-secondary text-center px-1">PDF o Imagen</span>
                        <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
                    </div>
                </div>

            </div>
            <FirmaElectronica onSave={setFirma} />
            <div className="flex flex-col gap-2 mt-2">
                <label
                    className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"
                >
                    <RiAttachmentLine className="material-symbols-outlined text-[16px]" />
                    Autenticación biométrica
                </label>
                <div
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#132023] border border-slate-800"
                >
                    <button
                        className="flex items-center justify-center size-14 rounded-full bg-input-bg border border-secondary/30 text-secondary shadow-[0_0_15px_rgba(19,200,236,0.2)] hover:shadow-[0_0_25px_rgba(19,200,236,0.4)] hover:bg-[#2a4e56] transition-all duration-300 group/bio"
                    >
                        <RiAttachmentLine className="material-symbols-outlined text-3xl group-hover/bio:scale-110 transition-transform" />
                    </button>
                    <div className="flex flex-col">
                        <span
                            className="text-sm font-bold text-white"
                        >Escanear huella digital</span>
                        <span
                            className="text-xs text-gray-400"
                        >Se requiere verificar la identidad por credito digital.</span>
                    </div>
                    <div className="ml-auto">
                        <span
                            className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider"
                        >Pendiente</span>
                    </div>
                </div>
            </div>
        </form>
    )
}