import { RiCaravanFill, RiCheckboxCircleFill, RiSecurePaymentFill, RiShieldCheckFill } from "react-icons/ri";
import OrderSummaryPay from "../OrderSummaryPay";
import DetailsCarPay from "../DetailsCarPay";
import Formulario from "./Formulario";
import { useState } from "react";
import EstepIndicator from "../StepIndicator";

export default function PagosPadre() {

    const [shipping, setShipping] = useState(null)

    const changeShipping = (dato) => {
        setShipping(dato)
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-7 space-y-8">
                    <EstepIndicator step={2}/>
                    <Formulario client:only="react" onShipping={changeShipping} />
                </div>
                <div className="lg:col-span-5">
                    <div className="sticky top-24 space-y-4">
                        <div
                            className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200"
                        >
                            <h3
                                className="text-lg font-bold mb-6 border-b border-gray-200 pb-4"
                            >
                                Resumen del Pedido
                            </h3>
                            <DetailsCarPay client:only="react" />
                            <div
                                className="mb-6 bg-background-dark rounded-lg p-3 border border-gray-200 flex items-center gap-3 shadow"
                            >
                                <div
                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-sebg-secondary"
                                >
                                    <img
                                        alt="User face with virtual glasses overlay"
                                        className="w-full h-full object-cover"
                                        data-alt="Virtual try-on simulation result"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH7ILw2CKSB5ugQdRb9eg8GBBKPmUNegQ02xCWJsApegxioAmDTuSLEVqbrzwjvazVkWEBQaSEWQw_b8cGkCcE1DxlQMxPNbinoJ6aNG70bLFnXmubbBiGEHaH9ogzGco-XLmXwghplD7Iunobar43q8-TSegqdBmTlodB7ZmKG-IXgvKmRqERdSJZRzHG37d6twcJXA8h-79rmuQfc4HYanJtKb9lK3UzvNgV6pQ19a9GNr1CDCsNfSwslkdCOBM7RE0J5gGNDR1U"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-primary">
                                        Prueba Virtual Confirmada
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        Este modelo se ajusta a tus medidas.
                                    </p>
                                </div>
                                <RiCheckboxCircleFill className="text-primary ml-auto text-lg" />
                            </div>
                            <OrderSummaryPay client:only="react" shipping={shipping} />
                        </div>
                        <div
                            className="flex justify-center gap-4 text-slate-400 opacity-60"
                        >
                            <RiSecurePaymentFill />
                            <RiShieldCheckFill />
                            <RiCaravanFill />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}