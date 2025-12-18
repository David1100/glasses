import { RiCaravanFill, RiLock2Fill, RiVerifiedBadgeFill } from "react-icons/ri";
import { useCartStore } from "../hooks/useCart";

export default function OrderSummary() {
    const { totalPrice } = useCartStore();
    const subtotal = totalPrice()
    const impuesto = 24.40
    const total = subtotal + impuesto


    return (
        <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
                <div
                    className="bg-[#16292D] rounded-xl p-6 shadow-lg border border-transparent"
                >
                    <h2
                        className="text-xl font-bold text-white mb-6"
                    >
                        Resumen del Pedido
                    </h2>
                    <div
                        className="flex flex-col gap-4 border-b border-[#234248] pb-6 mb-6"
                    >
                        <div className="flex justify-between items-center">
                            <span
                                className="text-text-secondary"
                            >Subtotal</span>
                            <span
                                className="font-semibold text-white"
                            >{subtotal.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span
                                className="text-text-secondary"
                            >Impuestos</span>
                            <span
                                className="font-semibold text-white"
                            >{impuesto.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-8">
                        <span
                            className="text-lg font-bold text-white"
                        >Total</span>
                        <div className="text-right">
                            <span
                                className="block text-3xl font-black text-white tracking-tight"
                            >{total.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</span>
                            <span className="text-xs text-slate-400">USD</span>
                        </div>
                    </div>
                    <a href="/pago"
                        className="w-full h-12 bg-secondary text-slate-900 font-bold rounded-lg transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(19,200,236,0.3)] hover:shadow-[0_0_30px_rgba(19,200,236,0.5)] flex items-center justify-center gap-2 mb-4"
                    >
                        <RiLock2Fill />
                        Proceder al Pago
                    </a>
                </div>
                <div
                    className="bg-white dark:bg-borde/50 rounded-xl p-4 border border-slate-200 dark:border-white/5 flex flex-col gap-3"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="size-8 rounded-full bg-[#234248] flex items-center justify-center text-secondary"
                        >
                            <RiVerifiedBadgeFill />
                        </div>
                        <div>
                            <p
                                className="text-xs font-bold text-white"
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