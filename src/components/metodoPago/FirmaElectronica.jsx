import { useEffect, useRef, useState } from "react";
import { RiBallPenLine } from "react-icons/ri";

export default function FirmaElectronica({ onSave }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const drawing = useRef(false);

    const [signed, setSigned] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;

        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#13c8ec";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
    }, []);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: x - rect.left, y: y - rect.top };
    };

    const start = (e) => {
        e.preventDefault();
        drawing.current = true;
        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const move = (e) => {
        if (!drawing.current) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const end = () => {
        if (!drawing.current) return;
        drawing.current = false;
        setSigned(true);

        const image = canvasRef.current.toDataURL("image/png");
        onSave?.(image);
    };

    const clear = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setSigned(false);
        onSave?.(null);
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <RiBallPenLine />
                    Firma digital
                </label>
                <button
                    type="button"
                    onClick={clear}
                    className="text-xs text-secondary hover:text-white underline"
                >
                    Limpiar
                </button>
            </div>

            <div
                ref={wrapperRef}
                className="relative w-full h-32 rounded-xl bg-[#132023] border-2 border-dashed border-slate-800 cursor-crosshair overflow-hidden"
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    onMouseDown={start}
                    onMouseMove={move}
                    onMouseUp={end}
                    onMouseLeave={end}
                    onTouchStart={start}
                    onTouchMove={move}
                    onTouchEnd={end}
                />

                {!signed && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400/30 pointer-events-none">
                        <span className="text-sm">
                            Dibuja tu firma aquí
                        </span>
                    </div>
                )}
            </div>

            {signed && (
                <p className="text-[10px] text-green-500">
                    Firma capturada correctamente ✔
                </p>
            )}
        </div>
    );
}
