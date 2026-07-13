import { useState, useEffect } from "react"
import { RiArrowRightLine } from "react-icons/ri"
import { getCategories } from "../lib/api"

const categoryImageMap = {
    "al aire / sin montura": "/gafas/tipo_montura/sin_montura.webp",
    "montura completa": "/gafas/tipo_montura/montura_completa.webp",
    "semicompleta / al aire superior": "/gafas/tipo_montura/media_montura.webp",
}

function getCategoryImage(name) {
    return categoryImageMap[name?.toLowerCase()] || null
}

const categoryAccents = {
    "al aire / sin montura": {
        gradient: "from-rose-500 to-pink-600",
        light: "from-rose-400/30 to-pink-400/30",
        label: "Sin Montura",
    },
    "montura completa": {
        gradient: "from-primary to-secondary",
        light: "from-primary/30 to-secondary/30",
        label: "Completa",
    },
    "semicompleta / al aire superior": {
        gradient: "from-amber-500 to-orange-600",
        light: "from-amber-400/30 to-orange-400/30",
        label: "Semi",
    },
}

function getAccent(name) {
    return categoryAccents[name?.toLowerCase()] || categoryAccents["montura completa"]
}

export default function CategoriesSection() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const data = await getCategories()
            setCategories(data || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <section id="categorias" className="py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                </div>
            </section>
        )
    }

    if (!categories.length) return null

    return (
        <section id="categorias" className="py-20 sm:py-28 bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                            Categorías
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black mt-2">
                            Explora por tipo de montura
                        </h2>
                    </div>
                    <a
                        href="/probar"
                        className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Ver todas <RiArrowRightLine />
                    </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {categories.map((cat) => {
                        const imgSrc = getCategoryImage(cat.name_category)
                        const accent = getAccent(cat.name_category)
                        const displayLabel = cat.name_category
                            .replace(/ \/.*$/, "")
                            .trim()
                        return (
                            <a
                                key={cat.id_category}
                                href={`/catalogo?categoria=${encodeURIComponent(cat.name_category)}`}
                                className="group relative h-[300px] sm:h-[340px] rounded-3xl overflow-hidden bg-gray-900 hover:-translate-y-1.5 transition-all duration-500"
                            >
                                {/* Glow behind card on hover */}
                                <div className={`absolute -inset-4 bg-linear-to-r ${accent.gradient} opacity-0 group-hover:opacity-25 blur-3xl transition-opacity duration-500`} />

                                {/* Image */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
                                    {imgSrc ? (
                                        <img
                                            src={imgSrc}
                                            alt={cat.name_category}
                                            className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/50 to-gray-900/10" />

                                {/* Accent bar top */}
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${accent.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                                {/* Content */}
                                <div className="relative h-full flex flex-col justify-end p-5 sm:p-7">
                                    <div className={`inline-flex self-start px-3 py-1 rounded-full bg-linear-to-r ${accent.gradient} text-white text-[10px] font-bold uppercase tracking-wider mb-3 shadow-lg`}>
                                        {accent.label}
                                    </div>
                                    <h3 className="text-white font-black text-xl sm:text-2xl leading-tight drop-shadow-lg">
                                        {displayLabel}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mt-3 group-hover:text-white group-hover:gap-3 transition-all duration-300">
                                        Explorar categoría
                                        <RiArrowRightLine size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
