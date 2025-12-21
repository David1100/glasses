import { useEffect, useRef, useState } from "react";
import { RiBallPenLine } from "react-icons/ri";

export default function FirmaElectronica({ onSave }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const drawing = useRef(false);

    const [signed, setSigned] = useState(false);

    // 🧠 Inicializar canvas correctamente
    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;

        if (!canvas || !wrapper) return;

        const ratio = window.devicePixelRatio || 1;

        canvas.width = wrapper.offsetWidth * ratio;
        canvas.height = wrapper.offsetHeight * ratio;
        canvas.style.width = `${wrapper.offsetWidth}px`;
        canvas.style.height = `${wrapper.offsetHeight}px`;

        const ctx = canvas.getContext("2d");
        ctx.scale(ratio, ratio);
        ctx.strokeStyle = "#13c8ec";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
    }, []);

    // 🔥 BLOQUEAR SCROLL SOLO MIENTRAS FIRMA (MÓVIL)
    useEffect(() => {
        const preventScroll = (e) => {
            if (drawing.current) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventScroll, {
            passive: false,
        });

        return () => {
            document.removeEventListener("touchmove", preventScroll);
        };
    }, []);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches?.[0];

        return {
            x: (touch ? touch.clientX : e.clientX) - rect.left,
            y: (touch ? touch.clientY : e.clientY) - rect.top,
        };
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
        if (onSave) onSave(image);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSigned(false);
    };

    return (
        <div className="flex flex-col gap-2 mt-2">
            {/* Header */}
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <RiBallPenLine className="text-[16px]" />
                    Firma digital
                </label>

                <button
                    type="button"
                    onClick={clear}
                    className="text-xs text-primary hover:text-gray-400 underline"
                >
                    Limpiar
                </button>
            </div>

            {/* Canvas */}
            <div
                ref={wrapperRef}
                className="
                    relative w-full h-32 rounded-xl
                    bg-gray-200
                    border-2 border-dashed border-gray-400
                    hover:border-primary/50
                    transition-colors
                    cursor-crosshair
                    overflow-hidden
                    touch-none
                "
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
                    <div className="absolute inset-0 flex items-center justify-center text-gray-800/30 pointer-events-none">
                        <span className="text-sm font-medium">
                            Dibuja tu firma aquí
                        </span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <p className="text-[10px] text-gray-400">
                Al firmar, usted acepta los Términos de Servicio.
            </p>

            {signed && (
                <p className="text-[10px] text-green-500">
                    Firma capturada correctamente ✔
                </p>
            )}
        </div>
    );
}
