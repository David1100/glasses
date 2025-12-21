import { RiCaravanFill, RiLock2Fill, RiVerifiedBadgeFill } from "react-icons/ri";
import { useCartStore } from "../hooks/useCart";

export default function OrderSummary() {
    const { totalPrice } = useCartStore();
    const subtotal = totalPrice()
    const impuesto = 24.40
    const total = subtotal + impuesto


    return (
        <div className="w-full lg:w-100 shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
                <div
                    className="rounded-xl p-6 shadow-lg border border-transparent"
                >
                    <h2
                        className="text-xl font-bold mb-6"
                    >
                        Resumen del Pedido
                    </h2>
                    <div
                        className="flex flex-col gap-4 border-b border-gray-100 pb-6 mb-6"
                    >
                        <div className="flex justify-between items-center">
                            <span
                                className="text-gray-400"
                            >Subtotal</span>
                            <span
                                className="font-semibold"
                            >{subtotal.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span
                                className="text-gray-400"
                            >Impuestos</span>
                            <span
                                className="font-semibold"
                            >{impuesto.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-8">
                        <span
                            className="text-lg font-bold"
                        >Total</span>
                        <div className="text-right">
                            <span
                                className="block text-3xl font-black tracking-tight"
                            >{total.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                            <span className="text-xs text-slate-400">USD</span>
                        </div>
                    </div>
                    <a href="/pago"
                        className="w-full h-12 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-lg transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(19,200,236,0.3)] hover:shadow-[0_0_30px_rgba(19,200,236,0.5)] flex items-center justify-center gap-2 mb-4"
                    >
                        <RiLock2Fill />
                        Proceder al Pago
                    </a>
                </div>
                <div
                    className="bg-white/70 rounded-xl p-4 flex flex-col gap-3 shadow"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="size-8 rounded-full bg-primary flex items-center justify-center primary"
                        >
                            <RiVerifiedBadgeFill className="text-white"/>
                        </div>
                        <div>
                            <p
                                className="text-xs font-bold"
                            >
                                Compra Segura
                            </p>
                            <p
                                className="text-[10px] text-gray-400 "
                            >
                                Encriptación SSL de 256 bits
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}