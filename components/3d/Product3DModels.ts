import * as THREE from 'three';
import { Product } from '@/lib/store';

export interface ModelBuildResult {
  group: THREE.Group;
  flameLights: THREE.PointLight[];
  particleColor: number;
}

// ---------------------------------------------------------------------------
// Helpers & Shared Materials
// ---------------------------------------------------------------------------

function createGoldMaterial(color = 0xbba58e, roughness = 0.14, metalness = 0.98) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness,
    clearcoat: 0.75,
    clearcoatRoughness: 0.08,
    reflectivity: 0.98,
    envMapIntensity: 1.6,
  });
}

function createGlassMaterial(color = 0xffffff, transmission = 0.96, roughness = 0.02, ior = 1.54) {
  return new THREE.MeshPhysicalMaterial({
    color,
    transmission,
    opacity: 1,
    transparent: true,
    roughness,
    ior,
    thickness: 1.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 0.98,
    attenuationColor: new THREE.Color(0xfbfbfb),
    attenuationDistance: 2.2,
    specularIntensity: 1.0,
    specularColor: new THREE.Color(0xffffff),
    envMapIntensity: 1.5,
  });
}

function createWaxMaterial(color = 0xfaf4ec, roughness = 0.38) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness: 0.02,
    transmission: 0.16,
    thickness: 0.85,
    ior: 1.45,
    sheen: 0.55,
    sheenRoughness: 0.35,
    sheenColor: new THREE.Color(0xfff3e0),
    envMapIntensity: 0.7,
  });
}

function createFlameGroup(): { flameMesh: THREE.Mesh; flameLight: THREE.PointLight } {
  const flameGroup = new THREE.Group();

  // Outer golden flame cone
  const flameGeo = new THREE.ConeGeometry(0.065, 0.28, 20);
  flameGeo.translate(0, 0.14, 0);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xffa028,
    transparent: true,
    opacity: 0.92,
  });
  const outerMesh = new THREE.Mesh(flameGeo, flameMat);
  flameGroup.add(outerMesh);

  // Inner white-hot core
  const innerFlameGeo = new THREE.ConeGeometry(0.032, 0.18, 16);
  innerFlameGeo.translate(0, 0.09, 0);
  const innerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xfffae0,
    transparent: true,
    opacity: 0.95,
  });
  const innerMesh = new THREE.Mesh(innerFlameGeo, innerFlameMat);
  flameGroup.add(innerMesh);

  // Subtle blue combustion teardrop base
  const blueGeo = new THREE.SphereGeometry(0.036, 12, 12);
  blueGeo.scale(1, 0.65, 1);
  const blueMat = new THREE.MeshBasicMaterial({
    color: 0x2563eb,
    transparent: true,
    opacity: 0.75,
  });
  const blueMesh = new THREE.Mesh(blueGeo, blueMat);
  blueMesh.position.y = 0.025;
  flameGroup.add(blueMesh);

  // Dynamic warm point light
  const flameLight = new THREE.PointLight(0xff9e2e, 2.4, 4.5);
  flameLight.position.set(0, 0.18, 0);
  flameGroup.add(flameLight);

  return { flameMesh: flameGroup as unknown as THREE.Mesh, flameLight };
}

// Generate front canvas emblem (1024x1024 high-res)
function createLabelTexture(product: Product, subtitleOverride?: string): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background plaque
  ctx.fillStyle = '#100f0e';
  ctx.fillRect(0, 0, 1024, 1024);

  // Outer Gold Border
  ctx.strokeStyle = '#BBA58E';
  ctx.lineWidth = 18;
  ctx.strokeRect(44, 44, 936, 936);

  // Inner fine border
  ctx.strokeStyle = 'rgba(223, 171, 114, 0.55)';
  ctx.lineWidth = 5;
  ctx.strokeRect(72, 72, 880, 880);

  // Corner Stars
  ctx.fillStyle = '#BBA58E';
  ctx.font = '40px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', 100, 118);
  ctx.fillText('✦', 924, 118);
  ctx.fillText('✦', 100, 940);
  ctx.fillText('✦', 924, 940);

  // Brand Name
  ctx.fillStyle = '#BBA58E';
  ctx.font = 'bold 64px "Times New Roman", serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('NOOR-E-FLAMES', 512, 310);

  // Divider
  ctx.strokeStyle = '#BBA58E';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(240, 380);
  ctx.lineTo(784, 380);
  ctx.stroke();

  // Product Title (wrapped if long)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
  const words = product.title.split(' ');
  if (words.length > 3) {
    ctx.fillText(words.slice(0, 3).join(' ').toUpperCase(), 512, 490);
    ctx.fillText(words.slice(3).join(' ').toUpperCase(), 512, 560);
  } else {
    ctx.fillText(product.title.toUpperCase(), 512, 520);
  }

  // Subtitle / Notes
  ctx.fillStyle = '#BBA58E';
  ctx.font = '600 34px -apple-system, BlinkMacSystemFont, sans-serif';
  const sub = subtitleOverride || product.subtitle || 'ARTISANAL EDITION';
  const subText = sub.length > 36 ? sub.slice(0, 36) + '...' : sub;
  ctx.fillText(subText.toUpperCase(), 512, 690);

  // Bottom Volume & Heritage
  ctx.fillStyle = '#8e8b85';
  ctx.font = '28px -apple-system, BlinkMacSystemFont, sans-serif';
  const vol = product.volume || 'HAUTE CREATION · HANDCRAFTED';
  ctx.fillText(vol.toUpperCase(), 512, 790);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 16;
  return texture;
}

