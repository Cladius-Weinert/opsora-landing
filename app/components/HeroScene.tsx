"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function FloatingOrb() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere ref={ref} args={[1.2, 64, 64]} scale={1.1}>
        <MeshDistortMaterial
          color="#14b8a6"
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0.15}
          metalness={0.85}
          emissive="#0d4f44"
          emissiveIntensity={0.25}
        />
      </Sphere>
    </Float>
  );
}

function GoldRing() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2;
      ref.current.rotation.z += delta * 0.12;
    }
  });
  return (
    <Torus ref={ref} args={[2.1, 0.06, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
      <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} emissive="#b45309" emissiveIntensity={0.15} />
    </Torus>
  );
}

function InnerRing() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.25;
  });
  return (
    <Torus ref={ref} args={[1.55, 0.04, 16, 80]} rotation={[0, Math.PI / 4, Math.PI / 6]}>
      <meshStandardMaterial color="#34d399" metalness={0.8} roughness={0.25} transparent opacity={0.7} />
    </Torus>
  );
}

function Particles() {
  const count = 120;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#a7f3d0" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} color="#fef3c7" />
        <pointLight position={[-3, 2, 2]} intensity={0.8} color="#14b8a6" />
        <pointLight position={[3, -2, 1]} intensity={0.5} color="#f59e0b" />
        <Particles />
        <FloatingOrb />
        <GoldRing />
        <InnerRing />
      </Canvas>
  );
}
