import { useEffect, useRef, useState } from "react"
import { RiLuggageCartFill, RiUserSmileLine } from "react-icons/ri"
import { useCartStore } from "../hooks/useCart"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { MindARThree } from "mind-ar/dist/mindar-face-three.prod.js"

const HEAD_OCCLUDER_URL = "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/sparkar/headOccluder.glb"

const LANDMARK = {
    TOP_HEAD: 10,
    NOSE_BRIDGE: 168,
    LEFT_TEMPLE: 234,
    RIGHT_TEMPLE: 454,
    BOTTOM_CHIN: 152,
}

export default function FaceGlasses() {
    const containerRef = useRef(null)
    const glassesAnchorRef = useRef(null)
    const faceMeshRef = useRef(null)
    const gltfLoaderRef = useRef(new GLTFLoader())

    const { cart, addToCart } = useCartStore()

    const [currentGlass, setCurrentGlass] = useState({
        marca: "Cartier",
        material: "Metal",
        precio: 75000,
        img: "/gafas/rayban.jpg",
        model3d: null,
        name: "Gafas de prueba",
    })
    const [faceDetected, setFaceDetected] = useState(false)
    const [faceType, setFaceType] = useState(null)
    const [loadingFace, setLoadingFace] = useState(true)
    const [loading3D, setLoading3D] = useState(false)

    const detectFaceType = (positions) => {
        if (!positions) return null
        const v = (idx) => new THREE.Vector3(
            positions[idx * 3], positions[idx * 3 + 1], positions[idx * 3 + 2]
        )
        const faceWidth = v(LANDMARK.LEFT_TEMPLE).distanceTo(v(LANDMARK.RIGHT_TEMPLE))
        const faceHeight = v(LANDMARK.TOP_HEAD).distanceTo(v(LANDMARK.BOTTOM_CHIN))
        const ratio = faceHeight / faceWidth
        if (ratio > 1.6) return "Alargado"
        if (ratio > 1.35) return "Ovalado"
        if (ratio > 1.15) return "Cuadrado"
        return "Redondo"
    }

    const load3DModel = (url) => {
        const anchor = glassesAnchorRef.current
        if (!anchor) return

        setLoading3D(true)

        while (anchor.children.length > 0) {
            anchor.remove(anchor.children[0])
        }

        const baseUrl = url.startsWith("http") ? url : `https://fullmedicapp.com/api${url}`

        gltfLoaderRef.current.load(
            baseUrl,
            (gltf) => {
                const model = gltf.scene
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.renderOrder = 1
                        child.material.depthTest = true
                        child.material.depthWrite = true
                    }
                })
                model.scale.set(3.3, 3.3, 3.3)
                model.position.set(-0.01, -0.05, -0.4)
                anchor.add(model)
                setLoading3D(false)
            },
            undefined,
            (error) => {
                console.error("[FaceGlasses] Error loading model:", error)
                setLoading3D(false)
            }
        )
    }

    useEffect(() => {
        if (!containerRef.current) return

        const mindarThree = new MindARThree({
            container: containerRef.current,
        })
        const { renderer, scene, camera } = mindarThree

        scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1))

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
        dirLight.position.set(0, 5, 5)
        scene.add(dirLight)

        const anchor = mindarThree.addAnchor(LANDMARK.NOSE_BRIDGE)
        glassesAnchorRef.current = anchor.group

        const occluderAnchor = mindarThree.addAnchor(LANDMARK.NOSE_BRIDGE)
        gltfLoaderRef.current.load(
            HEAD_OCCLUDER_URL,
            (gltf) => {
                const occluder = gltf.scene
                occluder.traverse((child) => {
                    if (child.isMesh) {
                        child.renderOrder = 0
                        child.material.colorWrite = false
                        child.material.depthWrite = true
                        child.material.transparent = false
                    }
                })
                occluder.position.set(0, -0.3, 0.15)
                occluder.scale.setScalar(0.065)
                occluderAnchor.group.add(occluder)
            },
            undefined,
            (error) => {
                console.warn("[FaceGlasses] Occluder load failed:", error)
            }
        )

        const faceMesh = mindarThree.addFaceMesh()
        faceMesh.material.transparent = true
        faceMesh.material.opacity = 0
        scene.add(faceMesh)
        faceMeshRef.current = faceMesh

        mindarThree.start()

        let faceTypeDetected = false
        let prevDetected = false

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)

            const isDetected = anchor.group.visible
            if (isDetected !== prevDetected) {
                prevDetected = isDetected
                setFaceDetected(isDetected)
                setLoadingFace(!isDetected)
                if (!isDetected) faceTypeDetected = false
            }

            if (isDetected && !faceTypeDetected) {
                const attr = faceMesh.geometry.attributes?.position
                if (attr?.array) {
                    const type = detectFaceType(attr.array)
                    if (type) {
                        setFaceType(type)
                        faceTypeDetected = true
                    }
                }
            }
        })

        return () => {
            renderer.setAnimationLoop(null)
            mindarThree.stop()
        }
    }, [])

    useEffect(() => {
        const handler = (e) => {
            setCurrentGlass(e.detail)
            if (e.detail.model3d) load3DModel(e.detail.model3d)
        }
        window.addEventListener("change-glasses", handler)
        return () => window.removeEventListener("change-glasses", handler)
    }, [])

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div ref={containerRef} className="absolute inset-0 w-full h-full" />

            {loadingFace && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="bg-white/80 border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center gap-3 animate-fade-in">
                        <div className="relative size-10">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full size-10 bg-primary"></span>
                        </div>
                        <p className="text-xs uppercase tracking-wider">Analizando rostro...</p>
                    </div>
                </div>
            )}

            <div className="absolute top-24 left-6 flex gap-3 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/10 animate-pulse shadow">
                    <div className="size-2 rounded-full bg-red-500"></div>
                    <span className="text-xs font-bold uppercase tracking-wider">En Vivo</span>
                </div>
                {faceDetected && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/10 shadow">
                        <RiUserSmileLine className="text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider">Rostro Detectado</span>
                    </div>
                )}
                {loading3D && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 backdrop-blur-md border border-purple-200 shadow">
                        <span className="size-2 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Cargando 3D...</span>
                    </div>
                )}
            </div>

            {faceDetected && faceType && (
                <div className="absolute lg:top-24 top-36 lg:right-6 left-6 lg:left-auto z-10">
                    <div className="bg-white/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 w-56 animate-fade-in shadow">
                        <p className="text-[12px] text-black uppercase tracking-wide">Tipo de rostro</p>
                        <p className="text-sm font-bold text-primary mb-2">{faceType}</p>
                        <a href={`/?tipo_rostro=${faceType}`}
                            className="block text-center text-xs font-bold bg-linear-to-r from-primary to-secondary text-white rounded-full py-1.5 hover:scale-105 transition">
                            Ver gafas ideales
                        </a>
                    </div>
                </div>
            )}

            {currentGlass?.referencia && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-xs lg:w-auto">
                    <div className="bg-white/80 shadow px-6 py-4 rounded-xl flex items-center justify-between gap-4 backdrop-blur-md">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-primary font-bold text-xs">MODELO ACTUAL</h2>
                                {currentGlass.model3d && (
                                    <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold">3D</span>
                                )}
                            </div>
                            <h1 className="text-sm font-bold">{currentGlass.name || currentGlass.referencia}</h1>
                            <p className="text-gray-600 text-xs">{currentGlass.marca} · {currentGlass.material}</p>
                        </div>
                        {cart.some((item) => item.reference === currentGlass.referencia) ? (
                            <a href="/carrito"
                                className="bg-linear-to-r from-primary to-secondary rounded-full px-4 py-2 text-sm text-white font-bold flex items-center gap-2">
                                <RiLuggageCartFill /> Ver carrito
                            </a>
                        ) : (
                            <button
                                className="bg-linear-to-r from-primary to-secondary rounded-full px-4 py-2 text-sm text-white font-bold flex items-center gap-2"
                                onClick={() =>
                                    addToCart({
                                        reference: currentGlass.referencia,
                                        price: currentGlass.precio,
                                        marca: currentGlass.marca,
                                        cantidad: 1,
                                        img: currentGlass.img,
                                        material: currentGlass.material,
                                    })
                                }>
                                <RiLuggageCartFill />
                                {currentGlass.precio.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
