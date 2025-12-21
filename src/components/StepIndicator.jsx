import { RiArrowRightSLine } from "react-icons/ri";

export default function EstepIndicator({ step }) {



    return (
        <>
            <div className="flex items-center gap-4 text-sm font-medium mb-2 py-4">
                <a href="carrito" className={`${step == 1 ? 'text-primary' : null}`}>Carrito</a>
                <RiArrowRightSLine  className="material-symbols-outlined text-gray-600 text-sm"/>
                <a href="pago" className={`${step == 2 ? 'text-primary' : null}`}>Envio</a>
                <RiArrowRightSLine  className="material-symbols-outlined text-gray-600 text-sm"/>
                <span className={`${step == 3 ? 'text-primary' : null}`}>Pago</span>
            </div>
        </>
    )
}