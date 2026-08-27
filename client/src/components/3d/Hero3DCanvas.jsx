import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, Eye, RotateCw, Sparkles, Sun, Layers } from 'lucide-react';

const PAINT_COLORS = [
  { name: 'Monaco Blue', value: 0x0284c7, hex: '#0284c7' },
  { name: 'Rosso Corsa', value: 0xdc2626, hex: '#dc2626' },
  { name: 'Glacier White', value: 0xf8fafc, hex: '#f8fafc' },
  { name: 'Nero Obsidian', value: 0x18181b, hex: '#18181b' },
  { name: 'Grigio Silver', value: 0x94a3b8, hex: '#94a3b8' },
  { name: 'Sunset Amber', value: 0xf59e0b, hex: '#f59e0b' },
  { name: 'British Racing Green', value: 0x059669, hex: '#059669' },
];

const CAMERA_PRESETS = [
  { name: '3/4 Studio', pos: [4.2, 2.0, 4.8], look: [0, 0.4, 0] },
  { name: 'Front', pos: [0, 1.4, 5.8], look: [0, 0.4, 0] },
  { name: 'Side Profile', pos: [5.8, 1.2, 0], look: [0, 0.4, 0] },
  { name: 'Rear Aero', pos: [-3.8, 1.8, -4.5], look: [0, 0.4, 0] },
];

