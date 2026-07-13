import { useEffect, useRef, useState } from "react"
import { RiLuggageCartFill, RiUserSmileLine } from "react-icons/ri"
import { useCartStore } from "../hooks/useCart"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { MindARThree } from "mind-ar/dist/mindar-face-three.prod.js"

const LANDMARK = {
    TOP_HEAD: 10,
    NOSE_BRIDGE: 168,
    LEFT_TEMPLE: 234,
    RIGHT_TEMPLE: 454,
    BOTTOM_CHIN: 152,
}

const FACE_VERTEX_COUNT = 468
const OCCLUDER_INFLATE = 1.06
const TEMPLE_REGION_RADIUS = 0.035
const TEMPLE_PUSH = 0.012

const _center = new THREE.Vector3()
const _tmpVec = new THREE.Vector3()
const _box = new THREE.Box3()
const _tmpA = new THREE.Vector3()
const _tmpB = new THREE.Vector3()
const _vA = new THREE.Vector3()
const _vB = new THREE.Vector3()

const getGlassesRatio = () => window.innerWidth < 768 ? 1.0 : 1.05

function updateOccluderGeometry(occluder, metricLandmarks, faceMatrix) {
    if (!occluder || !metricLandmarks) return

    const pos = occluder.geometry.attributes.position.array

    _center.set(0, 0, 0)
    for (let i = 0; i < FACE_VERTEX_COUNT; i++) {
        _center.x += metricLandmarks[i][0]
        _center.y += metricLandmarks[i][1]
        _center.z += metricLandmarks[i][2]
    }
    _center.x /= FACE_VERTEX_COUNT
    _center.y /= FACE_VERTEX_COUNT
    _center.z /= FACE_VERTEX_COUNT

    const lt = metricLandmarks[LANDMARK.LEFT_TEMPLE]
    const rt = metricLandmarks[LANDMARK.RIGHT_TEMPLE]

    for (let i = 0; i < FACE_VERTEX_COUNT; i++) {
        _tmpVec.set(
            metricLandmarks[i][0] - _center.x,
            metricLandmarks[i][1] - _center.y,
            metricLandmarks[i][2] - _center.z,
        )

        pos[i * 3] = _center.x + _tmpVec.x * OCCLUDER_INFLATE
        pos[i * 3 + 1] = _center.y + _tmpVec.y * OCCLUDER_INFLATE
        pos[i * 3 + 2] = _center.z + _tmpVec.z * OCCLUDER_INFLATE

        const mL = metricLandmarks[i]
        const dxL = mL[0] - lt[0]
        const dyL = mL[1] - lt[1]
        const dzL = mL[2] - lt[2]
        const distL = dxL * dxL + dyL * dyL + dzL * dzL

        const dxR = mL[0] - rt[0]
        const dyR = mL[1] - rt[1]
        const dzR = mL[2] - rt[2]
        const distR = dxR * dxR + dyR * dyR + dzR * dzR

        const radiusSq = TEMPLE_REGION_RADIUS * TEMPLE_REGION_RADIUS

        if (distL < radiusSq || distR < radiusSq) {
            const nearL = distL < distR
            const dist = nearL ? distL : distR
            const t = 1 - Math.sqrt(dist) / TEMPLE_REGION_RADIUS
            const weight = t * t * (3 - 2 * t)
            const dir = nearL ? -1 : 1
            pos[i * 3] += dir * weight * TEMPLE_PUSH
        }
    }

    occluder.geometry.attributes.position.needsUpdate = true
    occluder.matrix.set(...faceMatrix)
}

function lerpValue(current, target, factor) {
    return current + (target - current) * factor
}

