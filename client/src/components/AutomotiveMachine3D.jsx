import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles } from 'lucide-react';

const AutomotiveMachine3D = () => {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeSpec, setActiveSpec] = useState('aero'); // aero | engine | chassis | interior

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let renderer, scene, camera, carGroup, animationFrameId;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    try {
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xF3F1EC);

      // Camera
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 2.2, 7.5);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // Car Group
      carGroup = new THREE.Group();
      scene.add(carGroup);

      // Sleek Automotive Body - Sculpted aerodynamic supercar form
      const carBodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.85,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
      });

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        transparent: true,
        opacity: 0.85,
      });

      const accentMaterial = new THREE.MeshStandardMaterial({
        color: 0x651F2A, // Burgundy accent
        metalness: 0.8,
        roughness: 0.25,
      });

      const rimMaterial = new THREE.MeshStandardMaterial({
        color: 0xD8D5CF,
        metalness: 0.95,
        roughness: 0.1,
      });

      const tireMaterial = new THREE.MeshStandardMaterial({
        color: 0x181818,
        roughness: 0.8,
      });

      // Main Lower Hull
      const hullGeo = new THREE.BoxGeometry(4.6, 0.55, 2.0);
      const hull = new THREE.Mesh(hullGeo, carBodyMaterial);
      hull.position.y = 0.45;
      hull.castShadow = true;
      hull.receiveShadow = true;
      carGroup.add(hull);

      // Cockpit / Canopy
      const cabinGeo = new THREE.CylinderGeometry(0.7, 1.1, 2.3, 16);
      cabinGeo.rotateZ(Math.PI / 2);
      const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
      cabin.position.set(-0.2, 0.9, 0);
      cabin.scale.set(1.4, 0.7, 0.9);
      carGroup.add(cabin);

      // Aerodynamic Front Nose & Splitter
      const noseGeo = new THREE.ConeGeometry(0.95, 1.2, 4);
      noseGeo.rotateZ(-Math.PI / 2);
      const nose = new THREE.Mesh(noseGeo, carBodyMaterial);
      nose.position.set(2.4, 0.4, 0);
      nose.scale.set(0.6, 0.8, 1.9);
      carGroup.add(nose);

      // Rear Diffuser & Burgundy Wing Accent
      const wingGeo = new THREE.BoxGeometry(0.2, 0.05, 1.9);
      const wing = new THREE.Mesh(wingGeo, accentMaterial);
      wing.position.set(-2.2, 0.95, 0);
      carGroup.add(wing);

      const wingStandsGeo = new THREE.BoxGeometry(0.08, 0.35, 0.08);
      const standLeft = new THREE.Mesh(wingStandsGeo, carBodyMaterial);
      standLeft.position.set(-2.15, 0.75, 0.6);
      const standRight = new THREE.Mesh(wingStandsGeo, carBodyMaterial);
      standRight.position.set(-2.15, 0.75, -0.6);
      carGroup.add(standLeft, standRight);

      // Wheels (4 units)
      const wheelPositions = [
        { x: 1.4, z: 1.05 },
        { x: -1.4, z: 1.05 },
        { x: 1.4, z: -1.05 },
        { x: -1.4, z: -1.05 },
      ];

      wheelPositions.forEach((pos) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos.x, 0.4, pos.z);

        // Tire
        const tireGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.28, 24);
        tireGeo.rotateX(Math.PI / 2);
        const tire = new THREE.Mesh(tireGeo, tireMaterial);
        tire.castShadow = true;
        wheelGroup.add(tire);

        // Rim
        const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.3, 12);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, rimMaterial);
        wheelGroup.add(rim);

        // Caliper (Burgundy)
        const caliperGeo = new THREE.BoxGeometry(0.12, 0.16, 0.32);
        const caliper = new THREE.Mesh(caliperGeo, accentMaterial);
        caliper.position.set(0.15, 0.1, 0);
        wheelGroup.add(caliper);

        carGroup.add(wheelGroup);
      });

      // Ground Shadow Plane
      const shadowPlaneGeo = new THREE.PlaneGeometry(10, 6);
      const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      // Lighting Rig
      const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
      mainLight.position.set(5, 8, 5);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      scene.add(mainLight);

      const rimLight = new THREE.DirectionalLight(0x651F2A, 1.2);
      rimLight.position.set(-6, 4, -4);
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
      fillLight.position.set(0, -3, 4);
      scene.add(fillLight);

      // Mouse drag controls
      const handleMouseDown = (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        carGroup.rotation.y += deltaX * 0.008;
        carGroup.rotation.x = Math.max(-0.2, Math.min(0.2, carGroup.rotation.x + deltaY * 0.004));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('resize', handleResize);

      // Render Loop with subtle idle rotation
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!isDragging && carGroup) {
          carGroup.rotation.y += 0.003;
        }
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('resize', handleResize);

        // Safe disposal of WebGL resources
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn('Three.js initialization notice:', err.message);
      setHasWebGL(false);
    }
  }, []);

  return (
    <section className="py-24 border-t border-b border-[#D8D5CF] bg-[#F3F1EC] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Header Typography */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
                03 / THE MACHINE
              </span>
              <span className="w-8 h-px bg-[#D8D5CF]" />
              <span className="text-[10px] font-mono tracking-widest text-[#651F2A] uppercase font-bold">
                INTERACTIVE 3D PLATFORM
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-bold tracking-tight uppercase text-[#111111]">
              AERODYNAMIC<br />PURSUIT.
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm font-body text-[#707070] leading-relaxed mb-4">
              Every curve sculpted for computational airflow. Dihedral aerodynamics, active rear wing dynamics, and mid-mounted powertrain architecture available across our tier-one vehicle fleet.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#111111] uppercase tracking-wider">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-[#651F2A]" style={{ animationDuration: '6s' }} />
              <span>DRAG CURSOR TO ROTATE 360°</span>
            </div>
          </div>
        </div>

        {/* 3D Stage Container */}
        <div
          data-cursor="drag"
          data-cursor-text="ROTATE"
          className="relative w-full h-[450px] sm:h-[550px] border border-[#D8D5CF] bg-[#FAF9F7] flex items-center justify-center select-none"
        >
          {hasWebGL ? (
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          ) : (
            // Static High-Resolution Fallback
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-radial from-white to-[#F3F1EC]">
              <img
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop"
                alt="Automotive Machine Silhouette"
                className="max-h-[320px] object-contain filter drop-shadow-2xl"
              />
              <p className="text-xs font-mono text-[#707070] uppercase mt-4">
                PORSCHE 911 GT3 RS — MONOCOQUE CHASSIS ARCHITECTURE
              </p>
            </div>
          )}

          {/* Floating Spec Hotspots */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-auto">
            {[
              { id: 'aero', label: 'ACTIVE DRS DYNAMICS' },
              { id: 'engine', label: 'FLAT-SIX 518 HP POWERTRAIN' },
              { id: 'chassis', label: 'CARBON MONOCELL II' },
            ].map((spec) => (
              <button
                key={spec.id}
                onClick={() => setActiveSpec(spec.id)}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border text-left transition-all ${
                  activeSpec === spec.id
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white/80 backdrop-blur-xs text-[#111111] border-[#D8D5CF] hover:border-[#111111]'
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>

          {/* Viewport Corner Metadata */}
          <div className="absolute bottom-4 right-6 text-[9px] font-mono text-[#707070] tracking-widest uppercase">
            SCALE: 1:18 ENGINE • 8-SPEED TRANSMISSION
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomotiveMachine3D;