// ---------------------------------------------------------------------------
// 1. Cutting Chai Candle (prod-2)
// Fluted Indian cutting chai glass, milk-tea wax, wax Parle-G biscuit, flame
// ---------------------------------------------------------------------------
function buildChaiCandle(product: Product): ModelBuildResult {
  const group = new THREE.Group();
  const flameLights: THREE.PointLight[] = [];

  // Authentic Flared Tapered Chai Glass Tumbler
  const glassGeo = new THREE.CylinderGeometry(0.92, 0.68, 2.0, 36, 1, true);
  const glassMat = createGlassMaterial(0xffffff, 0.88, 0.08, 1.48);
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  group.add(glassMesh);

  // Heavy glass bottom base
  const baseGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.28, 36);
  const baseMat = createGlassMaterial(0xf4efe6, 0.82, 0.1, 1.5);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.92;
  group.add(baseMesh);

  // Fluted glass vertical ridges (Chai glass signature)
  const ridgeCount = 12;
  for (let i = 0; i < ridgeCount; i++) {
    const angle = (i / ridgeCount) * Math.PI * 2;
    const ridgeGeo = new THREE.CylinderGeometry(0.015, 0.012, 1.95, 8);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, glassMat);
    const r = 0.79;
    ridgeMesh.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
    group.add(ridgeMesh);
  }

  // Spiced Milk-Tea (Karak Chai) Colored Wax
  const waxGeo = new THREE.CylinderGeometry(0.88, 0.66, 1.65, 36);
  const waxMat = createWaxMaterial(0xc88f55, 0.38);
  const waxMesh = new THREE.Mesh(waxGeo, waxMat);
  waxMesh.position.y = -0.12;
  group.add(waxMesh);

  // Handcrafted Wax Chai Biscuit (Parle-G style) resting on the wax
  const biscuitGeo = new THREE.BoxGeometry(0.62, 0.09, 0.38);
  const biscuitMat = new THREE.MeshStandardMaterial({
    color: 0xdf9f52, // Golden baked biscuit
    roughness: 0.85,
  });
  const biscuitMesh = new THREE.Mesh(biscuitGeo, biscuitMat);
  biscuitMesh.position.set(0.24, 0.74, 0.18);
  biscuitMesh.rotation.set(0.12, 0.3, -0.15);
  group.add(biscuitMesh);

  // Wooden Wick
  const wickGeo = new THREE.BoxGeometry(0.04, 0.32, 0.14);
  const wickMat = new THREE.MeshStandardMaterial({ color: 0x24180f, roughness: 0.95 });
  const wickMesh = new THREE.Mesh(wickGeo, wickMat);
  wickMesh.position.set(-0.18, 0.82, -0.08);
  group.add(wickMesh);

  // Dynamic Flame
  const { flameMesh, flameLight } = createFlameGroup();
  flameMesh.position.set(-0.18, 0.98, -0.08);
  group.add(flameMesh);
  flameLights.push(flameLight);

  return { group, flameLights, particleColor: 0xdf9f52 };
}

