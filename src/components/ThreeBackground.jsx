import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Custom Aurora Shader — Enhanced with section-aware colors ──
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform vec2 uResolution;
  uniform float uScrollVelocity;
  varying vec2 vUv;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;
    float scrollOffset = uScroll * 0.8;
    
    // Scroll velocity distortion
    float velDistort = uScrollVelocity * 0.003;

    // Enhanced mouse influence
    vec2 mouseInfluence = (uMouse - 0.5) * 0.25;

    // Layer 1 — deep violet aurora
    float n1 = snoise(vec3(
      uv.x * 1.8 + mouseInfluence.x + velDistort,
      uv.y * 2.5 + t + scrollOffset,
      t * 0.4
    )) * 0.5 + 0.5;
    n1 = pow(n1, 2.2);

    // Layer 2 — cyan ribbons
    float n2 = snoise(vec3(
      uv.x * 2.5 - t * 0.25 + mouseInfluence.x * 1.2,
      uv.y * 3.5 + t * 0.6 + scrollOffset,
      t * 0.25
    )) * 0.5 + 0.5;
    n2 = pow(n2, 2.8);

    // Layer 3 — rose glow
    float n3 = snoise(vec3(
      uv.x * 1.2 + t * 0.15,
      uv.y * 1.8 - t * 0.35 + scrollOffset + mouseInfluence.y * 1.3,
      t * 0.5
    )) * 0.5 + 0.5;
    n3 = pow(n3, 3.5);

    // Layer 4 — golden accent (new)
    float n4 = snoise(vec3(
      uv.x * 3.0 + t * 0.1 + mouseInfluence.x,
      uv.y * 2.0 + scrollOffset * 1.5,
      t * 0.7
    )) * 0.5 + 0.5;
    n4 = pow(n4, 5.0);

    // Section-aware color shifting based on scroll
    float sectionPhase = uScroll * 6.28318; // full cycle across page

    // Colors shift subtly based on scroll position
    vec3 violet = vec3(0.54, 0.36, 0.96) * (1.0 + sin(sectionPhase) * 0.15);
    vec3 cyan = vec3(0.0, 0.898, 1.0) * (1.0 + sin(sectionPhase + 2.09) * 0.15);
    vec3 rose = vec3(1.0, 0.176, 0.459) * (1.0 + sin(sectionPhase + 4.19) * 0.15);
    vec3 gold = vec3(0.98, 0.75, 0.14);
    vec3 deep = vec3(0.018, 0.018, 0.03);

    // Compositing
    vec3 color = deep;
    color = mix(color, violet, n1 * 0.4);
    color = mix(color, cyan, n2 * 0.25);
    color = mix(color, rose, n3 * 0.18);
    color = mix(color, gold, n4 * 0.08);

    // Mouse proximity glow
    float mouseDist = length(uv - uMouse);
    float mouseGlow = smoothstep(0.35, 0.0, mouseDist) * 0.08;
    color += violet * mouseGlow;

    // Enhanced vignette
    float vignette = 1.0 - smoothstep(0.15, 1.5, length(uv - 0.5) * 2.0);
    color *= vignette;

    // Subtle scan lines
    float scanline = sin(uv.y * uResolution.y * 0.5) * 0.015 + 1.0;
    color *= scanline;

    // Gamma correction for richer colors
    color = pow(color, vec3(0.95));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const AuroraPlane = () => {
  const meshRef = useRef();
  const { viewport } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollVelRef = useRef(0);
  const lastScrollRef = useRef(0);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uScroll: { value: 0 },
    uScrollVelocity: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  }), []);

  // Track mouse
  React.useEffect(() => {
    const handleMouse = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouse);

    const handleResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
    };
  }, [uniforms]);

  // Track scroll — only store position/velocity in refs; uniforms are updated in useFrame
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollVelRef.current = scrollY - lastScrollRef.current;
      lastScrollRef.current = scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;

      // Update scroll uniform in the render loop so it's always frame-accurate
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      uniforms.uScroll.value = maxScroll > 0 ? lastScrollRef.current / maxScroll : 0;

      uniforms.uMouse.value.x += (mouseRef.current.x - uniforms.uMouse.value.x) * 0.04;
      uniforms.uMouse.value.y += (mouseRef.current.y - uniforms.uMouse.value.y) * 0.04;

      // Smooth velocity, then reset ref so it decays to 0 when scroll stops
      uniforms.uScrollVelocity.value += (scrollVelRef.current - uniforms.uScrollVelocity.value) * 0.1;
      scrollVelRef.current = 0;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export const ThreeBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      background: '#050508',
    }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        dpr={window.innerWidth < 768 ? 0.75 : Math.min(window.devicePixelRatio, 1.2)}
      >
        <AuroraPlane />
      </Canvas>
    </div>
  );
};
