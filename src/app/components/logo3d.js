"use client";

import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
    useGLTF,
    PerspectiveCamera,
    OrbitControls,
    Environment,
    Lightformer,
} from "@react-three/drei";
import { Leva, useControls } from "leva";
import * as THREE from "three";

/* ===================== MODEL ===================== */
function Model(props) {
    const { nodes } = useGLTF("/files/logo_root3d_2/logo_root3d_2.gltf");

    // Définir des matériaux sans propriétés inutiles
    const metalnessValue = 0.5;
    const roughnessValue = 0.0;
    const transmissionValue = 1.0;
    const thicknessValue = 2.0;

    // 🔥 LEVA pour chaque pièce
    const piece1 = useControls("Middle", {
        color: "#ffffff",
        roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
        metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
        transmission: { value: transmissionValue, min: 0, max: 1, step: 0.01 }, // Transparence
        thickness: { value: thicknessValue, min: 0, max: 5, step: 0.1 }, // Épaisseur du matériau
    });

    const piece2 = useControls("Left", {
        color: "#00FFFF", // Aqua saturé
        roughness: { value: roughnessValue, min: 0, max: 1, step: 0.01 },
        metalness: { value: metalnessValue, min: 0, max: 1, step: 0.01 },
        transmission: { value: transmissionValue, min: 0, max: 1, step: 0.01 }, // Transparence
        thickness: { value: thicknessValue, min: 0, max: 5, step: 0.1 }, // Épaisseur du matériau
    });

    const piece3 = useControls("Right", {
        color: "#FF0000", // Rouge saturé
        roughness: { value: roughnessValue, min: 0, max: 1, step: 0.01 },
        metalness: { value: metalnessValue, min: 0, max: 1, step: 0.01 },
        transmission: { value: transmissionValue, min: 0, max: 1, step: 0.01 }, // Transparence
        thickness: { value: thicknessValue, min: 0, max: 5, step: 0.1 }, // Épaisseur du matériau
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

    // 🔥 LEVA pour manipuler les lumières
    const { ambientIntensity, directionalIntensity, pointIntensity, spotIntensity } = useControls({
        ambientIntensity: { value: 0.6, min: 0, max: 100, step: 0.1 },  // Augmenté
        directionalIntensity: { value: 6, min: 0, max: 100, step: 1 },  // Augmenté
        pointIntensity: { value: 10, min: 0, max: 100, step: 0.1 },  // Augmenté
        spotIntensity: { value: 10, min: 0, max: 100, step: 0.1 },  // Augmenté
    });

    return (
        <>
            {/* 🔥 LEVA UI */}
            <Leva collapsed={false} />

            {/* Remplacement de Chakra UI Box par un div */}
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
                <Canvas shadows gl={{ antialias: true, alpha: true }}>
                    <color attach="background" args={['#0400FF']} />
                    <color attach="background" args={['#F2F2F2']} />

                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} near={0.1} far={200} />
                    <OrbitControls target={[0, 0, 0]} minDistance={2} maxDistance={40} dampingFactor={0.08} rotateSpeed={0.5} />

                    {/* Lumière ambiante */}
                    <ambientLight intensity={ambientIntensity} />

                    {/* Lumière directionnelle rapprochée */}
                    <directionalLight position={[5, 6, 4]} intensity={directionalIntensity} castShadow />

                    {/* Lumière ponctuelle rapprochée */}
                    <pointLight position={[2, 3, 2]} intensity={pointIntensity} castShadow />

                    {/* SpotLight rapproché */}
                    <spotLight position={[0, 5, 2]} angle={Math.PI / 8} penumbra={1} intensity={spotIntensity} castShadow />

                    {/* Lumière d'environnement */}
                    <Environment resolution={512}>
                        <group rotation={[-Math.PI / 3, 0, 1]}>
                            <Lightformer form="circle" intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={7} />
                            <Lightformer form="circle" intensity={3} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
                            <Lightformer form="circle" intensity={3} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
                            <Lightformer form="circle" intensity={3} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
                        </group>
                    </Environment>

                    {/* Modèle */}
                    <Model scale={10} position={[0, 0, 1.5]} />
                </Canvas>
            </div>
        </>
    );
};

export default Logo;