// ---------------------------------------------------------------------------
// 2. Dessert Coupe Candle (prod-3: Mango Berry Bliss Coupe)
// Stemmed crystal coupe goblet, whipped vanilla cream wax, mango cubes, strawberries
// ---------------------------------------------------------------------------
function buildDessertCoupe(product: Product): ModelBuildResult {
  const group = new THREE.Group();
  const flameLights: THREE.PointLight[] = [];

  // Pedestal Foot Base
  const footGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.12, 32);
  const glassMat = createGlassMaterial(0xffffff, 0.9, 0.05, 1.52);
  const footMesh = new THREE.Mesh(footGeo, glassMat);
  footMesh.position.y = -1.1;
  group.add(footMesh);

  // Slender Stem
  const stemGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.7, 16);
  const stemMesh = new THREE.Mesh(stemGeo, glassMat);
  stemMesh.position.y = -0.7;
  group.add(stemMesh);

  // Coupe Bowl
  const bowlGeo = new THREE.CylinderGeometry(1.15, 0.42, 0.95, 36, 1, true);
  const bowlMesh = new THREE.Mesh(bowlGeo, glassMat);
  bowlMesh.position.y = 0.05;
  group.add(bowlMesh);

  // Bowl Bottom Plinth
  const bowlBaseGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 32);
  const bowlBaseMesh = new THREE.Mesh(bowlBaseGeo, glassMat);
  bowlBaseMesh.position.y = -0.42;
  group.add(bowlBaseMesh);

  // Creamy Custard Base Wax
  const baseWaxGeo = new THREE.CylinderGeometry(1.08, 0.4, 0.75, 32);
  const baseWaxMat = new THREE.MeshStandardMaterial({
    color: 0xfff5dd, // Sweet vanilla custard
    roughness: 0.38,
  });
  const baseWaxMesh = new THREE.Mesh(baseWaxGeo, baseWaxMat);
  baseWaxMesh.position.y = -0.04;
  group.add(baseWaxMesh);

  // Swirled Whipped Cream Wax Mound
  const creamGeo = new THREE.SphereGeometry(0.85, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.48);
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Pure whipped cream
    roughness: 0.5,
  });
  const creamMesh = new THREE.Mesh(creamGeo, creamMat);
  creamMesh.position.y = 0.32;
  group.add(creamMesh);

  // Artisanal Mango Cubes (bright golden Alphonso mango wax)
  const mangoMat = new THREE.MeshStandardMaterial({
    color: 0xfcb024,
    roughness: 0.35,
  });
  const mango1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.24), mangoMat);
  mango1.position.set(0.38, 0.52, 0.25);
  mango1.rotation.set(0.2, 0.4, 0.1);
  group.add(mango1);

  const mango2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.22), mangoMat);
  mango2.position.set(-0.35, 0.48, -0.22);
  mango2.rotation.set(0.1, -0.5, 0.3);
  group.add(mango2);

  // Strawberry Wax Halves (Glossy crimson wax)
  const berryMat = new THREE.MeshStandardMaterial({
    color: 0xdf2040,
    roughness: 0.3,
  });
  const berryGeo = new THREE.ConeGeometry(0.18, 0.32, 16);
  const berry1 = new THREE.Mesh(berryGeo, berryMat);
  berry1.position.set(-0.25, 0.56, 0.3);
  berry1.rotation.set(-0.3, 0.2, -0.4);
  group.add(berry1);

  const berry2 = new THREE.Mesh(berryGeo, berryMat);
  berry2.position.set(0.32, 0.52, -0.32);
  berry2.rotation.set(0.4, -0.3, 0.2);
  group.add(berry2);

  // Central Cotton Wick
  const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.32, 12);
  const wickMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.9 });
  const wickMesh = new THREE.Mesh(wickGeo, wickMat);
  wickMesh.position.set(0, 0.68, 0);
  group.add(wickMesh);

  // Dynamic Flame
  const { flameMesh, flameLight } = createFlameGroup();
  flameMesh.position.set(0, 0.82, 0);
  group.add(flameMesh);
  flameLights.push(flameLight);

  return { group, flameLights, particleColor: 0xfcb024 };
}

