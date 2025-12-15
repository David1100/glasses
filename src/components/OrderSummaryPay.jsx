import { useCartStore } from "../hooks/useCart";

export default function OrderSummaryPay() {
    const { totalPrice } = useCartStore();
    const subtotal = totalPrice()
    const impuesto = 24.40
    const total = subtotal + impuesto
    return (
        <>

            <div
                className="space-y-3 pt-4 border-t border-slate-700 text-sm text-slate-400"
            >
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-white"
                    >{subtotal.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })}</span>
                </div>
                <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-green-500 font-medium"
                    >Gratis</span>
                </div>
                <div className="flex justify-between">
                    <span>Impuestos</span>
                    <span className="font-medium text-white"
                    >{impuesto.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })}</span>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-white"
                    >Total</span>
                    <span className="text-2xl font-bold text-secondary"
                    >{total.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-right">
                    Incluye IVA y tasas aplicables
                </p>
            </div>
        </>
    )
}