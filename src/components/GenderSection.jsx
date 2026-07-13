export default function GenderSection() {
    const options = [
        {
            key: "male",
            label: "Hombre",
            icon: "male",
            gradient: "from-blue-500 to-blue-600",
        },
        {
            key: "female",
            label: "Mujer",
            icon: "female",
            gradient: "from-pink-500 to-pink-600",
        },
        {
            key: "unisex",
            label: "Unisex",
            icon: null,
            gradient: "from-gray-500 to-gray-600",
        },
    ]

    return (
        <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                        Colecci&oacute;n
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black mt-2">
                        Elige por g&eacute;nero
                    </h2>
                    <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
                        Encuentra las monturas perfectas para cada estilo
                    </p>
                </div>

                <div className="flex items-center justify-center gap-6 flex-wrap">
                    {options.map((opt) => (
                        <a
                            key={opt.key}
                            href={`/catalogo?genero=${opt.key}`}
                            className="group relative flex flex-col items-center gap-3 px-12 py-10 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
                        >
                            <div
                                className={`absolute inset-0 bg-linear-to-r ${opt.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />
                            <div className="relative z-10">
                                {opt.icon ? (
                                    <svg
                                        viewBox="0 0 40 40"
                                        className="w-14 h-14 text-gray-700 group-hover:text-white transition-colors duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        {opt.icon === "male" ? (
                                            <>
                                                <circle cx="20" cy="10" r="7" />
                                                <line x1="20" y1="17" x2="20" y2="36" />
                                                <line x1="10" y1="25" x2="30" y2="25" />
                                                <line x1="6" y1="40" x2="14" y2="32" />
                                                <line x1="26" y1="32" x2="34" y2="40" />
                                            </>
                                        ) : (
                                            <>
                                                <circle cx="20" cy="8" r="7" />
                                                <line x1="20" y1="15" x2="20" y2="32" />
                                                <line x1="10" y1="23" x2="30" y2="23" />
                                                <line x1="20" y1="40" x2="20" y2="32" />
                                            </>
                                        )}
                                    </svg>
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                                        <span className="text-2xl font-black tracking-tight text-gray-500 group-hover:text-white transition-colors duration-300">
                                            Ux
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="relative z-10 text-base font-bold text-gray-800 group-hover:text-white transition-colors duration-300">
                                {opt.label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