// ---------------------------------------------------------------------------
// 3. Secret Message Candle (prod-1: Whispered Surprises)
// Frosted jar with gold rim, golden soy wax, embedded glowing secret message heart
// ---------------------------------------------------------------------------
function buildSecretMessageCandle(product: Product): ModelBuildResult {
  const group = new THREE.Group();
  const flameLights: THREE.PointLight[] = [];

  // Frosted Matte Glass Jar
  const jarGeo = new THREE.CylinderGeometry(0.96, 0.92, 2.1, 48, 1, true);
  const jarMat = new THREE.MeshPhysicalMaterial({
    color: 0x221f1c,
    transmission: 0.65,
    opacity: 0.95,
    transparent: true,
    roughness: 0.35,
    ior: 1.48,
  });
  const jarMesh = new THREE.Mesh(jarGeo, jarMat);
  group.add(jarMesh);

  // Solid Bottom
  const baseGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.18, 48);
  const baseMesh = new THREE.Mesh(baseGeo, jarMat);
  baseMesh.position.y = -1.0;
  group.add(baseMesh);

  // Gold Rim Ring
  const rimGeo = new THREE.TorusGeometry(0.96, 0.035, 16, 48);
  const goldMat = createGoldMaterial(0xbba58e, 0.2, 0.95);
  const rimMesh = new THREE.Mesh(rimGeo, goldMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 1.05;
  group.add(rimMesh);

  // Golden Soy Wax
  const waxGeo = new THREE.CylinderGeometry(0.94, 0.9, 1.78, 48);
  const waxMat = createWaxMaterial(0xfaf3e8, 0.42);
  const waxMesh = new THREE.Mesh(waxGeo, waxMat);
  waxMesh.position.y = -0.12;
  group.add(waxMesh);

  // Embossed Golden "Secret Love Note" Medallion embedded in wax
  const medallionGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.04, 32);
  const medallionMat = new THREE.MeshStandardMaterial({
    color: 0xbba58e,
    metalness: 0.9,
    roughness: 0.25,
  });
  const medallionMesh = new THREE.Mesh(medallionGeo, medallionMat);
  medallionMesh.position.set(0.18, 0.77, 0.12);
  group.add(medallionMesh);

  // Organic Crackling Wooden Wick
  const wickGeo = new THREE.BoxGeometry(0.04, 0.35, 0.22);
  const wickMat = new THREE.MeshStandardMaterial({ color: 0x221810, roughness: 0.95 });
  const wickMesh = new THREE.Mesh(wickGeo, wickMat);
  wickMesh.position.set(-0.12, 0.88, -0.06);
  group.add(wickMesh);

  // Dynamic Flame
  const { flameMesh, flameLight } = createFlameGroup();
  flameMesh.position.set(-0.12, 1.05, -0.06);
  group.add(flameMesh);
  flameLights.push(flameLight);

  // Front Gold Foil Emblem Label
  const labelTexture = createLabelTexture(product, 'SECRET MESSAGE MELTS INTO VIEW');
  if (labelTexture) {
    const labelGeo = new THREE.PlaneGeometry(0.9, 0.9);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      transparent: true,
      roughness: 0.3,
      metalness: 0.4,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(0, -0.15, 0.96);
    group.add(labelMesh);
  }

  return { group, flameLights, particleColor: 0xbba58e };
}

// ---------------------------------------------------------------------------
// 4. Rose Bear & Velvet Heart Duo (prod-4)
// Sculpted pastel pink rose bear + crimson velvet heart candle
// ---------------------------------------------------------------------------
function buildRoseBearCandle(product: Product): ModelBuildResult {
  const group = new THREE.Group();
  const flameLights: THREE.PointLight[] = [];

  const pinkWaxMat = new THREE.MeshStandardMaterial({
    color: 0xf492b4, // Pastel blush rose wax
    roughness: 0.65,
  });

  // Bear Body Group
  const bearGroup = new THREE.Group();
  bearGroup.position.set(-0.35, -0.2, 0);

  // Body
  const bodyGeo = new THREE.SphereGeometry(0.62, 24, 20);
  const bodyMesh = new THREE.Mesh(bodyGeo, pinkWaxMat);
  bodyMesh.position.y = -0.2;
  bearGroup.add(bodyMesh);

  // Head
  const headGeo = new THREE.SphereGeometry(0.46, 24, 20);
  const headMesh = new THREE.Mesh(headGeo, pinkWaxMat);
  headMesh.position.y = 0.48;
  bearGroup.add(headMesh);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.16, 16, 16);
  const leftEar = new THREE.Mesh(earGeo, pinkWaxMat);
  leftEar.position.set(-0.35, 0.82, 0.05);
  bearGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, pinkWaxMat);
  rightEar.position.set(0.35, 0.82, 0.05);
  bearGroup.add(rightEar);

  // Snout
  const snoutGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const snoutMesh = new THREE.Mesh(snoutGeo, pinkWaxMat);
  snoutMesh.position.set(0, 0.44, 0.4);
  bearGroup.add(snoutMesh);

  // Bear Wick & Flame
  const bearWick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.28, 12),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f })
  );
  bearWick.position.set(0, 0.98, 0);
  bearGroup.add(bearWick);

  const { flameMesh: bearFlame, flameLight: bearLight } = createFlameGroup();
  bearFlame.position.set(0, 1.1, 0);
  bearGroup.add(bearFlame);
  flameLights.push(bearLight);

  group.add(bearGroup);

  // Companion Sculpted Velvet Heart Candle
  const heartGroup = new THREE.Group();
  heartGroup.position.set(0.55, -0.35, 0.15);

  const heartMat = new THREE.MeshStandardMaterial({
    color: 0xba133a, // Deep romantic crimson velvet
    roughness: 0.55,
  });

  const heartL = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 20), heartMat);
  heartL.position.set(-0.2, 0.2, 0);
  heartGroup.add(heartL);

  const heartR = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 20), heartMat);
  heartR.position.set(0.2, 0.2, 0);
  heartGroup.add(heartR);

  const heartBottom = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.72, 24), heartMat);
  heartBottom.rotation.z = Math.PI;
  heartBottom.position.set(0, -0.15, 0);
  heartGroup.add(heartBottom);

  // Heart Wick & Flame
  const heartWick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.25, 12),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f })
  );
  heartWick.position.set(0, 0.5, 0);
  heartGroup.add(heartWick);

  const { flameMesh: heartFlame, flameLight: heartLight } = createFlameGroup();
  heartFlame.position.set(0, 0.62, 0);
  heartGroup.add(heartFlame);
  flameLights.push(heartLight);

  group.add(heartGroup);

  return { group, flameLights, particleColor: 0xf472b6 };
}

