import {
    RiCheckboxCircleFill,
    RiSeparator,
    RiAddLine,
    RiDeleteBin6Line,
    RiEyeLine,
    RiEditBoxLine,
} from "react-icons/ri"
import { useCartStore } from "../hooks/useCart";

export default function DetailsCar() {


    const { cart, removeFromCart } = useCartStore();

    return (

        <div className="flex-1 flex flex-col gap-6">
            {
                cart.map(item => (
                    <div key={item.reference} className="group rounded-xl p-4 sm:p-6 shadow-md border border-transparent hover:border-primary/30 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="relative shrink-0 overflow-hidden rounded-lg bg-[#234248]/30 w-full sm:w-48 aspect-4/3 flex items-center justify-center">
                                <div
                                    className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                    style={{
                                        backgroundImage:
                                            `url('${item.img}')`,
                                    }}
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold ">
                                            {item.reference}
                                        </h3>

                                        <p className="text-gray-400 text-sm">Marca: {item.marca}</p>
                                        <p className="text-gray-400 text-sm">
                                            Material: {item.material}
                                        </p>

                                        <div className="mt-3 flex items-center gap-2 text-green-500 text-xs font-semibold bg-green-500/10 px-2 py-1 rounded w-fit">
                                            <RiCheckboxCircleFill />
                                            En Stock
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-bold ">{item.price.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        })}</p>
                                        {/* <p className="text-xs text-slate-400 line-through">$185.00</p> */}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        {/* <div className="flex items-center rounded-lg p-1">
                                            <button className="size-8 flex items-center justify-center rounded-md hover:bg-white/10" onClick={() => removeFromCart(item.reference)}>
                                                <RiSeparator />
                                            </button>

                                            <input
                                                className="w-8 text-center bg-transparent text-sm font-medium "
                                                type="number"
                                                value={item.cantidad}
                                                readOnly
                                            />

                                            <button className="size-8 flex items-center justify-center rounded-md hover:bg-white/10">
                                                <RiAddLine />
                                            </button>
                                        </div> */}

                                        <button className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-sm font-medium" onClick={() => removeFromCart(item.reference)}>
                                            <RiDeleteBin6Line />
                                            <span className="hidden sm:inline">Eliminar</span>
                                        </button>
                                    </div>

                                    <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/60 font-semibold text-sm">
                                        <RiEyeLine />
                                        Probar de nuevo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }

        </div>


    )
}
