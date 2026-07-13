import { RiArrowRightLine, RiSparkling2Line } from "react-icons/ri"
import HeroGlasses3D from "./HeroGlasses3D.jsx"

export default function HeroBanner() {
    return (
        <section className="relative min-h-screen bg-linear-to-br from-primary/10 via-white to-secondary/5">
            <div className="absolute inset-0 bg-[url('/background.svg')] bg-cover bg-center opacity-[0.03]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                            <RiSparkling2Line className="text-primary text-sm" />
                            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                                Prueba virtual con IA
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                            Encuentra tus
                            <span className="block text-transparent bg-linear-to-r from-primary to-secondary bg-clip-text">
                                gafas perfectas
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mb-10">
                            Descubre la montura ideal para tu rostro desde la comodidad de tu hogar.
                            Pruébalas virtualmente con nuestra tecnología de realidad aumentada.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/probar"
                                className="group inline-flex items-center justify-center gap-2 bg-linear-to-r from-primary to-secondary text-white font-semibold rounded-full px-8 py-3.5 text-sm sm:text-base hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                            >
                                Probar ahora
                                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#categorias"
                                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full px-8 py-3.5 text-sm sm:text-base hover:border-primary hover:text-primary transition-all duration-300"
                            >
                                Explorar categorías
                            </a>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-center h-full min-h-[500px] relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-96 h-96">
                                <div className="relative w-full h-full">
                                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
                                    <div className="absolute inset-8 bg-linear-to-br from-primary/10 to-secondary/5 rounded-full blur-2xl" />
                                </div>
                            </div>
                        </div>
                        <HeroGlasses3D />
                    </div>
                </div>
            </div>
        </section>
    )
}
