import { RiArrowRightLine } from "react-icons/ri";
import { useCartStore } from "../../hooks/useCart";
import { useEnvioStore } from "../../hooks/useEnvioStore";

export default function DetailsCar() {

    const { cart, totalPrice } = useCartStore();
     const { detalleEnvio } = useEnvioStore();
    const subtotal = totalPrice()
    const impuesto = 24.40
    const total = subtotal + impuesto

    return (
        <div className="lg:w-100 flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-6">
                <div
                    className="bg-white rounded-xl p-5 border border-gray-200 flex flex-col gap-4 shadow"
                >
                    <h3
                        className="text-lg font-bold border-b border-gray-200 pb-3"
                    >
                        Resumen del Pedido
                    </h3>
                    {
                        cart.map(item => (
                            <div className="flex gap-4">
                                <div
                                    className="relative w-24 h-24 rounded-lg bg-gray-200 p-2 flex items-center justify-center border border-gray-300 shrink-0"
                                >
                                    <img
                                        alt="Stylish tortoiseshell glasses frames on neutral background"
                                        className="w-full h-full object-contain"
                                        data-alt="Close up of glasses frames"
                                        src={item.img}
                                    />
                                    <div
                                        className="absolute -bottom-2 -right-2 bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full font-bold"
                                    >
                                        x{item.cantidad}
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col justify-center flex-1 min-w-0"
                                >
                                    <div className="flex justify-between items-start">
                                        <p
                                            className="font-bold text-sm truncate pr-2"
                                        >
                                            {item.reference}
                                        </p>
                                        <p className="font-bold text-sm">
                                            {item.price.toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            })}
                                        </p>
                                    </div>
                                    <p className="text-gray-400 text-xs">
                                        Montura: {item.marca}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Material: {item.material}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                    <div
                        className="flex flex-col gap-2 pt-2 border-t border-gray-200"
                    >
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="">{subtotal.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Envio</span>
                            <span className="text-green-400 font-medium"
                            >{detalleEnvio.shipping}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400"
                            >Impuestos</span>
                            <span className="text-white">{impuesto.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                        </div>
                    </div>
                    <div
                        className="flex justify-between items-center pt-3 border-t border-gray-200"
                    >
                        <span className="text-base font-bold "
                        >Total</span>
                        <div className="flex flex-col items-end">
                            <span className="text-xl font-black text-primary"
                            >{total.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                            <span className="text-[10px] text-gray-400"
                            >USD</span>
                        </div>
                    </div>
                </div>
                <button
                    className="w-full bg-linear-to-r from-primary to-secondary h-14 bg-secondary  text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <span>Comprar</span>
                </button>
                <p className="text-center text-[10px] text-gray-400 px-4">
                    Al hacer clic en "Comprar", usted acepta nuestros <a
                        className="underline hover:text-primary"
                        href="#">Terminos</a> y <a className="underline hover:text-primary" href="#"
                        >política de privacidad</a>.
                </p>
            </div>
        </div>

    )
}