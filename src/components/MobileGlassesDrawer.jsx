import { useState, useEffect, useMemo } from "react"
import { RiSearchLine, RiCloseLine, RiCheckboxCircleFill } from "react-icons/ri"
import { getProducts, getCategories, getImageUrl } from "../lib/api"

export default function MobileGlassesDrawer() {
    const [open, setOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [activeFilter, setActiveFilter] = useState("Todas")
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [selectedSku, setSelectedSku] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const [productsData, categoriesData] = await Promise.all([
                getProducts({ per_page: 100 }),
                getCategories()
            ])
            setProducts(productsData.data || [])
            setCategories(categoriesData || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            if (product.state?.id_state !== 1) return false
            if (activeFilter !== "Todas") {
                if (product.category?.name_category !== activeFilter) return false
            }
            if (!search) return true
            const term = search.toLowerCase()
            return (
                product.name_product?.toLowerCase().includes(term) ||
                product.sku_product?.toLowerCase().includes(term) ||
                product.category?.name_category?.toLowerCase().includes(term)
            )
        })
    }, [products, activeFilter, search])

    const handleSelect = (product) => {
        setSelectedSku(product.sku_product)
        const mainImage = product.images?.find(img => img.priority_image === 1)?.url_image || "/gafas/rayban.jpg"
        const model3D = product.images?.find(img => img.image_3d === 1)?.url_image || null

        window.dispatchEvent(
            new CustomEvent("change-glasses", {
                detail: {
                    referencia: product.sku_product,
                    marca: product.category?.name_category || "Sin marca",
                    material: product.description_product || "Metal",
                    precio: product.priceSale_product,
                    img: getImageUrl(mainImage),
                    model3d: model3D ? getImageUrl(model3D) : null,
                    name: product.name_product,
                },
            })
        )
        setOpen(false)
    }

    return (
        <>
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className={`lg:hidden fixed left-1/2 -translate-x-1/2 z-40 bg-linear-to-r from-primary to-secondary text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-primary/30 active:scale-95 transition ${selectedSku ? "bottom-24" : "bottom-6"}`}
                >
                    Ver modelos
                </button>
            )}

            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <div className="relative bg-white rounded-t-2xl max-h-[75vh] flex flex-col animate-fade-in shadow-2xl">
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />

                        <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                            <h2 className="text-lg font-bold">Elige tu estilo</h2>
                            <button onClick={() => setOpen(false)} className="p-1">
                                <RiCloseLine size={22} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="px-4 pt-3 pb-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded-full w-full pl-8 py-2 text-sm border border-gray-300 outline-none"
                                    placeholder="Buscar..."
                                />
                                <RiSearchLine className="absolute top-1/2 -translate-y-1/2 left-2.5 text-gray-400 text-sm" />
                            </div>
                        </div>

                        <div className="px-4 pb-2 overflow-x-auto">
                            <div className="flex gap-1.5 min-w-max">
                                <button
                                    onClick={() => setActiveFilter("Todas")}
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${activeFilter === "Todas"
                                        ? "bg-linear-to-r from-primary to-secondary text-white"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    Todas
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id_category}
                                        onClick={() => setActiveFilter(cat.name_category)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${activeFilter === cat.name_category
                                            ? "bg-linear-to-r from-primary to-secondary text-white"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {cat.name_category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pb-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    No hay productos disponibles
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {filteredProducts.map((product) => {
                                        const mainImage = product.images?.find(img => img.priority_image === 1)?.url_image || "/gafas/rayban.jpg"
                                        const isSelected = selectedSku === product.sku_product

                                        return (
                                            <div
                                                key={product.id_product}
                                                onClick={() => handleSelect(product)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer active:scale-[0.98] transition ${isSelected ? "border-primary bg-primary/5" : "border-gray-100"
                                                }`}
                                            >
                                                <div className="size-16 rounded-lg overflow-hidden bg-gray-50 shrink-0 relative flex items-center justify-center">
                                                    <img
                                                        src={getImageUrl(mainImage)}
                                                        alt={product.name_product}
                                                        className="w-full h-full object-cover scale-150"
                                                        onError={(e) => { e.target.src = "/placeholder.png" }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/40" />
                                                    <img
                                                        src={getImageUrl(mainImage)}
                                                        alt=""
                                                        className="absolute w-20 object-contain"
                                                        onError={(e) => { e.target.src = "/placeholder.png" }}
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-sm leading-tight mb-0.5 truncate">
                                                        {product.name_product}
                                                    </h3>
                                                    <p className="text-xs text-gray-400">
                                                        {product.category?.name_category} · {product.sku_product}
                                                    </p>
                                                    <p className="text-xs text-primary font-semibold mt-0.5">
                                                        {product.priceSale_product.toLocaleString("en-US", {
                                                            style: "currency",
                                                            currency: "USD"
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="shrink-0">
                                                    {isSelected ? (
                                                        <RiCheckboxCircleFill className="text-primary text-xl" />
                                                    ) : (
                                                        <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                                                            Probar
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
