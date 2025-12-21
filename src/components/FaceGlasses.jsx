import { useEffect, useRef, useState } from "react"
import { FaceMesh } from "@mediapipe/face_mesh"
import { Camera } from "@mediapipe/camera_utils"
import { RiLuggageCartFill, RiUserSmileLine } from "react-icons/ri"
import { useCartStore } from "../hooks/useCart"

let globalFaceMesh = null
let globalCamera = null

export default function FaceGlasses() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const glassesImg = useRef(new Image())

  const { cart, addToCart } = useCartStore()

  const [currentGlass, setCurrentGlass] = useState({
    marca: "Cartier",
    material: "Metal",
    precio: 75000,
    img: "/gafas/rayban.jpg"
  })

  const [faceDetected, setFaceDetected] = useState(false)
  const [faceType, setFaceType] = useState(null)
  const [loadingFace, setLoadingFace] = useState(true)

  // 🔧 FIX ROSTRO: evitar recalcular todo el tiempo
  const faceLocked = useRef(false)

  /* 🔹 Cambio de gafas */
  useEffect(() => {
    const handler = (e) => {
      setCurrentGlass(e.detail)
      glassesImg.current.src = e.detail.img
    }
    window.addEventListener("change-glasses", handler)
    return () => window.removeEventListener("change-glasses", handler)
  }, [])

  /* 🔹 MediaPipe */
  useEffect(() => {
    if (globalFaceMesh) return

    globalFaceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    })

    globalFaceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    })

    globalFaceMesh.onResults((results) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!results.multiFaceLandmarks?.length) {
        setFaceDetected(false)
        setLoadingFace(true)
        faceLocked.current = false
        return
      }

      setFaceDetected(true)
      setLoadingFace(false)

      const lm = results.multiFaceLandmarks[0]

      /* 🔴 DEBUG ROSTRO – PUNTOS */
      ctx.fillStyle = "#00FFEA"

      // Laterales rostro
      drawPoint(ctx, lm[234], canvas)
      drawPoint(ctx, lm[454], canvas)

      // Frente y mentón
      drawPoint(ctx, lm[10], canvas)
      drawPoint(ctx, lm[152], canvas)

      // Mandíbula
      drawPoint(ctx, lm[58], canvas)
      drawPoint(ctx, lm[288], canvas)
      function drawPoint(ctx, point, canvas) {
        ctx.beginPath()
        ctx.arc(
          point.x * canvas.width,
          point.y * canvas.height,
          4,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }

      // 🔧 FIX ROSTRO: calcular SOLO una vez
      if (!faceLocked.current) {
        const type = detectFaceType(lm)
        setFaceType(type)
        faceLocked.current = true
      }

      /* 🔹 Gafas */
      const l = lm[33]
      const r = lm[263]
      const n = lm[168]

      const x1 = l.x * canvas.width
      const y1 = l.y * canvas.height
      const x2 = r.x * canvas.width
      const y2 = r.y * canvas.height

      const width = (x2 - x1) * 1.9
      const height = width * 0.8
      const centerX = (x1 + x2) / 2
      const centerY = n.y * canvas.height + height * 0.12
      const angle = Math.atan2(y2 - y1, x2 - x1)

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle)
      ctx.drawImage(
        glassesImg.current,
        -width / 2,
        -height / 2,
        width,
        height
      )
      ctx.restore()
    })

    globalCamera = new Camera(videoRef.current, {
      onFrame: async () => {
        await globalFaceMesh.send({ image: videoRef.current })
      },
      width: 640,
      height: 480
    })

    globalCamera.start()

    return () => globalCamera?.stop()
  }, [])

  /* 🔹 FIX ROSTRO (ÚNICO CAMBIO REAL) */
  function detectFaceType(lm) {
    const left = lm[234]
    const right = lm[454]
    const top = lm[10]
    const bottom = lm[152]

    // ⚠️ SOLO valores normalizados (NO canvas)
    const faceWidth = Math.abs(right.x - left.x)
    const faceHeight = Math.abs(bottom.y - top.y)

    const ratio = faceHeight / faceWidth

    if (ratio > 1.6) return "Alargado"
    if (ratio > 1.35) return "Ovalado"
    if (ratio > 1.15) return "Cuadrado"
    return "Redondo"
  }



  return (
    <div className="relative w-full h-full overflow-hidden">

      {loadingFace && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white/80 border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center gap-3 animate-fade-in">
            <div className="relative size-10">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full size-10 bg-primary"></span>
            </div>
            <p className="text-xs uppercase tracking-wider">
              Analizando rostro...
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-24 left-6 flex gap-3 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/10 animate-pulse shadow">
          <div className="size-2 rounded-full bg-red-500"></div>
          <span className="text-xs font-bold uppercase tracking-wider">
            En Vivo
          </span>
        </div>

        {faceDetected && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/10 shadow">
            <RiUserSmileLine className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Rostro Detectado
            </span>
          </div>
        )}
      </div>

      {faceDetected && faceType && (
        <div className="absolute lg:top-24 top-36 lg:right-6 left-6 lg:left-auto z-10">
          <div className="bg-white/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 w-56 animate-fade-in shadow">
            <p className="text-[12px] text-black uppercase tracking-wide">
              Tipo de rostro
            </p>
            <p className="text-sm font-bold text-primary mb-2">
              {faceType}
            </p>
            <a
              href={`/?tipo_rostro=${faceType}`}
              className="block text-center text-xs font-bold bg-linear-to-r from-primary to-secondary  text-white rounded-full py-1.5 hover:scale-105 transition"
            >
              Ver gafas ideales
            </a>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {currentGlass?.referencia && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-xs lg:w-auto">
          <div className="bg-white/80 shadow px-6 py-4 rounded-xl flex items-center justify-between gap-4 backdrop-blur-md">
            <div>
              <h2 className="text-primary font-bold text-xs">
                MODELO ACTUAL
              </h2>
              <h1 className="text-sm">{currentGlass.referencia}</h1>
              <p className="text-gray-600 text-xs">
                {currentGlass.material}
              </p>
            </div>

            {cart.some(
              (item) => item.reference === currentGlass.referencia
            ) ? (
              <a
                href="/carrito"
                className="bg-linear-to-r from-primary to-secondary rounded-full px-4 py-2 text-sm text-white font-bold flex items-center gap-2"
              >
                <RiLuggageCartFill />
                Ver carrito
              </a>
            ) : (
              <button
                className="bg-linear-to-r from-primary to-secondary rounded-full px-4 py-2 text-sm text-white font-bold flex items-center gap-2"
                onClick={() =>
                  addToCart({
                    reference: currentGlass.referencia,
                    id: currentGlass.id,
                    price: currentGlass.precio,
                    marca: currentGlass.marca,
                    montura: currentGlass.montura,
                    cantidad: 1,
                    img: currentGlass.img,
                    material: currentGlass.material
                  })
                }
              >
                <RiLuggageCartFill />
                {currentGlass.precio.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD"
                })}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