const Hero3DCanvas = ({ className = '' }) => {
  const mountRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0]);
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [activePreset, setActivePreset] = useState(0);

  const carBodyMatRef = useRef(null);
  const headlightsMatRef = useRef(null);
  const taillightsMatRef = useRef(null);
  const carGroupRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const targetCamPosRef = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].pos));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(...CAMERA_PRESETS[0].pos);
    camera.lookAt(0, 0.35, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup (Clean, Crisp Antialiased WebGL)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting (High-end Showroom Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Overhead Key Light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Soft Rim Light from opposite side
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    fillLight.position.set(-6, 8, -6);
    scene.add(fillLight);

    // Studio Accent Point Lights
    const cyanStudioLight = new THREE.PointLight(0x0ea5e9, 2.5, 12);
    cyanStudioLight.position.set(3, 2.5, 3);
    scene.add(cyanStudioLight);

    const softWarmLight = new THREE.PointLight(0x6366f1, 2, 12);
    softWarmLight.position.set(-3, 2, 2);
    scene.add(softWarmLight);

    // 5. Polished White Luxury Studio Turntable Floor
    const floorGeo = new THREE.CylinderGeometry(5.2, 5.4, 0.12, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.06;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle Radial Studio Grid Ring
    const ringGeo = new THREE.RingGeometry(2.5, 5.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // Outer Turntable Edge Ring
    const outerRingGeo = new THREE.RingGeometry(5.15, 5.25, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.006;
    scene.add(outerRing);

    // 6. Construct Aerodynamic Supercar Model
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // --- High-End Materials ---
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: selectedColor.value,
      metalness: 0.82,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      wireframe: isWireframe,
    });
    carBodyMatRef.current = bodyMat;

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.6,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.75,
      transparent: true,
      opacity: 0.8,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.95,
      roughness: 0.08,
    });

    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.7,
      roughness: 0.2,
    });

    const headlightMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    headlightsMatRef.current = headlightMat;

    const taillightMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
    });
    taillightsMatRef.current = taillightMat;

    // --- Supercar Geometry Components ---

    // A. Main Lower Tub / Chassis
    const lowerBodyGeo = new THREE.BoxGeometry(1.82, 0.32, 4.1);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
    lowerBody.position.y = 0.38;
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    // Front Aerodynamic Nose
    const noseGeo = new THREE.CylinderGeometry(0.85, 0.92, 1.2, 32);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.rotation.x = Math.PI / 2;
    nose.scale.set(1, 0.32, 0.45);
    nose.position.set(0, 0.34, 1.95);
    nose.castShadow = true;
    carGroup.add(nose);

    // Front Carbon Fiber Splitter
    const splitterGeo = new THREE.BoxGeometry(1.88, 0.05, 0.6);
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(0, 0.23, 2.1);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // Sculpted Hood Slope
    const hoodGeo = new THREE.BoxGeometry(1.72, 0.18, 1.5);
    const hood = new THREE.Mesh(hoodGeo, bodyMat);
    hood.position.set(0, 0.48, 1.2);
    hood.rotation.x = -0.12;
    hood.castShadow = true;
    carGroup.add(hood);

    // Cockpit / Canopy Glass Dome
    const canopyGeo = new THREE.CylinderGeometry(0.68, 0.8, 1.9, 16);
    const canopy = new THREE.Mesh(canopyGeo, glassMat);
    canopy.rotation.x = Math.PI / 2;
    canopy.scale.set(1.05, 0.48, 0.52);
    canopy.position.set(0, 0.82, -0.05);
    canopy.castShadow = true;
    carGroup.add(canopy);

    // Carbon Fiber Roof Centerline Strip
    const roofGeo = new THREE.BoxGeometry(1.22, 0.06, 1.3);
    const roof = new THREE.Mesh(roofGeo, carbonMat);
    roof.position.set(0, 1.05, -0.15);
    roof.castShadow = true;
    carGroup.add(roof);

    // Aerodynamic Side Air Scoops / Intakes
    const leftScoop = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.8), carbonMat);
    leftScoop.position.set(-0.94, 0.48, -0.5);
    carGroup.add(leftScoop);

    const rightScoop = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.8), carbonMat);
    rightScoop.position.set(0.94, 0.48, -0.5);
    carGroup.add(rightScoop);

    // Rear Engine Deck & Diffuser
    const engineDeckGeo = new THREE.BoxGeometry(1.72, 0.24, 1.4);
    const engineDeck = new THREE.Mesh(engineDeckGeo, bodyMat);
    engineDeck.position.set(0, 0.54, -1.35);
    engineDeck.rotation.x = 0.08;
    engineDeck.castShadow = true;
    carGroup.add(engineDeck);

    // Rear Carbon Diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.86, 0.12, 0.65);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
    diffuser.position.set(0, 0.26, -2.05);
    diffuser.castShadow = true;
    carGroup.add(diffuser);

    // Rear GT Aero Spoiler Wing
    const wingGeo = new THREE.BoxGeometry(1.9, 0.04, 0.38);
    const wing = new THREE.Mesh(wingGeo, carbonMat);
    wing.position.set(0, 0.88, -1.95);
    wing.rotation.x = -0.05;
    wing.castShadow = true;
    carGroup.add(wing);

    const leftStrut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.12), carbonMat);
    leftStrut.position.set(-0.65, 0.7, -1.92);
    carGroup.add(leftStrut);

    const rightStrut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.12), carbonMat);
    rightStrut.position.set(0.65, 0.7, -1.92);
    carGroup.add(rightStrut);

    // Dual Chrome Exhaust Pipes
    const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16);
    const leftExhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    leftExhaust.rotation.x = Math.PI / 2;
    leftExhaust.position.set(-0.25, 0.32, -2.12);
    carGroup.add(leftExhaust);

    const rightExhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    rightExhaust.rotation.x = Math.PI / 2;
    rightExhaust.position.set(0.25, 0.32, -2.12);
    carGroup.add(rightExhaust);

    // Futuristic LED Headlights (Blade Design)
    const leftHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.12), headlightMat);
    leftHeadlight.position.set(-0.62, 0.48, 2.02);
    leftHeadlight.rotation.y = 0.2;
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.12), headlightMat);
    rightHeadlight.position.set(0.62, 0.48, 2.02);
    rightHeadlight.rotation.y = -0.2;
    carGroup.add(rightHeadlight);

    // Continuous Rear Neon Taillight Bar
    const rearLightBar = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.06, 0.08), taillightMat);
    rearLightBar.position.set(0, 0.52, -2.06);
    carGroup.add(rearLightBar);

    // --- Multi-Spoke Wheels with Brake Calipers ---
    const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 32);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });

    const rimRingGeo = new THREE.TorusGeometry(0.26, 0.04, 16, 32);
    const brakeDiscGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.04, 24);
    const brakeDiscMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

    const createWheelAssembly = (x, z) => {
      const wheelHolder = new THREE.Group();

      // Rubber Tire
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelHolder.add(tire);

      // Outer Chrome Rim Lip
      const rimRing = new THREE.Mesh(rimRingGeo, chromeMat);
      rimRing.position.x = x > 0 ? 0.1 : -0.1;
      wheelHolder.add(rimRing);

      // Brake Rotor Disc
      const disc = new THREE.Mesh(brakeDiscGeo, brakeDiscMat);
      disc.rotation.z = Math.PI / 2;
      wheelHolder.add(disc);

      // Red Sport Brake Caliper
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.08), caliperMat);
      caliper.position.set(x > 0 ? 0.05 : -0.05, 0.14, 0);
      wheelHolder.add(caliper);

      // Multi-Spoke Center Hub
      const spokeGeo = new THREE.BoxGeometry(0.03, 0.44, 0.03);
      for (let i = 0; i < 5; i++) {
        const spoke = new THREE.Mesh(spokeGeo, chromeMat);
        spoke.rotation.x = (i * Math.PI) / 5;
        spoke.position.x = x > 0 ? 0.11 : -0.11;
        wheelHolder.add(spoke);
      }

      wheelHolder.position.set(x, 0.38, z);
      return wheelHolder;
    };

    carGroup.add(createWheelAssembly(-0.96, 1.25));
    carGroup.add(createWheelAssembly(0.96, 1.25));
    carGroup.add(createWheelAssembly(-0.96, -1.25));
    carGroup.add(createWheelAssembly(0.96, -1.25));

    // 7. Interactive Mouse Orbit / Dragging
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !carGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      carGroupRef.current.rotation.y += deltaX * 0.007;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch handlers for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || !carGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      carGroupRef.current.rotation.y += deltaX * 0.007;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Smooth Animation & Camera Interpolation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera transition towards target preset
      camera.position.lerp(targetCamPosRef.current, 0.05);
      camera.lookAt(0, 0.35, 0);

      // Gentle auto-rotation
      if (isRotating && carGroupRef.current && !isDragging) {
        carGroupRef.current.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Paint Color dynamically
  useEffect(() => {
    if (carBodyMatRef.current) {
      carBodyMatRef.current.color.setHex(selectedColor.value);
    }
  }, [selectedColor]);

  // Update Wireframe
  useEffect(() => {
    if (carBodyMatRef.current) {
      carBodyMatRef.current.wireframe = isWireframe;
    }
  }, [isWireframe]);

  // Toggle Lights
  useEffect(() => {
    if (headlightsMatRef.current) {
      headlightsMatRef.current.color.setHex(lightsOn ? 0x38bdf8 : 0x475569);
    }
    if (taillightsMatRef.current) {
      taillightsMatRef.current.color.setHex(lightsOn ? 0xef4444 : 0x475569);
    }
  }, [lightsOn]);

  // Switch Camera Preset
  const handlePresetChange = (idx) => {
    setActivePreset(idx);
    const preset = CAMERA_PRESETS[idx];
    targetCamPosRef.current.set(...preset.pos);
  };

  return (
    <div className={`relative w-full h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 shadow-xl flex flex-col justify-between ${className}`}>
      {/* Top Studio Telemetry Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-800 shadow-sm pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="font-bold text-cyan-600">3D LUXURY STUDIO</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 text-[11px]">60 FPS SHOT</span>
        </div>

        {/* Camera Angle Presets */}
        <div className="hidden sm:flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200/80 p-1 rounded-full shadow-sm pointer-events-auto">
          {CAMERA_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => handlePresetChange(idx)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                activePreset === idx
                  ? 'bg-slate-900 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Controls Toolbar (White Luxury Bottom Card) */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-3.5 rounded-2xl shadow-lg">
        {/* Paint Color Swatches */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold text-slate-700 uppercase hidden sm:inline">Paint Finish:</span>
          <div className="flex items-center gap-1.5">
            {PAINT_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                title={c.name}
                className={`w-6 h-6 rounded-full transition-all duration-200 border shadow-sm cursor-pointer ${
                  selectedColor.name === c.name
                    ? 'scale-125 border-slate-900 ring-2 ring-cyan-500/40 ring-offset-1'
                    : 'border-slate-300 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              isRotating
                ? 'bg-cyan-50 text-cyan-700 border-cyan-300 font-bold shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-Turn</span>
          </button>

          <button
            onClick={() => setLightsOn(!lightsOn)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              lightsOn
                ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>LEDs</span>
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              isWireframe
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Blueprint</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero3DCanvas;