// ---------------------------------------------------------------------------
// 5. Pastry / Cupcake Candles (prod-5: Strawberry Shortcake, prod-8: Chocolate Romance)
// ---------------------------------------------------------------------------
function buildPastryCandle(product: Product): ModelBuildResult {
  const group = new THREE.Group();
  const flameLights: THREE.PointLight[] = [];

  const isChocolate = product.id === 'prod-8' || product.title.toLowerCase().includes('chocolate');

  // Pastry / Cupcake Base
  const baseGeo = new THREE.CylinderGeometry(0.85, 0.68, 0.85, 24);
  const baseMat = new THREE.MeshStandardMaterial({
    color: isChocolate ? 0x422006 : 0xd89b52, // Chocolate vs golden pastry
    roughness: 0.7,
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.55;
  group.add(baseMesh);

  // Whipped Swirl Frosting
  const swirlMat = new THREE.MeshStandardMaterial({
    color: isChocolate ? 0x6e3612 : 0xfffbed,
    roughness: 0.45,
  });
  const tier1 = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.22, 16, 32), swirlMat);
  tier1.rotation.x = Math.PI / 2;
  tier1.position.y = -0.05;
  group.add(tier1);

  const tier2 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.18, 16, 32), swirlMat);
  tier2.rotation.x = Math.PI / 2;
  tier2.position.y = 0.25;
  group.add(tier2);

  const topPeak = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.4, 20), swirlMat);
  topPeak.position.y = 0.55;
  group.add(topPeak);

  // Topper: Strawberry or Velvet Heart
  const topperMat = new THREE.MeshStandardMaterial({
    color: 0xdf1640,
    roughness: 0.35,
  });
  const topperGeo = new THREE.ConeGeometry(0.18, 0.32, 16);
  const topperMesh = new THREE.Mesh(topperGeo, topperMat);
  topperMesh.position.set(0.18, 0.7, 0.12);
  topperMesh.rotation.set(-0.2, 0.3, -0.3);
  group.add(topperMesh);

  // Wick & Flame
  const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.32, 12);
  const wickMesh = new THREE.Mesh(wickGeo, new THREE.MeshStandardMaterial({ color: 0x1f1f1f }));
  wickMesh.position.set(0, 0.85, 0);
  group.add(wickMesh);

  const { flameMesh, flameLight } = createFlameGroup();
  flameMesh.position.set(0, 0.98, 0);
  group.add(flameMesh);
  flameLights.push(flameLight);

  return { group, flameLights, particleColor: isChocolate ? 0xc87d3d : 0xdf1640 };
}

// ---------------------------------------------------------------------------
// 6. Teddy & Balloon Soy Candle (prod-7)
// Ribbed pastel ceramic tumbler, sculpted teddy bear on wax holding balloon
// ---------------------------------------------------------------------------
function buildTeddyBalloonCandle(product: Product): ModelBuildResult {
  const group = new THREE.Group();
  const flameLights: THREE.PointLight[] = [];

  // Ribbed Ceramic Tumbler
  const jarGeo = new THREE.CylinderGeometry(0.92, 0.88, 1.8, 36);
  const jarMat = new THREE.MeshStandardMaterial({
    color: 0xf0e7db,
    roughness: 0.65,
  });
  const jarMesh = new THREE.Mesh(jarGeo, jarMat);
  jarMesh.position.y = -0.35;
  group.add(jarMesh);

  // Soy Wax
  const waxGeo = new THREE.CylinderGeometry(0.88, 0.86, 1.5, 36);
  const waxMat = createWaxMaterial(0xfbf6ec);
  const waxMesh = new THREE.Mesh(waxGeo, waxMat);
  waxMesh.position.y = -0.22;
  group.add(waxMesh);

  // Miniature Sculpted Teddy Bear on Wax
  const bearMat = new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.8 });
  const bearBody = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), bearMat);
  bearBody.position.set(-0.15, 0.72, 0);
  group.add(bearBody);

  const bearHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), bearMat);
  bearHead.position.set(-0.15, 1.05, 0);
  group.add(bearHead);

  // Heart Balloon Candle (The Wick)
  const balloonMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
  const balloonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), balloonMat);
  balloonMesh.position.set(0.32, 1.25, 0.05);
  group.add(balloonMesh);

  // Balloon String / Wick
  const stringGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
  const stringMesh = new THREE.Mesh(stringGeo, new THREE.MeshStandardMaterial({ color: 0xbba58e }));
  stringMesh.position.set(0.25, 0.85, 0.05);
  group.add(stringMesh);

  // Dynamic Flame on Balloon
  const { flameMesh, flameLight } = createFlameGroup();
  flameMesh.position.set(0.32, 1.55, 0.05);
  group.add(flameMesh);
  flameLights.push(flameLight);

  return { group, flameLights, particleColor: 0xec4899 };
}

