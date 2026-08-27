import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gauge, Zap, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURED_SHOWCASE = [
  {
    id: '67ff5bc069c03d4e45f30b01',
    name: 'Porsche 911 GT3 RS',
    brand: 'Porsche',
    tag: 'Track Weapon',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
    hp: '518 HP',
    accel: '3.0s',
    topSpeed: '184 MPH',
    rate: '₹75,000',
    colorTheme: '#800020',
  },
  {
    id: '67ff5bc069c03d4e45f30b02',
    name: 'Ferrari F8 Tributo',
    brand: 'Ferrari',
    tag: 'Italian Masterpiece',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop',
    hp: '710 HP',
    accel: '2.9s',
    topSpeed: '211 MPH',
    rate: '₹95,000',
    colorTheme: '#991B1B',
  },
  {
    id: '67ff5bc069c03d4e45f30b03',
    name: 'Lamborghini Huracán Evo',
    brand: 'Lamborghini',
    tag: 'Naturally Aspirated V10',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
    hp: '630 HP',
    accel: '2.9s',
    topSpeed: '202 MPH',
    rate: '₹1,10,000',
    colorTheme: '#800020',
  },
  {
    id: '67ff5bc069c03d4e45f30b05',
    name: 'McLaren 720S Spider',
    brand: 'McLaren',
    tag: 'Carbon Monocage',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop',
    hp: '710 HP',
    accel: '2.8s',
    topSpeed: '212 MPH',
    rate: '₹1,05,000',
    colorTheme: '#09090b',
  },
];

const HeroVisual3D = ({ className = '' }) => {
  const mountRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const currentCar = FEATURED_SHOWCASE[currentIndex];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Kinetic Geometric Sculptures (Torus Knot in Deep Maroon/Obsidian)
    const knotGeo = new THREE.TorusKnotGeometry(6.5, 0.8, 120, 24, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x800020,
      emissive: 0x5c0017,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.15,
      transmission: 0.5,
      transparent: true,
      opacity: 0.55,
      wireframe: true,
    });
    const torusKnot = new THREE.Mesh(knotGeo, knotMat);
    torusKnot.position.set(0, 0, -4);
    scene.add(torusKnot);

    // Orbiting Hologram Rings
    const ringGeo1 = new THREE.TorusGeometry(9.5, 0.08, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x800020, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(11.2, 0.06, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x18181b, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 3. Floating Particle Cloud
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x800020,
      size: 0.22,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x800020, 2.5, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // 5. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // 6. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      torusKnot.rotation.x += 0.004;
      torusKnot.rotation.y += 0.006;

      ring1.rotation.z += 0.003;
      ring2.rotation.x += 0.002;

      particles.rotation.y += 0.001;

      // Parallax smooth lerp
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_SHOWCASE.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_SHOWCASE.length) % FEATURED_SHOWCASE.length);
  };

  return (
    <div className={`relative w-full h-full min-h-[420px] lg:min-h-[520px] rounded-3xl overflow-hidden bg-white/70 backdrop-blur-2xl border border-zinc-200/80 shadow-2xl flex flex-col justify-between p-5 md:p-7 ${className}`}>
      {/* Background Three.js Kinetic Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />

      {/* Top Header Controls & Live Telemetry Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-zinc-200 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-900 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#800020] animate-ping" />
          <span className="font-bold text-[#800020]">FLAGSHIP SHOWCASE</span>
          <span className="text-zinc-300">|</span>
          <span className="text-zinc-600 font-semibold">{currentCar.tag}</span>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-zinc-200 p-1 rounded-full shadow-sm">
          <button
            onClick={prevSlide}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
            title="Previous Vehicle"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
            title="Next Vehicle"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center 3D Floating Vehicle Image with Depth Parallax */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCar.id}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => navigate(`/car-details/${currentCar.id}`)}
            className="group relative w-full max-w-md h-52 sm:h-60 rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-white/80 bg-zinc-100"
          >
            <img
              src={currentCar.image}
              alt={currentCar.name}
              className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-75 group-hover:opacity-65 transition-opacity" />

            {/* Overlaid Title & Rate on Image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-bold">{currentCar.brand}</span>
                <h3 className="text-xl font-black">{currentCar.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-300 block">DAILY RATE</span>
                <span className="text-lg font-black text-rose-300 font-mono">{currentCar.rate}<span className="text-xs font-normal text-zinc-300">/day</span></span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Telemetry Bar & Vehicle Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Specs Telemetry Chips */}
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-800">
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-zinc-200 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#800020]" />
            <span className="font-bold">{currentCar.hp}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-zinc-200 shadow-sm">
            <Gauge className="w-3.5 h-3.5 text-black" />
            <span className="font-bold">0-100: {currentCar.accel}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-zinc-200 shadow-sm hidden sm:flex">
            <span className="font-bold text-zinc-800">Top: {currentCar.topSpeed}</span>
          </div>
        </div>

        {/* View Details Action Button */}
        <button
          onClick={() => navigate(`/car-details/${currentCar.id}`)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-black hover:bg-[#800020] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
        >
          <span>Rent This Vehicle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default HeroVisual3D;
