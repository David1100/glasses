import { useEffect, useRef, useState } from "react"
import { FaceMesh } from "@mediapipe/face_mesh"
import { Camera } from "@mediapipe/camera_utils"
import { RiLuggageCartFill, RiUserSmileLine } from "react-icons/ri"
import { useCartStore } from "../hooks/useCart"

let faceMeshInstance = null
let cameraInstance = null

export default function FaceGlasses() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const glassesImg = useRef(new Image())
  const faceLocked = useRef(false)

  const { cart, addToCart } = useCartStore()

  const [faceDetected, setFaceDetected] = useState(false)
  const [faceType, setFaceType] = useState(null)
  const [loadingFace, setLoadingFace] = useState(true)

  const [currentGlass, setCurrentGlass] = useState({
    referencia: "RayBan",
    marca: "RayBan",
    material: "Metal",
    precio: 75000,
    img: "/gafas/rayban.png"
  })

  /* 🔹 Escuchar cambio de gafas */
  useEffect(() => {
    glassesImg.current.src = currentGlass.img
  }, [currentGlass])

  /* 🔹 MediaPipe */
  useEffect(() => {
    if (faceMeshInstance) return

    faceMeshInstance = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    })

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    })

    faceMeshInstance.onResults(onResults)

    cameraInstance = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMeshInstance.send({ image: videoRef.current })
      },
      width: 640,
      height: 480
    })

    cameraInstance.start()

    return () => cameraInstance?.stop()
  }, [])

  /* 🔹 Procesar rostro */
  function onResults(results) {
    const canvas = canvasRef.current
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

    /* 🔹 Tipo de rostro (una sola vez) */
    if (!faceLocked.current) {
      setFaceType(detectFaceType(lm))
      faceLocked.current = true
    }

    /* 🔹 Puntos clave */
    const l = lm[33]
    const r = lm[263]
    const n = lm[168]

    const x1 = l.x * canvas.width
    const y1 = l.y * canvas.height
    const x2 = r.x * canvas.width
    const y2 = r.y * canvas.height

    const width = (x2 - x1) * 2.0
    const height = width * 0.75

    const centerX = (x1 + x2) / 2
    const centerY = n.y * canvas.height - height * 0.15

    const angle = -Math.atan2(y2 - y1, x2 - x1)

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
  }

  /* 🔹 Tipo de rostro */
  function detectFaceType(lm) {
    const left = lm[234]
    const right = lm[454]
    const top = lm[10]
    const bottom = lm[152]

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
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
          <p className="text-xs font-bold uppercase tracking-wider">
            Analizando rostro...
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]"
      />

      {faceDetected && faceType && (
        <div className="absolute top-6 right-6 bg-white/80 rounded-xl px-4 py-3 shadow">
          <p className="text-xs uppercase">Tipo de rostro</p>
          <p className="font-bold text-primary">{faceType}</p>
        </div>
      )}

      {faceDetected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 px-6 py-4 rounded-xl shadow flex items-center gap-4">
          <div>
            <p className="text-xs font-bold">{currentGlass.referencia}</p>
            <p className="text-xs text-gray-500">{currentGlass.material}</p>
          </div>

          <button
            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
            onClick={() =>
              addToCart({
                reference: currentGlass.referencia,
                price: currentGlass.precio,
                cantidad: 1,
                img: currentGlass.img,
                material: currentGlass.material
              })
            }
          >
            <RiLuggageCartFill />
            Comprar
          </button>
        </div>
      )}
    </div>
  )
}
