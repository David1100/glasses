import { useState, useEffect } from "react"
import { RiArrowRightLine, RiEyeLine } from "react-icons/ri"
import { getProducts, getImageUrl } from "../lib/api"

export default function FeaturedProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const data = await getProducts({ per_page: 8 })
            setProducts(data.data || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <section className="py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                </div>
            </section>
        )
    }

    if (!products.length) return null

    return (
        <section className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                            Destacados
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black mt-2">
                            Monturas populares
                        </h2>
                    </div>
                    <a
                        href="/probar"
                        className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Ver catálogo completo <RiArrowRightLine />
                    </a>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => {
                        const mainImage = product.images?.find(img => img.priority_image === 1)?.url_image || "/gafas/rayban.jpg"

                        return (
                            <div
                                key={product.id_product}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-white p-4">
                                    <img
                                        src={getImageUrl(mainImage)}
                                        alt={product.name_product}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = "/placeholder.png"
                                        }}
                                    />
                                    {product.model3d && (
                                        <a
                                            href={`/probar?producto=${product.sku_product}`}
                                            className="absolute top-2 right-2 z-10 size-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white hover:scale-110 transition-all"
                                            title="Prueba virtual"
                                        >
                                            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                <line x1="12" y1="22.08" x2="12" y2="12" />
                                            </svg>
                                        </a>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <a
                                            href={`/producto?sku=${product.sku_product}`}
                                            className="flex items-center gap-2 bg-white text-gray-800 font-semibold rounded-full px-5 py-2.5 text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                        >
                                            <RiEyeLine />
                                            Ver ahora
                                        </a>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="text-xs text-primary font-medium mb-1">
                                        {product.category?.name_category || "Montura"}
                                    </p>
                                    <h3 className="font-bold text-sm leading-tight mb-1">
                                        {product.name_product}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            {product.sku_product}
                                        </span>
                                        <span className="font-bold text-sm text-gray-800">
                                            {product.priceSale_product?.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                minimumFractionDigits: 0,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
