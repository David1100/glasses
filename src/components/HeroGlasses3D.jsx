import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

export default function HeroGlasses3D() {
    const containerRef = useRef(null)
    const frameIdRef = useRef(null)
    const modelRef = useRef(null)
    const timeRef = useRef(0)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const scene = new THREE.Scene()

        const aspect = container.clientWidth / container.clientHeight
        const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100)
        camera.position.set(0, 0.2, 7)

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.5
        renderer.outputColorSpace = THREE.SRGBColorSpace
        container.appendChild(renderer.domElement)

        // Better lighting
        const hemi = new THREE.HemisphereLight(0xffffff, 0x6666ff, 2)
        scene.add(hemi)

        const key = new THREE.DirectionalLight(0xffffff, 4)
        key.position.set(3, 5, 6)
        scene.add(key)

        const fill = new THREE.DirectionalLight(0x8888ff, 1.2)
        fill.position.set(-3, 1, 3)
        scene.add(fill)

        const rim = new THREE.DirectionalLight(0xffffff, 1)
        rim.position.set(-1, -3, -4)
        scene.add(rim)

        const top = new THREE.DirectionalLight(0xffffff, 1.5)
        top.position.set(0, 6, 0)
        scene.add(top)

        const loader = new GLTFLoader()
        loader.load(
            "/gafas/gafas_home.glb",
            (gltf) => {
                const model = gltf.scene

                // Scale
                const box = new THREE.Box3().setFromObject(model)
                const size = box.getSize(new THREE.Vector3())
                const maxDim = Math.max(size.x, size.y, size.z)
                const scale = 5 / maxDim
                model.scale.setScalar(scale)

                // Center
                const center = box.getCenter(new THREE.Vector3())
                model.position.sub(center.multiplyScalar(scale))

                // Rotate
                model.rotation.y = THREE.MathUtils.degToRad(-130)

                scene.add(model)

                // Auto-fit camera to rotated model
                const worldBox = new THREE.Box3().setFromObject(model)
                const worldSize = worldBox.getSize(new THREE.Vector3())
                const worldCenter = worldBox.getCenter(new THREE.Vector3())
                const maxWorldDim = Math.max(worldSize.x, worldSize.y, worldSize.z)
                const vFov = THREE.MathUtils.degToRad(camera.fov)
                const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
                const minFov = Math.min(vFov, hFov)
                const dist = maxWorldDim / (2 * Math.tan(minFov / 2))

                camera.position.set(worldCenter.x, worldCenter.y, worldCenter.z + dist * 1.0)
                camera.lookAt(worldCenter)

                model.userData.baseY = model.position.y
                modelRef.current = model
            },
            undefined,
            (err) => console.error("[HeroGlasses3D] Error loading model:", err)
        )

        const ro = new ResizeObserver(() => {
            const cw = container.clientWidth
            const ch = container.clientHeight
            camera.aspect = cw / ch
            camera.updateProjectionMatrix()
            renderer.setSize(cw, ch)
        })
        ro.observe(container)

        function animate() {
            frameIdRef.current = requestAnimationFrame(animate)
            timeRef.current += 0.016

            if (modelRef.current) {
                const m = modelRef.current
                m.position.y = m.userData.baseY + Math.sin(timeRef.current * 2) * 0.06
            }

            renderer.render(scene, camera)
        }
        animate()

        return () => {
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
            ro.disconnect()
            renderer.dispose()
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-[400px] pointer-events-none"
        />
    )
}
