import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PAINT_COLORS = [
  { name: 'Cyber Cyan', value: 0x06b6d4, hex: '#06b6d4' },
  { name: 'Crimson Red', value: 0xef4444, hex: '#ef4444' },
  { name: 'Midnight Gold', value: 0xf59e0b, hex: '#f59e0b' },
  { name: 'Neon Purple', value: 0xa855f7, hex: '#a855f7' },
  { name: 'Matte Obsidian', value: 0x1e293b, hex: '#1e293b' },
];

const Hero3DCanvas = ({ className = '' }) => {
  const mountRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0]);
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const carBodyMatRef = useRef(null);
  const headlightsMatRef = useRef(null);
  const carGroupRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4.5, 2.2, 5.5);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const cyanSpotLight = new THREE.PointLight(0x06b6d4, 3, 10);
    cyanSpotLight.position.set(-3, 2, -2);
    scene.add(cyanSpotLight);

    const purpleSpotLight = new THREE.PointLight(0x8b5cf6, 3, 10);
    purpleSpotLight.position.set(3, 2, 2);
    scene.add(purpleSpotLight);

    // 5. Floor Grid & Reflective Platform
    const floorGeo = new THREE.CircleGeometry(6, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080b11,
      roughness: 0.2,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid helper ring
    const gridHelper = new THREE.GridHelper(10, 20, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -0.04;
    scene.add(gridHelper);

    // 6. Build Futuristic Supercar Model (Procedural 3D Geometry)
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Car Body Material
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: selectedColor.value,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: isWireframe,
    });
    carBodyMatRef.current = bodyMat;

    // Glass Material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    // Dark Trim Material
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.4,
      metalness: 0.5,
    });

    // Headlight Material
    const headlightMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    headlightsMatRef.current = headlightMat;

    // Taillight Material
    const taillightMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
    });

    // --- Car Body Parts ---
    // Chassis / Base
    const chassisGeo = new THREE.BoxGeometry(1.9, 0.45, 3.8);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.y = 0.35;
    chassis.castShadow = true;
    carGroup.add(chassis);

    // Aerodynamic Nose / Hood Slope
    const hoodGeo = new THREE.BoxGeometry(1.85, 0.25, 1.4);
    const hood = new THREE.Mesh(hoodGeo, bodyMat);
    hood.position.set(0, 0.45, 1.2);
    hood.rotation.x = -0.15;
    hood.castShadow = true;
    carGroup.add(hood);

    // Cockpit Canopy (Glass & Roof)
    const cabinGeo = new THREE.BoxGeometry(1.5, 0.55, 1.7);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 0.75, -0.1);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Top Shell
    const roofGeo = new THREE.BoxGeometry(1.4, 0.08, 1.3);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(0, 1.05, -0.1);
    carGroup.add(roof);

    // Rear Spoiler
    const spoilerWingGeo = new THREE.BoxGeometry(1.8, 0.06, 0.4);
    const spoilerWing = new THREE.Mesh(spoilerWingGeo, bodyMat);
    spoilerWing.position.set(0, 0.8, -1.8);
    carGroup.add(spoilerWing);

    const spoilerLegLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.1), trimMat);
    spoilerLegLeft.position.set(-0.6, 0.65, -1.8);
    carGroup.add(spoilerLegLeft);

    const spoilerLegRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.1), trimMat);
    spoilerLegRight.position.set(0.6, 0.65, -1.8);
    carGroup.add(spoilerLegRight);

    // LED Headlight Strips
    const headlightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.08), headlightMat);
    headlightLeft.position.set(-0.65, 0.45, 1.9);
    carGroup.add(headlightLeft);

    const headlightRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.08), headlightMat);
    headlightRight.position.set(0.65, 0.45, 1.9);
    carGroup.add(headlightRight);

    // LED Taillight Bar
    const taillightBar = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.08), taillightMat);
    taillightBar.position.set(0, 0.5, -1.9);
    carGroup.add(taillightBar);

    // --- Wheels ---
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 32);
    const wheelRimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.32, 16);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x050811, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });

    const createWheel = (x, z) => {
      const wheelHolder = new THREE.Group();
      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelHolder.add(tire);

      const rim = new THREE.Mesh(wheelRimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelHolder.add(rim);

      wheelHolder.position.set(x, 0.38, z);
      return wheelHolder;
    };

    carGroup.add(createWheel(-0.95, 1.15));
    carGroup.add(createWheel(0.95, 1.15));
    carGroup.add(createWheel(-0.95, -1.15));
    carGroup.add(createWheel(0.95, -1.15));

    // Floating Light Dust Particles around the 3D studio
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = Math.random() * 5;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Orbit Controls (Mouse Dragging)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !carGroupRef.current) return;

      const deltaX = e.clientX - previousMousePosition.x;
      carGroupRef.current.rotation.y += deltaX * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile devices
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || !carGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      carGroupRef.current.rotation.y += deltaX * 0.008;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && carGroupRef.current && !isDragging) {
        carGroupRef.current.rotation.y += 0.005;
      }

      particles.rotation.y += 0.001;
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
      headlightsMatRef.current.color.setHex(lightsOn ? 0x38bdf8 : 0x1e293b);
    }
  }, [lightsOn]);

  return (
    <div className={`relative w-full h-full min-h-[380px] lg:min-h-[480px] rounded-2xl overflow-hidden glass-card shadow-2xl border border-cyan-500/20 ${className}`}>
      {/* 3D Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Telemetry Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs font-mono text-cyan-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>THREE.JS // 3D STUDIO ACTIVE</span>
      </div>

      {/* Interactive Controls Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/85 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-xl">
        {/* Paint Color Swatches */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider hidden sm:inline">Paint:</span>
          <div className="flex items-center gap-1.5">
            {PAINT_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                title={c.name}
                className={`w-6 h-6 rounded-full transition-all duration-300 border ${
                  selectedColor.name === c.name ? 'scale-125 border-white ring-2 ring-cyan-400/50' : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              isRotating ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900/60 text-slate-400 border-white/10'
            }`}
          >
            {isRotating ? 'Auto Rotate: ON' : 'Auto Rotate: OFF'}
          </button>

          <button
            onClick={() => setLightsOn(!lightsOn)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              lightsOn ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900/60 text-slate-400 border-white/10'
            }`}
          >
            LEDs
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              isWireframe ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-900/60 text-slate-400 border-white/10'
            }`}
          >
            X-Ray Wireframe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero3DCanvas;
