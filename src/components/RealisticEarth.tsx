"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Mesh,
  Group,
  TextureLoader,
  Color,
  ShaderMaterial,
  AdditiveBlending,
  BackSide,
} from "three";
import { Stars } from "@react-three/drei";

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 sunDirection;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float fresnelFactor = dot(vNormal, normalize(-vPosition));
    float atmosphere = pow(1.0 - clamp(fresnelFactor, 0.0, 1.0), 4.5);
    vec3 atmosphereColor = vec3(0.2, 0.55, 1.0);
    gl_FragColor = vec4(atmosphereColor * atmosphere, atmosphere * 0.85);
  }
`;

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  uniform sampler2D dayTexture;
  uniform sampler2D nightTexture;
  uniform sampler2D cloudsTexture;
  uniform sampler2D specularTexture;
  uniform vec3 sunDirection;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);

    float sunDot = dot(normal, normalize(sunDirection));
    float dayFactor = clamp(sunDot * 2.5, 0.0, 1.0);
    float nightFactor = clamp(-sunDot * 2.5 + 0.15, 0.0, 1.0);

    vec4 dayColor   = texture2D(dayTexture, vUv);
    vec4 nightColor = texture2D(nightTexture, vUv);
    vec4 clouds     = texture2D(cloudsTexture, vUv);
    float oceanMask = texture2D(specularTexture, vUv).r;

    float ambient = 0.03;

    vec3 earthColor = mix(nightColor.rgb * 0.9, dayColor.rgb, dayFactor + ambient);

    float cloudAlpha = clouds.r * 0.85;
    vec3 cloudColor  = vec3(1.0) * (dayFactor + 0.05);
    earthColor       = mix(earthColor, cloudColor, cloudAlpha * (dayFactor + 0.1));

    vec3 viewDir    = normalize(-vPosition);
    vec3 sunDir     = normalize(sunDirection);
    vec3 halfVec    = normalize(sunDir + viewDir);
    float specPower = pow(max(dot(normal, halfVec), 0.0), 80.0);
    float specular  = specPower * oceanMask * dayFactor * 0.6;

    vec3 finalColor = earthColor + vec3(specular);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface EarthProps {
  rotationSpeed?: number;
  autoRotate?: boolean;
  interactive?: boolean;
}

function Earth({ rotationSpeed = 0.2, autoRotate = false, interactive = true }: EarthProps) {
  const earthRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const matRef = useRef<ShaderMaterial>(null);

  const textures = useMemo(() => {
    const loader = new TextureLoader();
    return {
      day: loader.load("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"),
      night: loader.load("https://unpkg.com/three-globe/example/img/earth-night.jpg"),
      clouds: loader.load("https://unpkg.com/three-globe/example/img/earth-clouds.png"),
      specular: loader.load("https://unpkg.com/three-globe/example/img/earth-water.png"),
    };
  }, []);

  const earthUniforms = useMemo(
    () => ({
      dayTexture: { value: null },
      nightTexture: { value: null },
      cloudsTexture: { value: null },
      specularTexture: { value: null },
      sunDirection: { value: new Color(1, 1, 1) },
    }),
    []
  );

  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.dayTexture.value = textures.day;
    matRef.current.uniforms.nightTexture.value = textures.night;
    matRef.current.uniforms.cloudsTexture.value = textures.clouds;
    matRef.current.uniforms.specularTexture.value = textures.specular;
  }, [textures]);

  useFrame((state, delta) => {
    if (autoRotate && earthRef.current) {
      earthRef.current.rotation.y += delta * rotationSpeed;
    }

    if (groupRef.current) {
      const targetY = interactive ? state.pointer.x * Math.PI * 0.45 : 0;
      const targetX = interactive ? state.pointer.y * 0.35 : 0.15;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
    }

    if (matRef.current) {
      matRef.current.uniforms.sunDirection.value.set(5, 3, 5);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 128, 128]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={earthUniforms}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.75, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={{ sunDirection: { value: new Color(5, 3, 5) } }}
          side={BackSide}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface RealisticEarthProps {
  showStars?: boolean;
  autoRotate?: boolean;
  rotationSpeed?: number;
  interactive?: boolean;
}

export function RealisticEarth({
  showStars = true,
  autoRotate = false,
  rotationSpeed = 0,
  interactive = true,
}: RealisticEarthProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ background: "transparent" }}
      className="w-full h-full rounded-full overflow-hidden"
    >
      <ambientLight intensity={0.04} />
      <directionalLight position={[5, 3, 5]} intensity={3.5} />

      {showStars && (
        <Stars
          radius={120}
          depth={60}
          count={7000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
      )}

      <Earth rotationSpeed={rotationSpeed || 0.2} autoRotate={autoRotate} interactive={interactive} />
    </Canvas>
  );
}
