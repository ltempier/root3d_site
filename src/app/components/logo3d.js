"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, OrbitControls, Loader } from "@react-three/drei";
import { Leva, useControls } from "leva";
import * as THREE from "three";

// Importer les effets de post-traitement
import {
    EffectComposer, Bloom, Noise, ChromaticAberration, Vignette, Outline
} from "@react-three/postprocessing";

/* ===================== MODEL ===================== */
function Model(props) {
    const { nodes, materials } = useGLTF("/logo_root3d_2/logo_root3d_2.gltf");

    const metalnessValue = 1
    const roughnessValue = 0.10

    const piece1 = useControls("Middle", {
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: { value: 0.6, min: 0, max: 5, step: 0.01 },
        opacity: { value: 1, min: 0, max: 1, step: 0.01 },
        // roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
        // metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
        roughness: { value: roughnessValue, min: 0, max: 1, step: 0.01 },
        metalness: { value: metalnessValue, min: 0, max: 1, step: 0.01 }
    });

    const piece2 = useControls("Left", {
        color: "#00FFFF",
        emissive: "#00FFFF",
        emissiveIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
        opacity: { value: 1, min: 0, max: 1, step: 0.01 },
        roughness: { value: roughnessValue, min: 0, max: 1, step: 0.01 },
        metalness: { value: metalnessValue, min: 0, max: 1, step: 0.01 }
    });

    const piece3 = useControls("Right", {
        color: "#FF0000",
        emissive: "#FF0000",
        emissiveIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
        opacity: { value: 1, min: 0, max: 1, step: 0.01 },
        roughness: { value: roughnessValue, min: 0, max: 1, step: 0.01 },
        metalness: { value: metalnessValue, min: 0, max: 1, step: 0.01 }
    });

    const pieces = [
        { name: "Pièce2^LOGO_ROOT3D-1", material: piece1, position: [0, 0, 0] },
        { name: "Copie_(2)_de_Pièce2^LOGO_ROOT3D-1", material: piece2, position: [-0.01, 0, 0] },
        { name: "Copy_of_Pièce2^LOGO_ROOT3D-1", material: piece3, position: [0.01, 0, 0] },
    ];

    return (
        <group {...props} dispose={null}>
            {pieces.map(({ name, material, position }) => {
                const piece = nodes[name];
                if (piece?.geometry) {
                    return (
                        <mesh
                            key={name}
                            geometry={piece.geometry}
                            position={position}
                            castShadow
                            receiveShadow
                        >
                            <meshStandardMaterial
                                color={material.color}
                                emissive={material.emissive}
                                emissiveIntensity={material.emissiveIntensity}
                                opacity={material.opacity}
                                transparent={material.opacity !== 1}
                                roughness={material.roughness}
                                metalness={material.metalness}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    );
                }
                return null;
            })}
        </group>
    );
}

/* ===================== SCENE ===================== */
const Logo = () => {
    const [loaded, setLoaded] = useState(false);
    const axesRef = useRef(null);

    useEffect(() => {
        if (axesRef.current) {
            axesRef.current.setColors(
                new THREE.Color("#ff5555"),
                new THREE.Color("#55ff55"),
                new THREE.Color("#5555ff")
            );
        }
    }, []);

    const {
        bloomIntensity,
        bloomWidth,
        bloomHeight,
        bloomKernelSize,
        bloomLuminanceThreshold,
        bloomLuminanceSmoothing,
        chromaticAberrationOffset,
        vignetteDarkness,
        vignetteOffset
    } = useControls({
        bloomIntensity: { value: 0.01, min: 0, max: 5, step: 0.01 },
        bloomWidth: { value: 300, min: 100, max: 1000, step: 10 },
        bloomHeight: { value: 300, min: 100, max: 1000, step: 10 },
        bloomKernelSize: { value: 3, min: 1, max: 5, step: 1 },
        bloomLuminanceThreshold: { value: 0, min: 0, max: 1, step: 0.01 },
        bloomLuminanceSmoothing: { value: 0, min: 0, max: 1, step: 0.01 },
        chromaticAberrationOffset: { value: [0.0, 0.01], min: -0.1, max: 0.1, step: 0.001 },
        vignetteDarkness: { value: 0.5, min: 0, max: 2, step: 0.1 },
        vignetteOffset: { value: 0.1, min: 0, max: 1, step: 0.01 }
    });

    const directionalLights = [
        {
            name: "key",
            position: [6, 8, 12],
            intensity: 1.1,
            castShadow: true,
            shadowSize: 2048,
            color: "#ffffff",
        },
        {
            name: "fill",
            position: [-6, -4, 6],
            intensity: 0.45,
            castShadow: false,
            color: "#ffffff",
        },
        {
            name: "rim",
            position: [0, 6, -14],
            intensity: 3,
            castShadow: false,
            color: "#99ccff",
        },
    ]

    const rainbowColors = [
        "#ff004c", "#ff7a00", "#ffe600", "#00ff88", "#00c8ff", "#5b5bff", "#c000ff"
    ]

    const rainbowLights = []

    const radius = 2 // distance max du centre
    const count = 51

    for (let i = 0; i < count; i++) {
        const theta = Math.acos(2 * Math.random() - 1) // angle vertical aléatoire 0->π
        const phi = Math.random() * Math.PI * 2        // angle horizontal 0->2π

        const x = radius * Math.sin(theta) * Math.cos(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(theta)

        const color = rainbowColors[i % rainbowColors.length]

        rainbowLights.push({ position: [x, y, z], color })
    }

    return (
        <>
            {/* 🔥 LEVA UI */}
            <Leva collapsed={false} hidden={false} />

            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "auto",
                }}
            >
                <Canvas
                    shadows
                    gl={{ antialias: true, alpha: true }}
                    onCreated={() => setLoaded(true)}
                >
                    <color attach="background" args={['#000000']} />
                    {/* <color attach="background" args={['#0000ff']} /> */}

                    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} near={0.1} far={200} />
                    <OrbitControls target={[0, 0, 0]} minDistance={2} maxDistance={40} dampingFactor={0.08} rotateSpeed={1} />

                    <ambientLight intensity={0.18} />

                    {rainbowLights.map((light, i) => (
                        <directionalLight
                            key={i}
                            position={light.position}
                            intensity={5}
                            color={light.color}
                        />
                    ))}


                    {/* Effets de post-traitement */}
                    <EffectComposer>
                        <ChromaticAberration offset={chromaticAberrationOffset} />
                        <Bloom
                            intensity={bloomIntensity}
                            width={bloomWidth}
                            height={bloomHeight}
                            kernelSize={bloomKernelSize}
                            luminanceThreshold={bloomLuminanceThreshold}
                            luminanceSmoothing={bloomLuminanceSmoothing}
                        />

                        <Vignette eskil={false} offset={vignetteOffset} darkness={vignetteDarkness} />
                    </EffectComposer>

                    {/* Modèle */}
                    {loaded && <Model scale={10} position={[0, 0, 1.5]} />}
                </Canvas>
                <Loader />
            </div>
        </>
    );
};

export default Logo;
