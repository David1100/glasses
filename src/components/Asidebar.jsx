import { useState } from "react"
import { RiCheckboxCircleFill, RiSearchLine, RiSunLine } from "react-icons/ri"



export default function Asidebar({ }) {

    const [selectedGlasses, setSelectedGlasses] = useState(1)

    const handleSelect = (lente) => {
        setSelectedGlasses(lente.id);

        window.dispatchEvent(
            new CustomEvent('change-glasses', {
                detail: lente,
            })
        );
    }

    const lentes = [
        {
            id: 1,
            nombre: "Ray-Ban Hexagonal",
            material: "Metal/Oro",
            precio: 145000,
            imagen: "/gafas/rayban.jpg"
        },
        {
            id: 2,
            nombre: "Ray-Ban Hexagonal",
            material: "Metal/Oro",
            precio: 145000,
            imagen: "/gafas/rayban.jpg"
        },
        {
            id: 3,
            nombre: "Ray-Ban Hexagonal",
            material: "Metal/Oro",
            precio: 145000,
            imagen: "/gafas/rayban.jpg"
        },
    ]

    return (
        <aside className="w-full h-full bg-primary p-5 flex flex-col gap-4 mt-20">
            <div>
                <h2 className="text-xl font-bold mb-4">Elige tu estilo</h2>
                <div className="relative">
                    <input type="text" className="bg-[#192F33] rounded-full w-full pl-7 py-2 text-sm border border-gray-700 outline-none text-gray-400" placeholder="Busca modelo o marca..." />
                    <RiSearchLine className="absolute top-1 text-gray-400 translate-y-1/2 ml-2" />
                </div>
            </div>
            <ul className="flex gap-1 items-center">
                <li className="mb-2"><a href="#" className="bg-secondary rounded-full px-3 py-2 text-black text-xs font-semibold">Todas</a></li>
                <li className="mb-2"><a href="#" className="bg-[#192F33] rounded-full px-3 py-2 text-xs border border-gray-700">Sol</a></li>
                <li className="mb-2"><a href="#" className="bg-[#192F33] rounded-full px-3 py-2 text-xs">Vista</a></li>
                <li className="mb-2"><a href="#" className="bg-[#192F33] rounded-full px-3 py-2 text-xs">Deportivas</a></li>
            </ul>
            <div className="flex flex-col gap-2 h-80 overflow-y-auto">
                {
                    lentes.map(lente => (
                        <div className={`${selectedGlasses === lente.id ? 'border-2 border-secondary' : 'border-2 border-secondary/10'}  rounded-xl p-3 flex flex-col justify-between gap-2 cursor-pointer`} onClick={() => handleSelect(lente)} key={lente.id}>
                            <div className="relative w-full h-full overflow-hidden rounded-xl">
                                {/* Imagen de fondo con zoom */}
                                <img
                                    src={lente.imagen}
                                    alt="gafas fondo"
                                    className="w-full h-full object-cover scale-150"
                                />

                                {/* Overlay oscuro */}
                                <div className="absolute inset-0 bg-black/60 z-10" />

                                {/* Imagen central pequeña */}
                                {
                                    selectedGlasses === lente.id && (
                                        <RiCheckboxCircleFill className="absolute right-1 top-1 text-secondary text-xl" />
                                    )
                                }
                                <div className="absolute inset-0 z-20 flex items-center justify-center">
                                    <img
                                        src={lente.imagen}
                                        alt="gafas"
                                        className="w-56"
                                    />
                                </div>
                            </div>

                            <footer className="">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="font-semibold">{lente.nombre}</h1>
                                        <p className="text-xs text-gray-500">{lente.material}</p>
                                    </div>
                                    <span className={`${selectedGlasses == lente.id ? 'text-secondary' : 'text-white'} font-bold text-sm`}>$ {lente.precio}</span>
                                </div>
                            </footer>
                            {
                                selectedGlasses !== lente.id && (
                                    <button className="w-full bg-[#234248] rounded-full mt-2 py-2 text-sm text-gray-300 font-semibold">Probar ahora</button>
                                )
                            }
                        </div>
                    ))
                }
            </div>
            <footer className="">
                <div className="flex gap-4 p-4 border border-secondary rounded-2xl bg-secondary/10">
                    <RiSunLine className="text-secondary text-4xl" />
                    <div className="text-xs space-y-1">
                        <h2 className="font-bold">Tip de iluminación</h2>
                        <p className="text-gray-400 text-balance">Asegurate de estar en un lugar mejor iluminado para una mejor detección.</p>
                    </div>
                </div>
            </footer>
        </aside>
    )

}