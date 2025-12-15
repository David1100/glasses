import { useState, useMemo } from "react"
import { RiCheckboxCircleFill, RiSearchLine, RiSunLine } from "react-icons/ri"
import data from "../datas/data.json"

export default function Asidebar() {
    const [selectedGlasses, setSelectedGlasses] = useState(null)
    const [activeFilter, setActiveFilter] = useState("Todas")
    const [search, setSearch] = useState("")

    const handleSelect = (gafa, item) => {
        setSelectedGlasses(gafa.referencia)

        window.dispatchEvent(
            new CustomEvent("change-glasses", {
                detail: {
                    ...gafa,
                    marca: item.marca,
                    material: item.material,
                    precio: item.precio,
                },
            })
        )
    }

    const filteredGlasses = useMemo(() => {
        return data
            .filter(item =>
                activeFilter === "Todas" ? true : item.montura === activeFilter
            )
            .flatMap(item =>
                item.gafas.map(gafa => ({
                    ...gafa,
                    item,
                }))
            )
            .filter(({ referencia, item }) => {
                if (!search) return true

                const term = search.toLowerCase()

                return (
                    referencia.toLowerCase().includes(term) ||
                    item.marca.toLowerCase().includes(term) ||
                    item.montura.toLowerCase().includes(term)
                )
            })
    }, [activeFilter, search])


    return (
        <aside className="w-full h-full bg-primary p-5 flex flex-col gap-4 lg:mt-20 mt-0">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold mb-4">Elige tu estilo</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#192F33] rounded-full w-full pl-7 py-2 text-sm border border-gray-700 outline-none text-gray-400"
                        placeholder="Busca por marca, modelo o referencia..."
                    />
                    <RiSearchLine className="absolute top-1 text-gray-400 translate-y-1/2 ml-2" />
                </div>
            </div>

            {/* Filtros */}
            <ul className="flex gap-1 items-center flex-wrap">
                <li>
                    <button
                        onClick={() => setActiveFilter("Todas")}
                        className={`rounded-full px-3 py-2 text-xs  ${activeFilter === "Todas"
                            ? "bg-secondary text-black font-semibold"
                            : "bg-[#192F33] border border-gray-700"
                            }`}
                    >
                        Todas
                    </button>
                </li>

                {data.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => setActiveFilter(item.montura)}
                            className={`rounded-full px-3 py-2 text-xs ${activeFilter === item.montura
                                ? "bg-secondary text-black font-semibold"
                                : "bg-[#192F33] border border-gray-700"
                                }`}
                        >
                            {item.montura}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Lista */}
            <div className="flex flex-col gap-2 h-80 overflow-y-auto">
                {filteredGlasses.map(({ referencia, img, item }, index) => (
                    <div
                        key={referencia + index}
                        onClick={() =>
                            handleSelect(
                                { referencia, img },
                                item
                            )
                        }
                        className={`rounded-xl p-3 flex flex-col gap-2 cursor-pointer border-2 ${selectedGlasses === referencia
                            ? "border-secondary"
                            : "border-secondary/10"
                            }`}
                    >
                        <div className="relative overflow-hidden rounded-xl">
                            <img
                                src={img}
                                alt="fondo"
                                className="w-full h-full object-cover scale-150"
                            />
                            <div className="absolute inset-0 bg-black/60 z-10" />

                            {selectedGlasses === referencia && (
                                <RiCheckboxCircleFill className="absolute right-1 top-1 text-secondary text-xl z-20" />
                            )}

                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                <img src={img} alt="gafa" className="w-56" />
                            </div>
                        </div>

                        <footer>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="font-semibold uppercase">
                                        {item.marca} - {referencia}
                                    </h1>
                                    <p className="text-xs text-gray-500">{item.material}</p>
                                </div>
                                <span
                                    className={`font-bold text-sm ${selectedGlasses === referencia
                                        ? "text-secondary"
                                        : "text-white"
                                        }`}
                                >
                                    $ {item.precio.toLocaleString()}
                                </span>
                            </div>
                        </footer>

                        {selectedGlasses !== referencia && (
                            <button className="w-full bg-[#234248] rounded-full mt-2 py-2 text-sm text-gray-300 font-semibold">
                                Probar ahora
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Tip */}
            <footer>
                <div className="flex gap-4 p-4 border border-secondary rounded-2xl bg-secondary/10">
                    <RiSunLine className="text-secondary text-4xl" />
                    <div className="text-xs space-y-1">
                        <h2 className="font-bold">Tip de iluminación</h2>
                        <p className="text-gray-400">
                            Asegúrate de estar en un lugar bien iluminado.
                        </p>
                    </div>
                </div>
            </footer>
        </aside>
    )
}
