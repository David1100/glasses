import { RiArrowRightLine, RiSparkling2Line } from "react-icons/ri"

export default function CTASection() {
    return (
        <section className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-secondary p-8 sm:p-12 lg:p-16 text-center">
                    <div className="absolute inset-0 bg-[url('/background.svg')] bg-cover bg-center opacity-10" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
                            <RiSparkling2Line className="text-white text-sm" />
                            <span className="text-xs font-semibold text-white tracking-wide uppercase">
                                Tecnología AR
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-[1.15]">
                            ¿Listo para encontrar tu estilo?
                        </h2>
                        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                            No más dudas. Pruébate cientos de monturas desde tu celular
                            con nuestra prueba virtual inteligente.
                        </p>

                        <a
                            href="/probar"
                            className="inline-flex items-center gap-2 bg-white text-primary font-bold rounded-full px-8 py-3.5 text-sm sm:text-base hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Comenzar ahora
                            <RiArrowRightLine />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
