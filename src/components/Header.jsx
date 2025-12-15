import { useCartStore } from "../hooks/useCart";

export default function Header() {

    const { cart } = useCartStore();

  return (
    <header className="flex justify-between items-center px-8 py-1 bg-primary border-b border-gray-800 fixed top-0 w-full z-30">
      <a href="/" className="flex gap-2 items-center">
        <img
          src="/logotipo.png"
          className="w-18 hover:scale-105 transition-all"
          alt="Logo"
        />
      </a>

      <nav>
        <ul className="flex items-center gap-3 text-sm">
          <li>
            <a href="/carrito" className="bg-secondary px-4 py-2 rounded-full text-black font-semibold">
              Carrito ({cart.length})
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
