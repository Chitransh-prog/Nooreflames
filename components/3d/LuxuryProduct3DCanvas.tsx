'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Product } from '@/lib/store';
import { buildProduct3DModel } from './Product3DModels';

interface LuxuryProduct3DCanvasProps {
  product: Product;
  scrollProgress?: number; // 0 to 1
  isInteractive?: boolean;
  compact?: boolean;
}

// Generate a soft radial contact shadow texture for authentic grounding
function createContactShadowTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.76)');
  grad.addColorStop(0.22, 'rgba(10, 8, 6, 0.50)');
  grad.addColorStop(0.52, 'rgba(10, 8, 6, 0.18)');
  grad.addColorStop(0.82, 'rgba(10, 8, 6, 0.04)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Actual model bounding dimensions for precision camera framing
  const modelSizeRef = useRef<THREE.Vector3>(new THREE.Vector3(1.8, 3.2, 1.8));

  // Dynamic responsive camera framing adapted to all screen sizes (mobile, tablet, laptop, ultrawide)
  const updateCameraResponsive = useCallback(
    (w: number, h: number) => {
      if (!cameraRef.current) return;
      const aspect = w / h;
      cameraRef.current.aspect = aspect;

      // Telephoto portrait perspective (26° to 32°) to eliminate wide-angle barrel distortion
      const isMobile = aspect < 0.75;
      const isTablet = aspect >= 0.75 && aspect < 1.15;
      const fov = isMobile ? 32 : isTablet ? 29 : 26;
      cameraRef.current.fov = fov;

      const size = modelSizeRef.current;
      const baseScale = compact ? 0.74 : 0.82;
      const effectiveH = Math.max(size.y * baseScale, 1.2);
      const effectiveW = Math.max(Math.max(size.x, size.z) * baseScale, 0.9);

      // Target screen proportion:
      // Mobile: 48% viewport height (ample negative space, no header/badge conflict, easy scroll)
      // Compact: 62% viewport height (refined padding inside buy box gallery frame)
      // Desktop / Tablet: 50% viewport height (museum-grade luxury breathing space)
      const targetFillY = compact ? 0.62 : isMobile ? 0.48 : 0.50;
      const maxFillX = isMobile ? 0.65 : 0.58;

      const fovRad = (fov * Math.PI) / 180;
      const distV = (effectiveH / targetFillY) / (2 * Math.tan(fovRad / 2));
      const distH = (effectiveW / maxFillX) / (2 * Math.tan(fovRad / 2) * aspect);

      const targetDist = Math.max(distV, distH);
      cameraRef.current.position.set(0, 0, targetDist);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
    },
    [compact]
  );

  // Setup Three.js Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with initial responsive projection
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACES Tone Mapping & high-performance configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment (IBL) for authentic crystal refraction, liquid depth, and gold reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 1.15;

    // 5. Studio Lights Setup
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.38);
    scene.add(ambientLight);

    // Warm Key Spotlight with soft penumbra
    const keyLight = new THREE.SpotLight(0xffeedb, 3.6);
    keyLight.position.set(3.2, 4.6, 3.8);
    keyLight.angle = Math.PI / 4.2;
    keyLight.penumbra = 0.75;
    keyLight.decay = 1.4;
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Crisp Cool Glass Rim Light (Left)
    const rimLeft = new THREE.DirectionalLight(0xdce8fa, 2.5);
    rimLeft.position.set(-4.2, 2.2, -2.4);
    scene.add(rimLeft);
    rimLightLeftRef.current = rimLeft;

    // Golden Backlight Rim (Right)
    const rimRight = new THREE.DirectionalLight(0xf7a936, 3.2);
    rimRight.position.set(4.0, 2.4, -2.0);
    scene.add(rimRight);
    rimLightRightRef.current = rimRight;

    // Subtle Warm Base Fill
    const bottomLight = new THREE.DirectionalLight(0xbba58e, 0.7);
    bottomLight.position.set(0, -2.0, 2.2);
    scene.add(bottomLight);

    // 6. Build Specific 3D Model using Product Model Factory
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
    modelSizeRef.current = size;

    // Offset internal group so center is exactly (0, 0, 0)
    modelResult.group.position.set(-center.x, -center.y, -center.z);
    rootPivot.add(modelResult.group);

    // Scale root pivot so model is refined and a bit smaller with exquisite proportions
    const baseScale = compact ? 0.74 : 0.82;
    rootPivot.scale.set(baseScale, baseScale, baseScale);

    // Adjust camera framing with true model geometry and container aspect
    updateCameraResponsive(width, height);

    // 7. Soft Studio Radial Contact Shadow Grounding
    const shadowTexture = createContactShadowTexture();
    const shadowRadius = Math.max(size.x, size.z) * baseScale * 0.95 + 0.35;
    const shadowGeo = new THREE.PlaneGeometry(shadowRadius * 2, shadowRadius * 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture || undefined,
      color: shadowTexture ? 0xffffff : 0x000000,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = (-size.y * baseScale) / 2 - 0.02;
    scene.add(shadowMesh);

    // 8. Atmospheric Embers / Perfume Mist Particles
    const particleCount = compact ? 22 : 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 3.8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3.8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: modelResult.particleColor,
      size: 0.026,
      transparent: true,
      opacity: 0.45,
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

    // 9. Main Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();

      // Atmospheric floating particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.035;
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] += Math.sin(elapsedTime * 0.8 + i) * 0.001;
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
        targetUserRotation.current.y += 0.005;
      }

      // Model rotation & subtle gentle breathing hover
      if (modelPivotRef.current) {
        const scrollAngle = scrollProgress * Math.PI * 1.5;
        modelPivotRef.current.rotation.y = scrollAngle + userRotationRef.current.y;
        modelPivotRef.current.rotation.x = userRotationRef.current.x;

        // Gentle breathing float
        modelPivotRef.current.position.y = Math.sin(elapsedTime * 1.4) * 0.025;
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
      envTexture.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [product, updateCameraResponsive, compact]);


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
    </div>
  );
}
