import { useState, useEffect, useMemo } from "react"
import { RiCheckboxCircleFill, RiSearchLine, RiSunLine } from "react-icons/ri"
import { getProducts, getCategories, getImageUrl } from "../lib/api"

export default function Asidebar() {
    const [selectedGlasses, setSelectedGlasses] = useState(null)
    const [activeFilter, setActiveFilter] = useState("Todas")
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [faceTypeFilter, setFaceTypeFilter] = useState(null)
    const [loading, setLoading] = useState(true)

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

        const params = new URLSearchParams(window.location.search)
        const tipoRostro = params.get("tipo_rostro")
        if (tipoRostro) {
            setFaceTypeFilter(tipoRostro)
        }
    }, [])

    const handleSelect = (product) => {
        setSelectedGlasses(product.sku_product)

        const mainImage = product.images?.find(img => img.priority_image === 1)?.url_image || "/gafas/rayban.jpg"
        const model3D = product.images?.find(img => img.image_3d === 1)?.url_image || null

        console.log("Selected product:", {
            name: product.name_product,
            imagesCount: product.images?.length,
            mainImage,
            model3D,
            allImages: product.images
        })

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
    }

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                if (product.state?.id_state !== 1) return false

                if (activeFilter !== "Todas") {
                    if (product.category?.name_category !== activeFilter) return false
                }

                if (faceTypeFilter) {
                    const faceTypeName = product.faceType?.name_faceType?.toLowerCase() || ""
                    if (!faceTypeName.includes(faceTypeFilter.toLowerCase())) return false
                }

                if (!search) return true

                const term = search.toLowerCase()
                return (
                    product.name_product?.toLowerCase().includes(term) ||
                    product.sku_product?.toLowerCase().includes(term) ||
                    product.category?.name_category?.toLowerCase().includes(term)
                )
            })
    }, [products, activeFilter, search, faceTypeFilter])

    const handleFilterClick = (filter) => {
        setActiveFilter(filter)
        setFaceTypeFilter(null)
    }

    const handleClearFaceType = () => {
        setFaceTypeFilter(null)
        const url = new URL(window.location.href)
        url.searchParams.delete("tipo_rostro")
        window.history.replaceState({}, "", url)
    }

    return (
        <aside className="w-full h-full bg-white p-5 flex flex-col gap-4 my-2 shadow">
            <div>
                <h2 className="text-xl font-bold mb-4">Elige tu estilo</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-full w-full pl-7 py-2 text-sm border border-gray-300 outline-none text-gray-400"
                        placeholder="Busca por marca, modelo o referencia..."
                    />
                    <RiSearchLine className="absolute top-0.5 text-primary translate-y-1/2 ml-2" />
                </div>
            </div>

            {faceTypeFilter && (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
                    <div>
                        <p className="text-xs text-gray-500">Filtro activo:</p>
                        <p className="text-sm font-bold text-primary">Rostro {faceTypeFilter}</p>
                    </div>
                    <button
                        onClick={handleClearFaceType}
                        className="text-xs text-gray-500 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>
            )}

            <ul className="flex gap-1 items-center flex-wrap">
                <li>
                    <button
                        onClick={() => handleFilterClick("Todas")}
                        className={`rounded-full px-3 py-2 text-xs ${activeFilter === "Todas"
                            ? "bg-linear-to-r from-primary to-secondary text-white font-semibold"
                            : "bg-white border border-gray-300"
                            }`}
                    >
                        Todas
                    </button>
                </li>

                {categories.map(cat => (
                    <li key={cat.id_category}>
                        <button
                            onClick={() => handleFilterClick(cat.name_category)}
                            className={`rounded-full px-3 py-2 text-xs ${activeFilter === cat.name_category
                                ? "bg-linear-to-r from-primary to-secondary text-white font-semibold"
                                : "bg-white border border-gray-300"
                                }`}
                        >
                            {cat.name_category}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="flex flex-col gap-2 h-86 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p>No hay productos disponibles</p>
                        {faceTypeFilter && (
                            <button
                                onClick={handleClearFaceType}
                                className="mt-2 text-sm text-primary hover:underline"
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                ) : (
                    filteredProducts.map((product, index) => {
                        const mainImage = product.images?.find(img => img.priority_image === 1)?.url_image || "/gafas/rayban.jpg"

                        return (
                            <div
                                key={product.id_product}
                                onClick={() => handleSelect(product)}
                                className={`rounded-xl p-3 flex flex-col gap-2 cursor-pointer border-2 ${selectedGlasses === product.sku_product
                                    ? "border-primary"
                                    : "border-gray-100"
                                    }`}
                            >
                                <div className="relative overflow-hidden rounded-xl">
                                    <img
                                        src={getImageUrl(mainImage)}
                                        alt={product.name_product}
                                        className="w-full h-full object-cover scale-150"
                                        onError={(e) => {
                                            e.target.src = "/placeholder.png"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/60 z-10" />

                                    {selectedGlasses === product.sku_product && (
                                        <RiCheckboxCircleFill className="absolute right-1 top-1 text-primary text-xl z-20" />
                                    )}

                                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                                        <img src={getImageUrl(mainImage)} alt="gafa" className="w-56" onError={(e) => { e.target.src = "/placeholder.png" }} />
                                    </div>
                                </div>

                                <footer>
                                    <h1 className="font-bold text-base leading-tight mb-1">
                                        {product.name_product}
                                    </h1>
                                    <p className="text-xs text-primary font-medium mb-1">
                                        Rostro {product.faceType?.name_faceType || "Todos"}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">{product.category?.name_category} · {product.sku_product}</span>
                                        <span
                                            className={`font-bold text-sm ${selectedGlasses === product.sku_product
                                                ? "text-primary"
                                                : "text-white"
                                                }`}
                                        >
                                            {product.priceSale_product.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD"
                                            })}
                                        </span>
                                    </div>
                                </footer>

                                {selectedGlasses !== product.sku_product && (
                                    <button className="w-full bg-gray-100 rounded-full mt-2 py-2 text-sm text-gray-400 font-semibold">
                                        Probar ahora
                                    </button>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <footer>
                <div className="flex gap-4 p-4 border border-primary rounded-2xl bg-primary/10">
                    <RiSunLine className="text-primary text-4xl" />
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