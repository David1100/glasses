import { useState, useEffect } from "react"
import { RiArrowLeftLine, RiEyeLine, RiShoppingCartLine } from "react-icons/ri"
import { getProductBySku, getProducts, getImageUrl } from "../lib/api"
import { useCartStore } from "../hooks/useCart"

export default function ProductDetail() {
    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const { addToCart } = useCartStore()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const sku = params.get("sku")
        if (!sku) {
            setLoading(false)
            return
        }
        getProductBySku(sku).then(p => {
            setProduct(p)
            setLoading(false)
            if (p?.category?.name_category) {
                getProducts({ per_page: 100 }).then(data => {
                    const related = (data.data || [])
                        .filter(r => r.category?.name_category === p.category.name_category && r.id_product !== p.id_product)
                        .slice(0, 4)
                    setRelatedProducts(related)
                })
            }
        })
    }, [])

    function handleAddToCart() {
        addToCart({
            reference: product.sku_product,
            price: product.priceSale_product,
            marca: product.brand?.name_brand || "",
            img: getImageUrl(product.images?.find(i => i.priority_image === 1)?.url_image || ""),
            material: "",
            cantidad: 1,
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="text-center py-24">
                <p className="text-gray-400 text-lg mb-4">Producto no encontrado</p>
                <a href="/catalogo" className="text-primary font-semibold text-sm hover:underline">
                    Volver al catálogo
                </a>
            </div>
        )
    }

    const images = product.images?.length
        ? product.images.sort((a, b) => a.priority_image - b.priority_image)
        : [{ url_image: "/gafas/rayban.jpg" }]

    function handleAddToCart() {
        addToCart({
            reference: product.sku_product,
            price: product.priceSale_product,
            marca: product.brand?.name_brand || "",
            img: getImageUrl(product.images?.find(i => i.priority_image === 1)?.url_image || ""),
            material: "",
            cantidad: 1,
        })
    }

    return (
        <div>
            <a
                href="/catalogo"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
            >
                <RiArrowLeftLine size={16} />
                Volver al catálogo
            </a>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                {/* Images */}
                <div className="mb-6 lg:mb-0">
                    <div className="aspect-square rounded-2xl bg-white shadow-sm overflow-hidden mb-4">
                        <img
                            src={getImageUrl(images[selectedImage]?.url_image)}
                            alt={product.name_product}
                            className="w-full h-full object-contain p-8"
                            onError={e => { e.target.src = "/placeholder.png" }}
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`shrink-0 size-16 rounded-xl border-2 overflow-hidden transition-all ${
                                        i === selectedImage
                                            ? "border-primary"
                                            : "border-gray-100 hover:border-gray-200"
                                    }`}
                                >
                                    <img
                                        src={getImageUrl(img.url_image)}
                                        alt=""
                                        className="w-full h-full object-contain p-2"
                                        onError={e => { e.target.style.display = "none" }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                        {product.category?.name_category || "Montura"}
                    </p>
                    <h1 className="text-3xl font-black tracking-tight mb-1">
                        {product.name_product}
                    </h1>
                    {product.brand?.name_brand && (
                        <p className="text-sm text-gray-400 mb-4">
                            {product.brand.name_brand}
                        </p>
                    )}

                    <p className="text-sm text-gray-500 mb-2">
                        SKU: {product.sku_product}
                    </p>

                    <p className="text-3xl font-bold text-gray-900 mb-6">
                        {product.priceSale_product?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                        })}
                    </p>

                    {product.description_product && (
                        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                            {product.description_product}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center justify-center gap-2 bg-linear-to-r from-primary to-secondary text-white font-semibold rounded-xl px-8 py-3.5 text-sm hover:opacity-90 transition-all shadow-md"
                        >
                            <RiShoppingCartLine size={18} />
                            Agregar al carrito
                        </button>

                        {product.model3d && (
                            <a
                                href={`/probar?producto=${product.sku_product}`}
                                className="flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold rounded-xl px-8 py-3.5 text-sm hover:bg-gray-800 transition-all"
                            >
                                <RiEyeLine size={18} />
                                Prueba virtual
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <section className="mt-16">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                        Relacionados
                    </span>
                    <h2 className="text-2xl font-black mt-1 mb-8">
                        M&aacute;s en {product.category?.name_category}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {relatedProducts.map(rp => {
                            const img = rp.images?.find(i => i.priority_image === 1)?.url_image || "/gafas/rayban.jpg"
                            return (
                                <a
                                    key={rp.id_product}
                                    href={`/producto?sku=${rp.sku_product}`}
                                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-white p-4">
                                        <img
                                            src={getImageUrl(img)}
                                            alt={rp.name_product}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            onError={e => { e.target.src = "/placeholder.png" }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-primary font-medium mb-1">
                                            {rp.category?.name_category || "Montura"}
                                        </p>
                                        <h3 className="font-bold text-sm leading-tight mb-1">
                                            {rp.name_product}
                                        </h3>
                                        <span className="font-bold text-sm text-gray-800">
                                            {rp.priceSale_product?.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                minimumFractionDigits: 0,
                                            })}
                                        </span>
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </section>
            )}
        </div>
    )
}
