import { useState } from "react"
import { RiLuggageCartFill, RiMenuLine, RiCloseLine } from "react-icons/ri"
import { useCartStore } from "../hooks/useCart"

const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Probar Virtual", href: "/probar" },
    { label: "Carrito", href: "/carrito" },
]

export default function Header() {
    const { cart } = useCartStore()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
                <a href="/" className="flex gap-2 items-center shrink-0">
                    <img
                        src="/favicon_fullmedic.webp"
                        className="w-10 hover:scale-105 transition-all"
                        alt="Full Medic"
                    />
                </a>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-all"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <a
                        href="/carrito"
                        className="relative flex items-center justify-center bg-linear-to-r from-primary to-secondary size-9 rounded-full text-white hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                    >
                        <RiLuggageCartFill size={16} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center bg-white text-primary text-[8px] font-bold rounded-full shadow-md">
                                {cart.length}
                            </span>
                        )}
                    </a>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden size-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-xl animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary rounded-xl hover:bg-primary/5 transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}
