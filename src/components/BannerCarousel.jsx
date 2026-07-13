import { useState, useEffect, useCallback } from "react"
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"

const slides = [
    {
        id: 1,
        title: "Nueva Colección 2026",
        subtitle: "Descubre las últimas tendencias en monturas",
        cta: "Explorar",
        gradient: "from-primary/20 to-secondary/10",
        accent: "from-primary to-secondary",
    },
    {
        id: 2,
        title: "Prueba Antes de Comprar",
        subtitle: "Tecnología AR para ver cómo te quedan desde casa",
        cta: "Probar ahora",
        gradient: "from-amber-500/20 to-orange-500/10",
        accent: "from-amber-500 to-orange-500",
    },
    {
        id: 3,
        title: "Envío Gratis",
        subtitle: "En todos tus pedidos. Devuelve sin costo si no te convencen.",
        cta: "Ver condiciones",
        gradient: "from-emerald-500/20 to-teal-500/10",
        accent: "from-emerald-500 to-teal-500",
    },
]

export default function BannerCarousel() {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
    }, [])

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    }, [])

    useEffect(() => {
        if (isPaused) return
        const timer = setInterval(next, 5000)
        return () => clearInterval(timer)
    }, [isPaused, next])

    const slide = slides[current]

    return (
        <section className="py-20 sm:py-28 bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`relative overflow-hidden rounded-3xl bg-linear-to-br ${slide.gradient} p-8 sm:p-12 lg:p-16`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                            {`0${current + 1}`}
                        </span>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-3 mb-4">
                            {slide.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed mb-8">
                            {slide.subtitle}
                        </p>
                        <a
                            href="/probar"
                            className={`inline-flex items-center gap-2 bg-linear-to-r ${slide.accent} text-white font-semibold rounded-full px-6 py-3 text-sm hover:shadow-xl transition-all duration-300`}
                        >
                            {slide.cta}
                        </a>
                    </div>

                    <div className="flex items-center justify-between mt-10 sm:mt-0 sm:absolute sm:bottom-8 sm:right-8 gap-3">
                        <button
                            onClick={prev}
                            className="size-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white transition-all"
                        >
                            <RiArrowLeftSLine className="text-gray-600" />
                        </button>
                        <div className="flex gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-gray-800" : "w-1.5 bg-gray-300"}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="size-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white transition-all"
                        >
                            <RiArrowRightSLine className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
