import { useState, useEffect } from "react"
import { RiArrowRightLine } from "react-icons/ri"
import { getFaceTypes, getImageUrl } from "../lib/api"

const faceTypeDescriptions = {
    "Redondo": "Las monturas angulares y geométricas equilibran la suavidad de tus rasgos.",
    "Alargado": "Las monturas oversized y con detalle en la parte superior armonizan tu rostro.",
    "Cuadrado": "Las monturas redondeadas y ovaladas suavizan la línea de la mandíbula.",
    "Corazón": "Las monturas ligeras y sin borde inferior equilibran la frente ancha.",
    "Ovalado": "Casi cualquier montura te favorece. ¡Atrévete a experimentar!",
    "Rectangular": "Las monturas curvas y envolventes suavizan la estructura alargada de tu rostro.",
    "Diamante": "Las monturas ovaladas y sin borde inferior realzan tus pómulos y equilibran tus facciones.",
    "Triangulo Invertido": "Las monturas delgadas y sin aro inferior equilibran la amplitud de tu frente.",
}

export default function FaceTypesSection() {
    const [faceTypes, setFaceTypes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const data = await getFaceTypes()
            setFaceTypes(data || [])
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

    if (!faceTypes.length) return null

    return (
        <section className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                        Tu guía de estilo
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4">
                        ¿Cuál es tu tipo de rostro?
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        Cada rostro es único. Descubre las monturas que mejor se adaptan a tu
                        forma de rostro y potencia tu estilo.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faceTypes.map((ft, i) => {
                        const name = ft.name_faceType || ""
                        const desc = faceTypeDescriptions[name] || "Encuentra la montura ideal para tu tipo de rostro."

                        return (
                            <a
                                key={ft.id_faceType}
                                href={`/catalogo?tipo_rostro=${encodeURIComponent(name)}`}
                                className="group relative bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="mb-3">
                                        <img
                                            src={getImageUrl(`/images/faceTypes/${ft.image_faceType}`)}
                                            alt={name}
                                            className="h-24 object-cover"
                                            onError={(e) => { e.target.style.display = "none" }}
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{name}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                        {desc}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-primary font-semibold text-xs group-hover:gap-2 transition-all">
                                        Ver monturas <RiArrowRightLine />
                                    </span>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
