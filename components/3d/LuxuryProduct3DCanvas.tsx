'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Product } from '@/lib/store';
import { RotateCw, Sun, Sparkles, RefreshCw } from 'lucide-react';
import { buildProduct3DModel } from './Product3DModels';

interface LuxuryProduct3DCanvasProps {
  product: Product;
  scrollProgress?: number; // 0 to 1
  isInteractive?: boolean;
  compact?: boolean;
}

export default function LuxuryProduct3DCanvas({
  product,
  scrollProgress = 0,
  isInteractive = true,
  compact = false,
}: LuxuryProduct3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelPivotRef = useRef<THREE.Group | null>(null);
  const flameLightsRef = useRef<THREE.PointLight[]>([]);
  const keyLightRef = useRef<THREE.SpotLight | null>(null);
  const rimLightLeftRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRightRef = useRef<THREE.DirectionalLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // User interactive drag state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const userRotationRef = useRef({ x: 0, y: 0 });
  const targetUserRotation = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true); // Auto-rotate by default for dynamic luxury feel
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<'atelier' | 'noir' | 'golden'>('atelier');
  const [isLoaded, setIsLoaded] = useState(false);

  // Responsive camera helper
  const updateCameraResponsive = useCallback((w: number, h: number) => {
    if (!cameraRef.current) return;
    const aspect = w / h;
    cameraRef.current.aspect = aspect;

    // Responsive FOV and camera distance based on viewport aspect ratio
    if (aspect < 0.6) {
      // Narrow mobile phone
      cameraRef.current.fov = 42;
      cameraRef.current.position.set(0, 0, 4.6);
    } else if (aspect < 0.9) {
      // Mobile portrait / small tablet
      cameraRef.current.fov = 37;
      cameraRef.current.position.set(0, 0, 4.3);
    } else if (aspect < 1.5) {
      // Tablet landscape / standard desktop
      cameraRef.current.fov = 31;
      cameraRef.current.position.set(0, 0, 3.8);
    } else {
      // Ultra-wide desktop
      cameraRef.current.fov = 28;
      cameraRef.current.position.set(0, 0, 3.6);
    }
    cameraRef.current.lookAt(0, 0, 0);
    cameraRef.current.updateProjectionMatrix();
  }, []);

  // Setup Three.js Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraResponsive(width, height);

    // 3. WebGL Renderer with ACES Tone Mapping for hyper-luxurious lighting
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lights Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Warm Key Spotlight
    const keyLight = new THREE.SpotLight(0xffeedb, 3.8);
    keyLight.position.set(2.8, 4.2, 3.6);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.65;
    keyLight.castShadow = true;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Dramatic Rim Light (Left)
    const rimLeft = new THREE.DirectionalLight(0xdce7f5, 2.4);
    rimLeft.position.set(-3.8, 1.6, -2.2);
    scene.add(rimLeft);
    rimLightLeftRef.current = rimLeft;

    // Golden Rim Light (Right)
    const rimRight = new THREE.DirectionalLight(0xf5a524, 3.0);
    rimRight.position.set(3.8, 2.0, -1.6);
    scene.add(rimRight);
    rimLightRightRef.current = rimRight;

    // Soft Bottom Fill Light
    const bottomLight = new THREE.DirectionalLight(0xc9935a, 1.1);
    bottomLight.position.set(0, -2.5, 2.0);
    scene.add(bottomLight);

    // 5. Build Specific 3D Model using Product Model Factory
    const modelResult = buildProduct3DModel(product);
    flameLightsRef.current = modelResult.flameLights;

    // Create Root Pivot Group
    const rootPivot = new THREE.Group();
    scene.add(rootPivot);
    modelPivotRef.current = rootPivot;

    // Center model precisely at (0, 0, 0) using Bounding Box
    const box = new THREE.Box3().setFromObject(modelResult.group);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Offset internal group so center is exactly (0, 0, 0)
    modelResult.group.position.set(-center.x, -center.y, -center.z);
    rootPivot.add(modelResult.group);

    // 6. Ground Shadow Disc positioned directly beneath model base
    const shadowRadius = Math.max(size.x, size.z) * 0.85 + 0.4;
    const shadowGeo = new THREE.CircleGeometry(shadowRadius, 36);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -size.y / 2 - 0.04;
    scene.add(shadowMesh);

    // 7. Atmospheric Embers / Perfume Mist Particles
    const particleCount = compact ? 30 : 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4.2;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: modelResult.particleColor,
      size: 0.038,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Window / Element Resize Handler
    const handleResize = () => {
      if (!mount || !renderer) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      updateCameraResponsive(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    setIsLoaded(true);

    // 8. Main Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();

      // Atmospheric floating particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.04;
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] += Math.sin(elapsedTime * 0.8 + i) * 0.0012;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Dynamic flickering candle flames
      if (flameLightsRef.current.length > 0) {
        flameLightsRef.current.forEach((light, idx) => {
          light.intensity =
            2.3 +
            Math.sin(elapsedTime * (11 + idx * 2)) * 0.35 +
            Math.cos(elapsedTime * (16 + idx * 3)) * 0.2;
        });
      }

      // Smooth user rotation damping
      userRotationRef.current.x += (targetUserRotation.current.x - userRotationRef.current.x) * 0.08;
      userRotationRef.current.y += (targetUserRotation.current.y - userRotationRef.current.y) * 0.08;

      if (autoRotateRef.current) {
        targetUserRotation.current.y += 0.006;
      }

      // Model rotation & subtle floating breath
      if (modelPivotRef.current) {
        const scrollAngle = scrollProgress * Math.PI * 1.5;
        modelPivotRef.current.rotation.y = scrollAngle + userRotationRef.current.y;
        modelPivotRef.current.rotation.x = userRotationRef.current.x;

        // Subtle gentle breathing hover
        modelPivotRef.current.position.y = Math.sin(elapsedTime * 1.6) * 0.035;
      }

      if (cameraRef.current) {
        renderer.render(scene, cameraRef.current);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [product, updateCameraResponsive, compact]);

  // Lighting presets handler
  useEffect(() => {
    if (!keyLightRef.current || !rimLightLeftRef.current || !rimLightRightRef.current) return;

    if (lightingPreset === 'atelier') {
      keyLightRef.current.intensity = 3.8;
      keyLightRef.current.color.setHex(0xffeedb);
      rimLightLeftRef.current.intensity = 2.4;
      rimLightRightRef.current.intensity = 3.0;
    } else if (lightingPreset === 'noir') {
      keyLightRef.current.intensity = 1.4;
      keyLightRef.current.color.setHex(0xe2e8f0);
      rimLightLeftRef.current.intensity = 3.8;
      rimLightRightRef.current.intensity = 3.6;
    } else if (lightingPreset === 'golden') {
      keyLightRef.current.intensity = 4.4;
      keyLightRef.current.color.setHex(0xf59e0b);
      rimLightLeftRef.current.intensity = 2.8;
      rimLightRightRef.current.intensity = 4.0;
    }
  }, [lightingPreset]);

  // Pointer event handlers for 360° rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    targetUserRotation.current.y += deltaX * 0.012;
    targetUserRotation.current.x += deltaY * 0.008;

    // Limit vertical pitch to avoid flipping upside down
    targetUserRotation.current.x = Math.max(-0.55, Math.min(0.55, targetUserRotation.current.x));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const toggleAutoRotate = () => {
    autoRotateRef.current = !autoRotateRef.current;
    setIsAutoRotate(autoRotateRef.current);
  };

  const resetView = () => {
    targetUserRotation.current = { x: 0, y: 0 };
    autoRotateRef.current = false;
    setIsAutoRotate(false);
  };

  return (
    <div
      className={`luxury-3d-wrapper ${compact ? 'compact' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        cursor: isInteractive ? 'grab' : 'default',
        overflow: 'hidden',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Three.js Canvas mount */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating 3D Controls */}
      {isInteractive && (
        <div className={`three-d-controls-overlay ${compact ? 'compact' : ''}`}>
          {!compact && (
            <div className="three-d-badge">
              <Sparkles size={13} color="#dfab72" />
              <span>360° INTERACTIVE 3D · DRAG TO ROTATE</span>
            </div>
          )}

          <div className="three-d-actions-row">
            <button
              type="button"
              className={`three-d-btn-pill ${isAutoRotate ? 'active' : ''}`}
              onClick={toggleAutoRotate}
              title="Toggle turntable 360° rotation"
            >
              <RotateCw size={13} />
              <span>{isAutoRotate ? 'Pause 360°' : 'Spin 360°'}</span>
            </button>

            {!compact && (
              <button
                type="button"
                className="three-d-btn-pill"
                onClick={() => {
                  const presets: ('atelier' | 'noir' | 'golden')[] = ['atelier', 'noir', 'golden'];
                  const next = presets[(presets.indexOf(lightingPreset) + 1) % presets.length];
                  setLightingPreset(next);
                }}
                title="Switch studio lighting"
              >
                <Sun size={13} />
                <span>
                  {lightingPreset === 'atelier'
                    ? 'Studio Luxe'
                    : lightingPreset === 'noir'
                    ? 'Midnight Noir'
                    : 'Golden Glow'}
                </span>
              </button>
            )}

            <button
              type="button"
              className="three-d-btn-pill"
              onClick={resetView}
              title="Reset view angle"
            >
              <RefreshCw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
