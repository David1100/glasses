import { useState, useEffect, useMemo } from "react"
import { RiSearchLine, RiEyeLine, RiArrowRightLine, RiCloseLine } from "react-icons/ri"
import { getProducts, getCategories, getImageUrl } from "../lib/api"

const ITEMS_PER_PAGE = 12

function FilterPanel({ filteredProducts, hasActiveFilters, clearFilters, categories, activeCategory, setActiveCategory, faceTypes, activeFaceType, setActiveFaceType, genders, activeGender, setActiveGender, brands, activeBrand, setActiveBrand }) {
    return (
        <div className="p-5 lg:p-0 space-y-6">
            {/* Filter status */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                        {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""}
                    </span>
                    <button
                        onClick={clearFilters}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                        Limpiar todo
                    </button>
                </div>
            )}

            {/* Category */}
            <div>
                <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                    Categor&iacute;a
                </span>
                <div className="space-y-0.5">
                    <button
                        onClick={() => setActiveCategory("Todas")}
                        className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                            activeCategory === "Todas"
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Todas
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id_category}
                            onClick={() => setActiveCategory(cat.name_category)}
                            className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                                activeCategory === cat.name_category
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {cat.name_category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Face type */}
            {faceTypes.length > 0 && (
                <div>
                    <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                        Tipo de rostro
                    </span>
                    <div className="space-y-0.5">
                        {faceTypes.map(ft => (
                            <button
                                key={ft}
                                onClick={() => setActiveFaceType(activeFaceType === ft ? null : ft)}
                                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                                    activeFaceType === ft
                                        ? "bg-gray-900 text-white font-semibold"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                Rostro {ft}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Gender */}
            {genders.length > 0 && (
                <div>
                    <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                        G&eacute;nero
                    </span>
                    <div className="space-y-0.5">
                        {genders.map(g => (
                            <button
                                key={g}
                                onClick={() => setActiveGender(activeGender === g ? null : g)}
                                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                                    activeGender === g
                                        ? "bg-gray-900 text-white font-semibold"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {g === "male" ? "Hombre" : g === "female" ? "Mujer" : "Unisex"}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Brand */}
            {brands.length > 0 && (
                <div>
                    <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                        Marca
                    </span>
                    <div className="space-y-0.5">
                        {brands.map(b => (
                            <button
                                key={b}
                                onClick={() => setActiveBrand(activeBrand === b ? null : b)}
                                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                                    activeBrand === b
                                        ? "bg-gray-900 text-white font-semibold"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Catalogo() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState("Todas")
    const [activeFaceType, setActiveFaceType] = useState(null)
    const [activeGender, setActiveGender] = useState(null)
    const [activeBrand, setActiveBrand] = useState(null)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [page, setPage] = useState(1)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const categoria = params.get("categoria")
        const tipoRostro = params.get("tipo_rostro")
        const genero = params.get("genero")
        const marca = params.get("marca")

        if (categoria) setActiveCategory(categoria)
        if (tipoRostro) setActiveFaceType(tipoRostro)
        if (genero) setActiveGender(genero)
        if (marca) setActiveBrand(marca)
    }, [])

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

    const faceTypes = useMemo(() => {
        const types = new Set()
        products.forEach(p => {
            if (p.faceType?.name_faceType) types.add(p.faceType.name_faceType)
        })
        return Array.from(types)
    }, [products])

    const genders = useMemo(() => {
        const set = new Set()
        products.forEach(p => {
            if (p.gender_product) set.add(p.gender_product)
        })
        return Array.from(set)
    }, [products])

    const brands = useMemo(() => {
        const set = new Set()
        products.forEach(p => {
            if (p.brand?.name_brand) set.add(p.brand.name_brand)
        })
        return Array.from(set)
    }, [products])

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => p.state?.id_state === 1)

        if (activeCategory !== "Todas") {
            result = result.filter(p => p.category?.name_category === activeCategory)
        }

        if (activeFaceType) {
            result = result.filter(p =>
                p.faceType?.name_faceType?.toLowerCase() === activeFaceType.toLowerCase()
            )
        }

        if (activeGender) {
            result = result.filter(p => p.gender_product === activeGender)
        }

        if (activeBrand) {
            result = result.filter(p =>
                p.brand?.name_brand?.toLowerCase() === activeBrand.toLowerCase()
            )
        }

        if (search) {
            const term = search.toLowerCase()
            result = result.filter(p =>
                p.name_product?.toLowerCase().includes(term) ||
                p.sku_product?.toLowerCase().includes(term) ||
                p.category?.name_category?.toLowerCase().includes(term) ||
                p.faceType?.name_faceType?.toLowerCase().includes(term)
            )
        }

        return result
    }, [products, activeCategory, activeFaceType, activeGender, activeBrand, search])

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const paginatedProducts = filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    useEffect(() => {
        setPage(1)
    }, [search, activeCategory, activeFaceType, activeGender, activeBrand])

    useEffect(() => {
        const params = new URLSearchParams()
        if (activeCategory !== "Todas") params.set("categoria", activeCategory)
        if (activeFaceType) params.set("tipo_rostro", activeFaceType)
        if (activeGender) params.set("genero", activeGender)
        if (activeBrand) params.set("marca", activeBrand)

        const qs = params.toString()
        window.history.replaceState({}, "", qs ? `/catalogo?${qs}` : "/catalogo")
    }, [activeCategory, activeFaceType, activeGender, activeBrand])

    function clearFilters() {
        setSearch("")
        setActiveCategory("Todas")
        setActiveFaceType(null)
        setActiveGender(null)
        setActiveBrand(null)
        setPage(1)
    }

    const hasActiveFilters = activeCategory !== "Todas" || activeFaceType || activeGender || activeBrand || search

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Active filters bar */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap mb-6 p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtros:</span>
                    {activeCategory !== "Todas" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {activeCategory}
                            <button onClick={() => setActiveCategory("Todas")} className="hover:text-primary/70">
                                <RiCloseLine size={14} />
                            </button>
                        </span>
                    )}
                    {activeFaceType && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            Rostro {activeFaceType}
                            <button onClick={() => setActiveFaceType(null)} className="hover:text-primary/70">
                                <RiCloseLine size={14} />
                            </button>
                        </span>
                    )}
                    {activeGender && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {activeGender === "male" ? "Hombre" : activeGender === "female" ? "Mujer" : "Unisex"}
                            <button onClick={() => setActiveGender(null)} className="hover:text-primary/70">
                                <RiCloseLine size={14} />
                            </button>
                        </span>
                    )}
                    {activeBrand && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            Marca: {activeBrand}
                            <button onClick={() => setActiveBrand(null)} className="hover:text-primary/70">
                                <RiCloseLine size={14} />
                            </button>
                        </span>
                    )}
                    {search && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            "{search}"
                            <button onClick={() => setSearch("")} className="hover:text-primary/70">
                                <RiCloseLine size={14} />
                            </button>
                        </span>
                    )}
                    <button
                        onClick={clearFilters}
                        className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                        Limpiar todo
                    </button>
                </div>
            )}

            {/* Search */}
            <div className="relative mb-6 lg:mb-8">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, marca o referencia..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
            </div>

            <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 xl:gap-10">

                {/* ===== SIDEBAR ===== */}
                {/* Desktop: always visible. Mobile: inside drawer overlay */}
                <aside className="hidden lg:block">
                    <FilterPanel
                        filteredProducts={filteredProducts}
                        hasActiveFilters={hasActiveFilters}
                        clearFilters={clearFilters}
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        faceTypes={faceTypes}
                        activeFaceType={activeFaceType}
                        setActiveFaceType={setActiveFaceType}
                        genders={genders}
                        activeGender={activeGender}
                        setActiveGender={setActiveGender}
                        brands={brands}
                        activeBrand={activeBrand}
                        setActiveBrand={setActiveBrand}
                    />
                </aside>

                {/* ===== MOBILE: toggle button + drawer ===== */}
                <div className="lg:hidden mb-5">
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="7" y1="12" x2="20" y2="12" />
                            <line x1="10" y1="18" x2="20" y2="18" />
                        </svg>
                        Filtros
                    </button>
                </div>

                {/* Drawer overlay */}
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/40 transition-opacity"
                            onClick={() => setMobileFiltersOpen(false)}
                        />
                        <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
                            <div className="flex items-center justify-between px-5 pt-5 pb-2">
                                <span className="text-sm font-bold text-gray-800">Filtros</span>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <RiCloseLine size={18} />
                                </button>
                            </div>
                            <FilterPanel
                                filteredProducts={filteredProducts}
                                hasActiveFilters={hasActiveFilters}
                                clearFilters={clearFilters}
                                categories={categories}
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                                faceTypes={faceTypes}
                                activeFaceType={activeFaceType}
                                setActiveFaceType={setActiveFaceType}
                                genders={genders}
                                activeGender={activeGender}
                                setActiveGender={setActiveGender}
                                brands={brands}
                                activeBrand={activeBrand}
                                setActiveBrand={setActiveBrand}
                            />
                        </aside>
                    </div>
                )}

                {/* ===== PRODUCTS AREA ===== */}
                <div>
                    {/* Results count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-400">
                            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="lg:hidden text-xs text-gray-400 hover:text-red-500 transition-colors"
                            >
                                Limpiar todo
                            </button>
                        )}
                    </div>

                    {/* Products grid */}
                    {paginatedProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No hay productos que coincidan con tu b&uacute;squeda</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-primary font-semibold text-sm hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {paginatedProducts.map(product => {
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
                                                onError={e => { e.target.src = "/placeholder.png" }}
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
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <RiArrowRightLine size={16} className="rotate-180" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`size-10 rounded-full text-sm font-semibold transition-all ${
                                        page === p
                                            ? "bg-linear-to-r from-primary to-secondary text-white shadow-md"
                                            : "border border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <RiArrowRightLine size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
