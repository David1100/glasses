import * as THREE from "three"

export const MODEL_PROFILES = {
    "default": {
        rotation: [0, Math.PI, 0],
        position: [0, 0.02, 0.01],
        scale: 1
    }
}

export const DEFAULT_CALIBRATION = {
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    scale: 1
}

export class GlassesCalibrator {
    constructor() {
        this.faceAnchor = new THREE.Object3D()
        this.faceAnchor.name = "FaceAnchor"
        
        this.glassesPivot = new THREE.Object3D()
        this.glassesPivot.name = "GlassesPivot"
        this.faceAnchor.add(this.glassesPivot)
        
        this.glassesModel = null
        this.currentProfile = null
        this.landmarks = null
        
        this.faceBox = new THREE.Box3()
        this.faceSphere = new THREE.Sphere()
        this.modelBox = new THREE.Box3()
        this.modelSphere = new THREE.Sphere()
        
        this.tempVector = new THREE.Vector3()
        this.tempQuaternion = new THREE.Quaternion()
        this.tempMatrix = new THREE.Matrix4()
        
        this.config = {
            headScaleFactor: 4.0,
            defaultIPD: 0.063,
            verticalOffset: 0.012,
            depthOffset: 0.02,
            smoothingFactor: 0.3
        }
    }

    getAnchor() {
        return this.faceAnchor
    }

    getPivot() {
        return this.glassesPivot
    }

    setProfile(profile) {
        this.currentProfile = profile
    }

    getProfile(modelUrl) {
        if (!modelUrl) return null
        
        const fileName = modelUrl.split("/").pop().toLowerCase()
        
        for (const [key, profile] of Object.entries(MODEL_PROFILES)) {
            if (fileName.includes(key.toLowerCase())) {
                return { ...profile, fileName: key }
            }
        }
        
        return null
    }

    normalizeGlassesModel(model) {
        model.traverse((child) => {
            if (child instanceof THREE.Object3D) {
                child.castShadow = false
                child.receiveShadow = false
            }
            
            if (child instanceof THREE.SkinnedMesh) {
                child.frustumCulled = false
                if (child.skeleton) {
                    child.skeleton.calculateInverses()
                }
            }
            
            if (child.mixer) {
                child.mixer.stopAllAction()
            }
        })

        if (model.animations?.length) {
            const mixer = new THREE.AnimationMixer(model)
            mixer.stopAllAction()
        }

        this.modelBox.setFromObject(model)
        this.modelBox.getCenter(this.tempVector)
        model.position.sub(this.tempVector)

        this.modelBox.setFromObject(model)
        this.modelBox.getSize(this.tempVector)
        const maxDimension = Math.max(this.tempVector.x, this.tempVector.y, this.tempVector.z)
        
        if (maxDimension > 0) {
            model.scale.setScalar(1 / maxDimension)
        }

        model.rotation.set(0, 0, 0)
        model.updateMatrix()
        
        this.modelBox.setFromObject(model)
        this.modelBox.getBoundingSphere(this.modelSphere)

        const analysis = {
            bounds: {
                min: { x: this.modelBox.min.x, y: this.modelBox.min.y, z: this.modelBox.min.z },
                max: { x: this.modelBox.max.x, y: this.modelBox.max.y, z: this.modelBox.max.z }
            },
            size: {
                x: this.tempVector.x,
                y: this.tempVector.y,
                z: this.tempVector.z
            },
            sphere: {
                center: { x: this.modelSphere.center.x, y: this.modelSphere.center.y, z: this.modelSphere.center.z },
                radius: this.modelSphere.radius
            },
            ratios: {
                widthHeight: this.tempVector.x / (this.tempVector.y || 1),
                widthDepth: this.tempVector.x / (this.tempVector.z || 1),
                depthWidth: this.tempVector.z / (this.tempVector.x || 1)
            }
        }

        console.log("=== GLASSES MODEL ANALYSIS ===")
        console.log("Bounds:", analysis.bounds)
        console.log("Size:", analysis.size)
        console.log("Sphere:", analysis.sphere)
        console.log("Ratios:", analysis.ratios)
        console.log("==============================")

        return { model, analysis }
    }

