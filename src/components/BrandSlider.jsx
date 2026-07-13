import { useState, useEffect } from "react"
import { getBrands, getImageUrl } from "../lib/api"

export default function BrandSlider() {
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const data = await getBrands()
            setBrands(data || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                </div>
            </section>
        )
    }

    if (!brands.length) return null

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                        Marcas
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black mt-2">
                        Nuestras marcas
                    </h2>
                </div>

                <div className="relative overflow-hidden">
                    <div className="flex gap-14 items-center animate-scroll">
                        {[...brands, ...brands].map((brand, i) => (
                            <a
                                key={`${brand.id_brand || i}-${i}`}
                                href={`/catalogo?marca=${brand.name_brand}`}
                                className="shrink-0 flex flex-col items-center justify-center gap-2 px-6"
                            >
                                {(brand.image_brand || brand.logo_brand) ? (
                                    <img
                                        src={getImageUrl(`/images/brands/${brand.image_brand || brand.logo_brand}`)}
                                        alt={brand.name_brand || "Marca"}
                                        className="h-12 w-auto object-contain opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                                        onError={(e) => {
                                            e.target.style.display = "none"
                                        }}
                                    />
                                ) : null}
                                <span className="text-sm font-semibold text-gray-400">
                                    {brand.name_brand || ""}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                    width: fit-content;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}