// ---------------------------------------------------------------------------
// 7. Signature Luxe Arch Gift Box (prod-6)
// Arch-top presentation box with gold arch handle and royal crest
// ---------------------------------------------------------------------------
function buildLuxeArchGiftBox(product: Product): ModelBuildResult {
  const group = new THREE.Group();

  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x0f2722, // Noor-E-Flames Royal Forest Green
    roughness: 0.35,
    metalness: 0.15,
  });

  const goldMat = createGoldMaterial(0xbba58e, 0.18, 0.95);

  // Main Rectangular Box Body
  const bodyGeo = new THREE.BoxGeometry(1.6, 1.8, 0.9);
  const bodyMesh = new THREE.Mesh(bodyGeo, boxMat);
  bodyMesh.position.y = -0.2;
  group.add(bodyMesh);

  // Curved Arch Top Dome
  const archGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.6, 32, 1, false, 0, Math.PI);
  const archMesh = new THREE.Mesh(archGeo, boxMat);
  archMesh.rotation.z = Math.PI / 2;
  archMesh.position.set(0, 0.7, 0);
  group.add(archMesh);

  // Gold Edge Trims
  const trimGeo = new THREE.BoxGeometry(1.64, 0.06, 0.94);
  const trimMesh = new THREE.Mesh(trimGeo, goldMat);
  trimMesh.position.y = 0.7;
  group.add(trimMesh);

  // Polished Gold Arch Carry Handle
  const handleGeo = new THREE.TorusGeometry(0.35, 0.04, 16, 32, Math.PI);
  const handleMesh = new THREE.Mesh(handleGeo, goldMat);
  handleMesh.position.set(0, 1.15, 0);
  group.add(handleMesh);

  // Embossed Front Gold Medallion Crest
  const crestGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.04, 32);
  const crestMesh = new THREE.Mesh(crestGeo, goldMat);
  crestMesh.rotation.x = Math.PI / 2;
  crestMesh.position.set(0, 0.1, 0.47);
  group.add(crestMesh);

  return { group, flameLights: [], particleColor: 0xbba58e };
}

