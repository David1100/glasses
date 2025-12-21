import { useCartStore } from "../hooks/useCart";

export default function DetailsCarPay() {

    const { cart } = useCartStore();
  
    return (
        <>
            {
                cart.map(item => (
                    <div className="flex gap-4 mb-6" key={item.id}>
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
                        <div className="grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold ">
                                        {item.reference}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Montura: {item.marca}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Material: {item.material}
                                    </p>
                                </div>
                                <span className="font-bold "
                                >{item.price.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                })}</span>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}