import { useEffect, useRef, useState } from "react"
import { FaceMesh } from "@mediapipe/face_mesh"
import { Camera } from "@mediapipe/camera_utils"
import { RiLuggageCartFill } from "react-icons/ri"

let globalFaceMesh = null
let globalCamera = null

export default function FaceGlasses() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const glassesImg = useRef(new Image())

  const [currentGlass, setCurrentGlass] = useState({
    nombre: "Ray-Ban Hexagonal",
    material: "Metal / Oro",
    precio: 145000,
    imagen: "/gafas/gafa1.webp"
  })

  // 🔹 escuchar cambios de gafa
  useEffect(() => {
    const handler = (e) => {
      setCurrentGlass(e.detail)
      glassesImg.current.src = e.detail.imagen
    }

    window.addEventListener("change-glasses", handler)
    return () => window.removeEventListener("change-glasses", handler)
  }, [])

  // 🔹 inicialización única de MediaPipe
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

      if (!results.multiFaceLandmarks?.length) return

      const lm = results.multiFaceLandmarks[0]
      const l = lm[33]
      const r = lm[263]
      const n = lm[168]

      const x1 = l.x * canvas.width
      const y1 = l.y * canvas.height
      const x2 = r.x * canvas.width
      const y2 = r.y * canvas.height

      const width = (x2 - x1) * 1.9
      const height = width * 0.8
      const centerX = (x1 + x2) / 2 + width * 0.02
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
      width: 640,   // ⬅️ IMPORTANTE
      height: 480
    })

    globalCamera.start()

    return () => {
      globalCamera?.stop()
    }
  }, [])

  return (
    <div className="relative w-full h-full">
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

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-primary/90 px-6 py-4 rounded-xl flex items-center gap-4">
          <div>
            <h2 className="text-secondary font-bold text-sm">MODELO ACTUAL</h2>
            <h1 className="text-lg">{currentGlass.nombre}</h1>
            <p className="text-gray-400 text-sm">{currentGlass.material}</p>
          </div>

          <button className="bg-secondary rounded-full px-4 py-3 text-black font-bold flex items-center gap-2">
            <RiLuggageCartFill />
            Añadir ${currentGlass.precio.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )
}