export default function FaceGlasses() {
    const containerRef = useRef(null)
    const glassesAnchorRef = useRef(null)
    const faceMeshRef = useRef(null)
    const gltfLoaderRef = useRef(new GLTFLoader())
    const occluderRef = useRef(null)
    const modelRef = useRef(null)
    const glassesRatioRef = useRef(getGlassesRatio())

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

    const modelWidthRef = useRef(0)

    const load3DModel = (url) => {
        const anchor = glassesAnchorRef.current
        if (!anchor) return

        setLoading3D(true)
        modelRef.current = null
        modelWidthRef.current = 0

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
                _box.setFromObject(model)
                const modelWidth = _box.max.x - _box.min.x
                modelWidthRef.current = modelWidth

                model.position.set(-0.01, -0.05, -0.45)
                model.rotation.set(THREE.MathUtils.degToRad(-1), 0, 0)

                model.scale.set(1, 1, 1)
                anchor.add(model)
                modelRef.current = model
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

        const isMobile = window.innerWidth < 1024
        const mobileWrapper = isMobile ? containerRef.current.parentElement : null

        if (isMobile && mobileWrapper) {
            mobileWrapper.style.position = "fixed"
            mobileWrapper.style.top = "0"
            mobileWrapper.style.left = "0"
            mobileWrapper.style.width = "100vw"
            mobileWrapper.style.height = "100dvh"
            mobileWrapper.style.zIndex = "30"
            mobileWrapper.style.overflow = "hidden"
            mobileWrapper.style.background = "#000"
        }

        const mindarThree = new MindARThree({
            container: containerRef.current,
        })

        if (isMobile) {
            mindarThree._resize = () => {
                const { renderer, camera, container, video } = mindarThree
                if (!video) return

                video.setAttribute("width", video.videoWidth)
                video.setAttribute("height", video.videoHeight)
                mindarThree.controller.onInputResized(video)

                const { fov, aspect, near, far } = mindarThree.controller.getCameraParams()
                camera.fov = fov
                camera.aspect = aspect
                camera.near = near
                camera.far = far

                const videoAspect = video.videoWidth / video.videoHeight
                const containerAspect = container.clientWidth / container.clientHeight
                let coverW, coverH
                if (videoAspect > containerAspect) {
                    coverH = container.clientHeight
                    coverW = coverH * videoAspect
                } else {
                    coverW = container.clientWidth
                    coverH = coverW / videoAspect
                }

                const vw = container.clientWidth
                const vh = container.clientHeight
                const offsetX = Math.round((coverW - vw) / 2)
                const offsetY = Math.round((coverH - vh) / 2)
                camera.setViewOffset(coverW, coverH, offsetX, offsetY, vw, vh)
                camera.updateProjectionMatrix()

                const dpr = Math.min(window.devicePixelRatio, 2)
                renderer.setPixelRatio(dpr)
                renderer.setSize(vw, vh)

                const canvas = renderer.domElement
                canvas.style.position = "absolute"
                canvas.style.top = "0"
                canvas.style.left = "0"
                canvas.style.width = "100%"
                canvas.style.height = "100%"

                video.style.position = "absolute"
                video.style.top = "0"
                video.style.left = "0"
                video.style.width = "100%"
                video.style.height = "100%"
                video.style.objectFit = "cover"
                video.style.transform = mindarThree.shouldFaceUser && !mindarThree.disableFaceMirror
                    ? "scaleX(-1)" : "scaleX(1)"
            }
        }

        const { renderer, scene, camera } = mindarThree

        scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1))

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
        dirLight.position.set(0, 5, 5)
        scene.add(dirLight)

        const anchor = mindarThree.addAnchor(LANDMARK.NOSE_BRIDGE)
        glassesAnchorRef.current = anchor.group

        const faceMesh = mindarThree.addFaceMesh()
        faceMesh.material.transparent = true
        faceMesh.material.opacity = 0
        scene.add(faceMesh)
        faceMeshRef.current = faceMesh

        const indexData = faceMesh.geometry.index.array.slice()
        const occluderGeo = new THREE.BufferGeometry()
        const occluderPos = new Float32Array(FACE_VERTEX_COUNT * 3)
        occluderGeo.setAttribute("position", new THREE.BufferAttribute(occluderPos, 3))
        occluderGeo.setIndex(new THREE.BufferAttribute(indexData, 1))
        const occluderMat = new THREE.MeshBasicMaterial({
            colorWrite: false,
            depthWrite: true,
            depthTest: true,
            side: THREE.DoubleSide,
        })
        const occluder = new THREE.Mesh(occluderGeo, occluderMat)
        occluder.renderOrder = 0
        occluder.frustumCulled = false
        occluder.matrixAutoUpdate = false
        occluder.visible = false
        scene.add(occluder)
        occluderRef.current = occluder

        mindarThree.start()

        let videoTimer = null
        let onResize = null

        if (isMobile) {
            videoTimer = setInterval(() => {
                const video = containerRef.current.querySelector("video")
                if (video) {
                    clearInterval(videoTimer)
                    videoTimer = null
                    mindarThree._resize()
                }
            }, 200)

            onResize = () => mindarThree._resize()
            window.addEventListener("resize", onResize)
        }

        let faceTypeDetected = false
        let prevDetected = false
        let smoothScale = 0

        renderer.setAnimationLoop(() => {
            const estimate = mindarThree.getLatestEstimate()
            const hasEstimate = estimate && estimate.metricLandmarks

            if (hasEstimate) {
                const { metricLandmarks, faceMatrix, faceScale } = estimate

                occluder.visible = true
                updateOccluderGeometry(occluder, metricLandmarks, faceMatrix)

                const model = modelRef.current
                const modelWidth = modelWidthRef.current
                if (model && modelWidth > 0 && faceScale > 0) {
                    _tmpA.set(
                        metricLandmarks[LANDMARK.LEFT_TEMPLE][0],
                        metricLandmarks[LANDMARK.LEFT_TEMPLE][1],
                        metricLandmarks[LANDMARK.LEFT_TEMPLE][2],
                    )
                    _tmpB.set(
                        metricLandmarks[LANDMARK.RIGHT_TEMPLE][0],
                        metricLandmarks[LANDMARK.RIGHT_TEMPLE][1],
                        metricLandmarks[LANDMARK.RIGHT_TEMPLE][2],
                    )
                    const faceWidth = _tmpA.distanceTo(_tmpB)
                    const targetScale = (faceWidth * glassesRatioRef.current) / (faceScale * modelWidth)
                    if (smoothScale === 0) {
                        smoothScale = targetScale
                    }
                    smoothScale = lerpValue(smoothScale, targetScale, 0.2)
                    model.scale.setScalar(smoothScale)
                }
            } else {
                occluder.visible = false
            }

            renderer.render(scene, camera)

            const isDetected = anchor.group.visible
            if (isDetected !== prevDetected) {
                prevDetected = isDetected
                setFaceDetected(isDetected)
                setLoadingFace(!isDetected)
                if (!isDetected) {
                    faceTypeDetected = false
                    smoothScale = 0
                }
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
            if (onResize) window.removeEventListener("resize", onResize)
            if (videoTimer) clearInterval(videoTimer)
            if (mobileWrapper) {
                mobileWrapper.style.position = ""
                mobileWrapper.style.top = ""
                mobileWrapper.style.left = ""
                mobileWrapper.style.width = ""
                mobileWrapper.style.height = ""
                mobileWrapper.style.zIndex = ""
                mobileWrapper.style.overflow = ""
                mobileWrapper.style.background = ""
            }
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
        <div className="relative w-full h-full">
            <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" />

            {loadingFace && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="bg-white/80 border border-white/10 rounded-2xl px-4 py-3 flex flex-col items-center gap-2 animate-fade-in">
                        <div className="relative size-8">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full size-8 bg-primary"></span>
                        </div>
                        <p className="text-[10px] uppercase tracking-wider">Analizando rostro...</p>
                    </div>
                </div>
            )}

            <div className="absolute max-lg:top-4 lg:top-6 left-4 flex gap-1.5 z-10">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/10 animate-pulse shadow">
                    <div className="size-1.5 rounded-full bg-red-500"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">En Vivo</span>
                </div>
                {faceDetected && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/10 shadow">
                        <RiUserSmileLine className="text-primary text-[10px]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Rostro Detectado</span>
                    </div>
                )}
                {loading3D && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-100 backdrop-blur-md border border-purple-200 shadow">
                        <span className="size-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Cargando 3D...</span>
                    </div>
                )}
            </div>

            <a href="/carrito"
                className="lg:hidden absolute top-4 right-4 z-10 size-9 flex items-center justify-center bg-white/80 backdrop-blur-md border border-white/10 rounded-full shadow">
                <RiLuggageCartFill size={18} className="text-primary" />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded-full">
                        {cart.length}
                    </span>
                )}
            </a>

            {faceDetected && faceType && (
                <div className="absolute max-lg:top-16 lg:top-6 lg:right-6 left-4 lg:left-auto z-10">
                    <div className="bg-white/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 w-44 animate-fade-in shadow">
                        <p className="text-[10px] text-black uppercase tracking-wide">Tipo de rostro</p>
                        <p className="text-xs font-bold text-primary mb-1.5">{faceType}</p>
                        <a href={`/?tipo_rostro=${faceType}`}
                            className="block text-center text-[10px] font-bold bg-linear-to-r from-primary to-secondary text-white rounded-full py-1 hover:scale-105 transition">
                            Ver gafas ideales
                        </a>
                    </div>
                </div>
            )}

            {currentGlass?.referencia && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 max-lg:w-4/5 w-auto">
                    <div className="bg-white/85 shadow px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 backdrop-blur-md">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h2 className="text-primary font-bold text-[10px]">MODELO ACTUAL</h2>
                                {currentGlass.model3d && (
                                    <span className="bg-purple-100 text-purple-700 text-[8px] px-1.5 py-0.5 rounded-full font-bold">3D</span>
                                )}
                            </div>
                            <h1 className="text-xs font-bold truncate">{currentGlass.name || currentGlass.referencia}</h1>
                            <p className="text-gray-600 text-[10px]">{currentGlass.marca} · {currentGlass.material}</p>
                        </div>
                        {cart.some((item) => item.reference === currentGlass.referencia) ? (
                            <a href="/carrito"
                                className="bg-linear-to-r from-primary to-secondary rounded-full px-3 py-1.5 text-xs text-white font-bold flex items-center gap-1 shrink-0">
                                <RiLuggageCartFill size={12} /> Carrito
                            </a>
                        ) : (
                            <button
                                className="bg-linear-to-r from-primary to-secondary rounded-full px-3 py-1.5 text-xs text-white font-bold flex items-center gap-1 shrink-0"
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
                                <RiLuggageCartFill size={12} />
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