// ---------------------------------------------------------------------------
// 8. Pure Concentrated Attar (prod-11, prod-13, prod-16)
// Octagonal crystal flacon, gold dome cap, crystal dip wand, concentrated oils
// ---------------------------------------------------------------------------
function buildAttarFlacon(product: Product): ModelBuildResult {
  const group = new THREE.Group();

  // Oil tint based on specific attar
  let oilColor = 0xbba58e;
  let particleColor = 0xbba58e;

  if (product.id === 'prod-11' || product.title.toLowerCase().includes('citrus')) {
    oilColor = 0x9bc238; // Fresh sunlit lime-gold
    particleColor = 0xa3e635;
  } else if (product.id === 'prod-13' || product.title.toLowerCase().includes('jasmine')) {
    oilColor = 0xe5a92a; // Wild jasmine gold nectar
    particleColor = 0xfacc15;
  } else if (product.id === 'prod-16' || product.title.toLowerCase().includes('amber')) {
    oilColor = 0x8b3e10; // Dark resinous Amber Noir
    particleColor = 0xf59e0b;
  }

  // Octagonal Crystal Outer Flacon (heavy beveled 8-sided crystal)
  const glassGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.6, 8);
  const glassMat = createGlassMaterial(0xffffff, 0.92, 0.04, 1.54);
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.y = -0.3;
  group.add(glassMesh);

  // Heavy Solid Crystal Base
  const baseGeo = new THREE.CylinderGeometry(0.74, 0.76, 0.28, 8);
  const baseMesh = new THREE.Mesh(baseGeo, glassMat);
  baseMesh.position.y = -1.15;
  group.add(baseMesh);

  // Concentrated Botanical Oil Core (8-sided)
  const oilGeo = new THREE.CylinderGeometry(0.58, 0.58, 1.35, 8);
  const oilMat = new THREE.MeshPhysicalMaterial({
    color: oilColor,
    transmission: 0.78,
    opacity: 1,
    transparent: true,
    roughness: 0.05,
    ior: 1.42,
    thickness: 1.1,
    attenuationColor: new THREE.Color(oilColor),
    attenuationDistance: 0.7,
    reflectivity: 0.9,
    envMapIntensity: 1.4,
  });
  const oilMesh = new THREE.Mesh(oilGeo, oilMat);
  oilMesh.position.y = -0.35;
  group.add(oilMesh);

  // Traditional Mughal Gold Dome Cap
  const goldMat = createGoldMaterial(0xbba58e, 0.16, 0.96);

  // Collar
  const collarGeo = new THREE.CylinderGeometry(0.36, 0.42, 0.28, 24);
  const collarMesh = new THREE.Mesh(collarGeo, goldMat);
  collarMesh.position.y = 0.62;
  group.add(collarMesh);

  // Mughal Dome Cap
  const domeGeo = new THREE.SphereGeometry(0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52);
  const domeMesh = new THREE.Mesh(domeGeo, goldMat);
  domeMesh.position.y = 0.76;
  group.add(domeMesh);

  // Pointed Finial Crown Tip
  const tipGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
  const tipMesh = new THREE.Mesh(tipGeo, goldMat);
  tipMesh.position.y = 1.25;
  group.add(tipMesh);

  // Interior Crystal Applicator Wand visible through glass
  const wandGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12);
  const wandMat = createGlassMaterial(0xffffff, 0.88, 0.1, 1.5);
  const wandMesh = new THREE.Mesh(wandGeo, wandMat);
  wandMesh.position.y = -0.15;
  group.add(wandMesh);

  // Front Filigree Gold Label
  const labelTexture = createLabelTexture(product, '100% PURE ALCOHOL-FREE ATTAR');
  if (labelTexture) {
    const labelGeo = new THREE.PlaneGeometry(0.72, 0.72);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      transparent: true,
      roughness: 0.3,
      metalness: 0.5,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(0, -0.32, 0.74);
    group.add(labelMesh);
  }

  return { group, flameLights: [], particleColor };
}

