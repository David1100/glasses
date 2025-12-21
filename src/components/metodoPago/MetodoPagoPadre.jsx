import DetailsCar from "./DetailsCar";
import EstepIndicator from "../StepIndicator";
import Formulario from "./Formulario";

export default function MetodoPagoPadre() {
    
    return (
        <>
            <div className="flex-1 flex flex-col gap-6">

                <div className="flex flex-col gap-4">
                    <EstepIndicator step="3" />

                    <div className="group">

                        <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="credit"
                                    checked
                                    className="peer sr-only"
                                />

                                <div
                                    className="size-5 rounded-full border-2 border-gray-200 flex items-center justify-center bg-primary"
                                >
                                    <span className="rounded-full bg-white p-1.25"></span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-base font-bold">
                                        Crédito
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        Solicitud de crédito
                                    </span>
                                </div>
                            </div>
                        </label>

                        <div
                            className="bg-white rounded-xl shadow border border-gray-200 p-5 mt-3"
                        >
                            <Formulario client:only="react" />
                        </div>
                    </div>

                    <label className="cursor-pointer group">
                        <input
                            className="peer sr-only"
                            name="payment_method"
                            type="radio"
                        />
                        <div
                            className="rounded-xl border border-gray-200 p-5  transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="size-5 rounded-full border-2 border-gray-200"
                                    ></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">
                                            PayPal
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            You will be redirected to PayPal
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            <DetailsCar client:only="react" />
        </>
    )
}