import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, Eye, Sparkles, Activity } from 'lucide-react';

const TheMachine3D = () => {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeSpec, setActiveSpec] = useState('aerodynamics'); // aerodynamics | chassis | powertrain
  const [zoomLevel, setZoomLevel] = useState(11);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let renderer, scene, camera, animationFrameId;
    let machineGroup, particlesGroup, pointLight;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotationTarget = { x: 0.15, y: -0.5 };

    try {
      const width = container.clientWidth;
      const height = container.clientHeight;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0B0B0B);
      scene.fog = new THREE.FogExp2(0x0B0B0B, 0.018);

      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 1.6, zoomLevel);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      machineGroup = new THREE.Group();
      particlesGroup = new THREE.Group();
      scene.add(machineGroup);
      scene.add(particlesGroup);

      // Subtle lighting rig
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      pointLight = new THREE.PointLight(0xC5A880, 2.5, 30);
      pointLight.position.set(4, 5, 6);
      scene.add(pointLight);

      // Floor grid
      const grid = new THREE.GridHelper(26, 26, 0xC5A880, 0x222222);
      grid.position.y = -1.2;
      scene.add(grid);

      // 1. Aerodynamic Streamlines / Speedline Flow
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xF4F2ED,
        transparent: true,
        opacity: 0.35,
      });
      const accentLineMaterial = new THREE.LineBasicMaterial({
        color: 0xC5A880,
        transparent: true,
        opacity: 0.8,
        linewidth: 2,
      });

      const numLines = 20;
      const lines = [];

      for (let i = 0; i < numLines; i++) {
        const yOffset = -0.8 + (i / numLines) * 2.2;
        const zOffset = ((i % 5) - 2) * 0.9;
        const isCore = Math.abs(zOffset) < 0.5 && yOffset > -0.3 && yOffset < 0.7;

        const points = [];
        const segments = 32;
        for (let j = 0; j <= segments; j++) {
          const x = -10 + (j / segments) * 20;
          let curveY = yOffset;
          const dist = Math.abs(x);
          if (dist < 3.8) {
            const hump = Math.cos((x / 3.8) * (Math.PI / 2));
            curveY += hump * (0.75 - Math.abs(yOffset) * 0.2);
          }
          points.push(new THREE.Vector3(x, curveY, zOffset));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, isCore ? accentLineMaterial : lineMaterial);
        machineGroup.add(line);
        lines.push({ line, origPoints: points, yOffset });
      }

      // 2. Velocity Particles
      const particleCount = 800;
      const pPositions = new Float32Array(particleCount * 3);
      const pVelocities = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pPositions[i3] = (Math.random() - 0.5) * 20;
        pPositions[i3 + 1] = -1.0 + Math.random() * 2.5;
        pPositions[i3 + 2] = (Math.random() - 0.5) * 5;
        pVelocities[i] = 0.1 + Math.random() * 0.2;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xF4F2ED,
        size: 1.3,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const particleSystem = new THREE.Points(pGeo, pMat);
      particlesGroup.add(particleSystem);

      // 26 — Interactions: Drag to Rotate
      const handleMouseDown = (e) => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e) => {
        // Hover: subtle lighting shift
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const normY = -((e.clientY - rect.top) / rect.height - 0.5) * 10;
        pointLight.position.x = normX;
        pointLight.position.y = normY + 4;

        if (!isDragging) return;
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        prevMouse = { x: e.clientX, y: e.clientY };

        rotationTarget.y += deltaX * 0.005;
        rotationTarget.x += deltaY * 0.005;
        rotationTarget.x = Math.max(-0.2, Math.min(0.8, rotationTarget.x));
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      // 26 — Scroll to Zoom
      const handleWheel = (e) => {
        e.preventDefault();
        const newZoom = Math.max(6, Math.min(16, camera.position.z + e.deltaY * 0.008));
        camera.position.z = newZoom;
        setZoomLevel(Math.round(newZoom * 10) / 10);
      };

      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('wheel', handleWheel, { passive: false });

      // Touch events
      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      };
      const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - prevMouse.x;
        const deltaY = e.touches[0].clientY - prevMouse.y;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        rotationTarget.y += deltaX * 0.006;
        rotationTarget.x += deltaY * 0.006;
      };
      const handleTouchEnd = () => {
        isDragging = false;
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Smooth rotation interpolation
        scene.rotation.y += (rotationTarget.y - scene.rotation.y) * 0.06;
        scene.rotation.x += (rotationTarget.x - scene.rotation.x) * 0.06;

        // Particle speed flow
        const posArr = pGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          posArr[i3] += pVelocities[i];
          if (posArr[i3] > 10) {
            posArr[i3] = -10;
          }
        }
        pGeo.attributes.position.needsUpdate = true;

        // Wave lines
        lines.forEach(({ line, origPoints }, idx) => {
          const positions = line.geometry.attributes.position.array;
          for (let j = 0; j < origPoints.length; j++) {
            const j3 = j * 3;
            const wave = Math.sin(time * 2.5 + origPoints[j].x * 0.5 + idx) * 0.03;
            positions[j3 + 1] = origPoints[j].y + wave;
          }
          line.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('TheMachine3D init failed:', err);
    }
  }, []);

  return (
    <section className="py-28 bg-[#0B0B0B] text-[#F4F2ED] relative overflow-hidden border-b border-white/14 select-none">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* 26 — Section Title: THE MACHINE. */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#9B9B9B] uppercase">
                04 // ENGINEERING
              </span>
              <span className="w-8 h-px bg-white/20" />
              <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">
                THREE.JS TELEMETRY MATRIX
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight uppercase text-[#F4F2ED]">
              THE MACHINE.
            </h2>
            <p className="text-sm font-mono uppercase tracking-widest text-[#9B9B9B] mt-2">
              EXPLORE THE DETAILS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSpec('aerodynamics')}
              className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase border transition-colors ${
                activeSpec === 'aerodynamics'
                  ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                  : 'bg-transparent text-[#9B9B9B] border-white/14 hover:border-white/30'
              }`}
            >
              AERODYNAMICS
            </button>
            <button
              onClick={() => setActiveSpec('chassis')}
              className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase border transition-colors ${
                activeSpec === 'chassis'
                  ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                  : 'bg-transparent text-[#9B9B9B] border-white/14 hover:border-white/30'
              }`}
            >
              CHASSIS
            </button>
            <button
              onClick={() => setActiveSpec('powertrain')}
              className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase border transition-colors ${
                activeSpec === 'powertrain'
                  ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                  : 'bg-transparent text-[#9B9B9B] border-white/14 hover:border-white/30'
              }`}
            >
              POWERTRAIN
            </button>
          </div>
        </div>

        {/* 26 — Main Interactive 3D Stage */}
        <div className="relative w-full h-[540px] sm:h-[640px] bg-[#141414] my-8 border border-white/14 overflow-hidden group">
          {hasWebGL ? (
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              data-cursor="drag"
              data-cursor-text="ROTATE"
            />
          ) : (
            // Static Fallback Image
            <div className="w-full h-full relative flex items-center justify-center p-8 bg-[#141414]">
              <img
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1400&auto=format&fit=crop"
                alt="Static Fallback Vehicle Artwork"
                className="max-h-full max-w-full object-contain filter brightness-[0.8] drop-shadow-2xl"
              />
              <div className="absolute bottom-6 left-6 p-3 bg-black/80 border border-white/14 text-xs font-mono text-[#9B9B9B]">
                STATIC TELEMETRY FALLBACK MODE
              </div>
            </div>
          )}

          {/* Top Left HUD */}
          <div className="absolute top-6 left-6 pointer-events-none text-xs font-mono space-y-1">
            <div className="flex items-center gap-2 text-[#C5A880] font-bold tracking-widest">
              <Activity className="w-3.5 h-3.5" />
              <span>ACTIVE TELEMETRY HUD</span>
            </div>
            <div className="text-[#9B9B9B]">ACTIVE MODE: {activeSpec.toUpperCase()}</div>
            <div className="text-[#9B9B9B]">AIR DRAG: Cd 0.24 // DOWNFORCE: 640 KG</div>
            <div className="text-[#9B9B9B]">ZOOM FACTOR: {zoomLevel}X</div>
          </div>

          {/* Bottom Center Interaction Guide */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-4 px-4 py-2 bg-[#0B0B0B]/85 backdrop-blur-md border border-white/14 text-[10px] font-mono tracking-widest uppercase text-[#9B9B9B]">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3 h-3 text-[#C5A880]" />
              DRAG TO ROTATE
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ZoomIn className="w-3 h-3 text-[#C5A880]" />
              SCROLL TO ZOOM
            </span>
          </div>
        </div>

        {/* Technical Specification Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs font-mono border-t border-white/14">
          <div>
            <span className="text-[#6E6E6E] block mb-1 uppercase">01 // CARBON COMPOSITE TUB</span>
            <p className="text-[#9B9B9B] leading-relaxed">
              Torsional rigidity rated at 40,000 Nm/deg for razor-sharp handling on alpine switchbacks.
            </p>
          </div>
          <div>
            <span className="text-[#6E6E6E] block mb-1 uppercase">02 // ACTIVE VENTURI TUNNELS</span>
            <p className="text-[#9B9B9B] leading-relaxed">
              Ground-effect underbody creating uninterrupted low-pressure suction without drag penalties.
            </p>
          </div>
          <div>
            <span className="text-[#6E6E6E] block mb-1 uppercase">03 // DUAL-CLUTCH HYDRAULICS</span>
            <p className="text-[#9B9B9B] leading-relaxed">
              Sub-50ms gear shifts through motorsport sequential paddle actuators with rev-matching blip.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheMachine3D;