    autoCalibrate(model, analysis) {
        const { width, height, depth } = analysis.size
        const { widthDepth, depthWidth } = analysis.ratios

        let rotation = [0, 0, 0]
        let positionOffset = [0, 0, 0]

        if (depthWidth > 1.8) {
            rotation = [0, Math.PI / 2, 0]
            console.log("Auto-calibrate: detected SIDE orientation, rotating Y 90°")
        } else if (widthDepth > 1.8) {
            rotation = [0, Math.PI, 0]
            console.log("Auto-calibrate: detected FRONT orientation, rotating Y 180°")
        } else if (height > width && height > depth) {
            rotation = [-Math.PI / 2, 0, 0]
            console.log("Auto-calibrate: detected VERTICAL orientation, rotating X -90°")
        } else {
            rotation = [0, Math.PI, 0]
            console.log("Auto-calibrate: using DEFAULT orientation Y 180°")
        }

        positionOffset = [0, 0.02, 0.01]

        return {
            rotation,
            position: positionOffset,
            scale: 1,
            autoCalibrated: true
        }
    }

    applyCalibration(model, calibration, profile = null) {
        const [rx, ry, rz] = calibration.rotation
        const [px, py, pz] = calibration.position

        model.rotation.set(rx, ry, rz)
        model.position.set(px, py, pz)
        
        if (calibration.scale !== undefined) {
            model.scale.setScalar(calibration.scale)
        }

        model.updateMatrix()

        if (this.glassesModel && this.glassesModel !== model) {
            this.glassesPivot.remove(this.glassesModel)
        }

        this.glassesModel = model
        this.glassesPivot.add(model)

        console.log("=== CALIBRATION APPLIED ===")
        console.log("Profile:", profile || "AUTO")
        console.log("Rotation:", calibration.rotation)
        console.log("Position:", calibration.position)
        console.log("Scale:", calibration.scale)
        console.log("===========================")
    }

    loadModel(url, gltfLoader) {
        return new Promise((resolve, reject) => {
            const fullUrl = url.startsWith("http")
                ? url
                : `https://fullmedicapp.com/api${url}`

            gltfLoader.load(
                fullUrl,
                (gltf) => {
                    const { model, analysis } = this.normalizeGlassesModel(gltf.scene)
                    
                    const profile = this.getProfile(url)
                    let calibration

                    if (profile) {
                        calibration = {
                            rotation: profile.rotation,
                            position: profile.position,
                            scale: profile.scale
                        }
                        console.log("Using PROFILE calibration for:", profile.fileName)
                    } else {
                        calibration = this.autoCalibrate(model, analysis)
                        console.log("Using AUTO calibration")
                    }

                    this.applyCalibration(model, calibration, profile?.fileName)
                    this.currentProfile = profile

                    resolve({
                        model,
                        analysis,
                        calibration,
                        profile
                    })
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error)
                    reject(error)
                }
            )
        })
    }

    updateFromLandmarks(landmarks, canvasWidth, canvasHeight) {
        if (!landmarks || !this.faceAnchor) return

        const leftEye = landmarks.leftEye
        const rightEye = landmarks.rightEye
        const nose = landmarks.nose

        const eyeCenterX = (leftEye.x + rightEye.x) / 2
        const eyeCenterY = (leftEye.y + rightEye.y) / 2

        const x = (eyeCenterX / canvasWidth) * 2 - 1
        const y = -(eyeCenterY / canvasHeight) * 2 + 1
        const z = -nose.z * 2

        this.tempVector.set(x, y + this.config.verticalOffset, z + this.config.depthOffset)
        
        this.faceAnchor.position.lerp(this.tempVector, this.config.smoothingFactor)

        const headTurnAngle = landmarks.headTurnAngle || 0
        const headTiltAngle = landmarks.headTiltAngle || 0

        this.tempQuaternion.setFromEuler(
            new THREE.Euler(
                headTiltAngle * 0.15,
                headTurnAngle * 0.2,
                0,
                "XYZ"
            )
        )

        this.faceAnchor.quaternion.slerp(this.tempQuaternion, this.config.smoothingFactor)
    }

    updateScale(landmarks, canvasWidth) {
        if (!landmarks || !this.glassesModel) return

        const ipd = landmarks.ipd || this.config.defaultIPD
        
        const normalizedIPD = ipd / canvasWidth
        const targetScale = normalizedIPD * this.config.headScaleFactor

        const currentScale = this.glassesPivot.scale.x
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, this.config.smoothingFactor)

        this.glassesPivot.scale.setScalar(newScale)
    }

    setConfig(config) {
        this.config = { ...this.config, ...config }
    }

    getConfig() {
        return { ...this.config }
    }

    dispose() {
        if (this.glassesModel) {
            this.glassesModel.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry?.dispose()
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose())
                    } else {
                        child.material?.dispose()
                    }
                }
            })
        }
        
        this.faceAnchor.remove(this.glassesPivot)
        this.glassesPivot.remove(this.glassesModel)
        
        this.glassesModel = null
        this.landmarks = null
    }
}

export function createGlassesCalibrator() {
    return new GlassesCalibrator()
}