// ---------------------------------------------------------------------------
// 9. Haute Extrait de Parfum (prod-9, prod-10, prod-12, prod-14, prod-15)
// Luxury beveled crystal flacon, signature liquid tint, magnetic gold cap, plaque
// ---------------------------------------------------------------------------
function buildExtraitFlacon(product: Product): ModelBuildResult {
  const group = new THREE.Group();

  // Determine liquid & theme tint
  let liquidColor = 0xbba58e;
  let capColor = 0xbba58e;
  let particleColor = 0xbba58e;
  const title = product.title.toLowerCase();
  const cat = product.category || '';

  if (product.id === 'prod-9' || title.includes('oceanic') || cat === 'ocean-fresh') {
    liquidColor = 0x188aa6; // Mediterranean Azure Ocean
    particleColor = 0x67e8f9;
  } else if (product.id === 'prod-10' || title.includes('aqua noir')) {
    liquidColor = 0x0c1e32; // Midnight Smoky Marine Navy
    capColor = 0x948472; // Smoked bronze
    particleColor = 0x94a3b8;
  } else if (product.id === 'prod-12' || title.includes('rose') || cat === 'floral-rose') {
    liquidColor = 0xa31e42; // Damascena Crimson Rose
    particleColor = 0xf472b6;
  } else if (product.id === 'prod-14' || title.includes('smokey oud')) {
    liquidColor = 0x69320d; // Smoked Cognac Oud
    capColor = 0xcaa066;
    particleColor = 0xf59e0b;
  } else if (product.id === 'prod-15' || title.includes('tobacco')) {
    liquidColor = 0xb46b1c; // Spiced Honey Tobacco Amber
    particleColor = 0xfbbf24;
  }

  // 1. Crystal Outer Flacon (Heavy beveled cylindrical/oval silhouette)
  const bottleGeo = new THREE.CylinderGeometry(0.85, 0.88, 1.9, 48, 1);
  const bottleMat = createGlassMaterial(0xffffff, 0.96, 0.02, 1.54);
  const bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
  bottleMesh.position.y = -0.2;
  bottleMesh.castShadow = true;
  group.add(bottleMesh);

  // 2. Heavy Solid Crystal Base Plinth
  const plinthGeo = new THREE.CylinderGeometry(0.88, 0.9, 0.35, 48);
  const plinthMat = createGlassMaterial(0xffffff, 0.93, 0.03, 1.56);
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.position.y = -1.2;
  group.add(plinthMesh);

  // 3. Inner Fragrance Liquid Core
  const liquidGeo = new THREE.CylinderGeometry(0.74, 0.76, 1.45, 36);
  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: liquidColor,
    transmission: 0.82,
    opacity: 1,
    transparent: true,
    roughness: 0.04,
    ior: 1.4,
    thickness: 1.15,
    attenuationColor: new THREE.Color(liquidColor),
    attenuationDistance: 0.75,
    reflectivity: 0.92,
    envMapIntensity: 1.4,
  });
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.y = -0.32;
  group.add(liquidMesh);

  // 3b. Sprayer Dip Tube inside Liquid
  const dipTubeGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.55, 12);
  const dipTubeMat = createGlassMaterial(0xffffff, 0.9, 0.08, 1.48);
  const dipTube = new THREE.Mesh(dipTubeGeo, dipTubeMat);
  dipTube.position.set(0, -0.18, 0);
  group.add(dipTube);

  // 4. Gold Collar & Neck
  const goldMat = createGoldMaterial(capColor, 0.14, 0.98);

  const neckGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.32, 32);
  const neckMesh = new THREE.Mesh(neckGeo, goldMat);
  neckMesh.position.y = 0.85;
  group.add(neckMesh);

  // 5. Sprayer Atomizer
  const atomizerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.22, 24);
  const atomizerMesh = new THREE.Mesh(atomizerGeo, goldMat);
  atomizerMesh.position.y = 1.05;
  group.add(atomizerMesh);

  // 6. Luxury Magnetic Cap
  const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.82, 32);
  const capMesh = new THREE.Mesh(capGeo, goldMat);
  capMesh.position.y = 1.35;
  capMesh.castShadow = true;
  group.add(capMesh);

  // Cap Crown Knurl Ring
  const capCrownGeo = new THREE.CylinderGeometry(0.49, 0.49, 0.08, 32);
  const crownMesh = new THREE.Mesh(capCrownGeo, goldMat);
  crownMesh.position.y = 1.76;
  group.add(crownMesh);

  // 7. Front Gold & Obsidian Plaque Label
  const labelTexture = createLabelTexture(product);
  if (labelTexture) {
    const labelGeo = new THREE.PlaneGeometry(1.0, 1.0);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.2,
      metalness: 0.55,
      transparent: true,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(0, -0.22, 0.86);
    group.add(labelMesh);
  }

  return { group, flameLights: [], particleColor };
}

// ---------------------------------------------------------------------------
// Main Product Model Factory Dispatcher
// ---------------------------------------------------------------------------
export function buildProduct3DModel(product: Product): ModelBuildResult {
  const id = product.id;
  const title = product.title.toLowerCase();
  const cat = product.category || '';

  // 1. Chai Candle
  if (id === 'prod-2' || title.includes('chai')) {
    return buildChaiCandle(product);
  }

  // 2. Dessert Coupe Candle
  if (id === 'prod-3' || title.includes('coupe') || title.includes('dessert')) {
    return buildDessertCoupe(product);
  }

  // 3. Secret Message Candle
  if (id === 'prod-1' || title.includes('whispered') || title.includes('secret message')) {
    return buildSecretMessageCandle(product);
  }

  // 4. Rose Bear Duo Candle
  if (id === 'prod-4' || title.includes('bear & velvet heart')) {
    return buildRoseBearCandle(product);
  }

  // 5. Pastry / Cupcake Candles
  if (id === 'prod-5' || id === 'prod-8' || title.includes('shortcake') || title.includes('cupcake')) {
    return buildPastryCandle(product);
  }

  // 6. Teddy & Balloon Candle
  if (id === 'prod-7' || title.includes('balloon')) {
    return buildTeddyBalloonCandle(product);
  }

  // 7. Luxe Arch Gift Box
  if (id === 'prod-6' || title.includes('arch gift box')) {
    return buildLuxeArchGiftBox(product);
  }

  // 8. Pure Attars
  if (
    id === 'prod-11' ||
    id === 'prod-13' ||
    id === 'prod-16' ||
    title.includes('attar') ||
    product.volume?.toLowerCase().includes('attar')
  ) {
    return buildAttarFlacon(product);
  }

  // 9. Standard Soy Candles fallback
  if (cat === 'candles') {
    return buildSecretMessageCandle(product);
  }

  // 10. Default: Haute Extrait de Parfum
  return buildExtraitFlacon(product);
}
