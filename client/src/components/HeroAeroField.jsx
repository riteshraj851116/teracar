import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroAeroField = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, points, animationFrameId;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = container.clientWidth;
    let height = container.clientHeight;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.z = 45;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Create Aerodynamic Velocity Flow Particles
      const particleCount = 280;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Spread across wide horizontal aspect
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 40;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;

        originalPositions[i3] = positions[i3];
        originalPositions[i3 + 1] = positions[i3 + 1];
        originalPositions[i3 + 2] = positions[i3 + 2];

        // Horizontal wind streamline velocities
        velocities[i3] = 0.15 + Math.random() * 0.25; // x-speed
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02; // subtle drift y
        velocities[i3 + 2] = 0;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Subtle editorial particle material
      const material = new THREE.PointsMaterial({
        color: 0x111111,
        size: 1.2,
        transparent: true,
        opacity: 0.18,
        blending: THREE.NormalBlending,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      // Add a subtle secondary burgundy streamline stream
      const burgundyCount = 40;
      const bPositions = new Float32Array(burgundyCount * 3);
      for (let i = 0; i < burgundyCount; i++) {
        const i3 = i * 3;
        bPositions[i3] = (Math.random() - 0.5) * 75;
        bPositions[i3 + 1] = (Math.random() - 0.5) * 30;
        bPositions[i3 + 2] = (Math.random() - 0.5) * 20;
      }
      const bGeo = new THREE.BufferGeometry();
      bGeo.setAttribute('position', new THREE.BufferAttribute(bPositions, 3));
      const bMat = new THREE.PointsMaterial({
        color: 0x651F2A,
        size: 1.8,
        transparent: true,
        opacity: 0.35,
      });
      const bPoints = new THREE.Points(bGeo, bMat);
      scene.add(bPoints);

      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouse.targetX = (x - 0.5) * 2;
        mouse.targetY = -(y - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Handle Resize
      const handleResize = () => {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Smooth mouse interpolation
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Animate particles flowing like wind streamlines
        const pos = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          // Move forward in X (wind direction)
          pos[i3] += velocities[i3] * (1 + Math.abs(mouse.x) * 1.5);
          
          // Influence Y based on cursor position & sine wave
          pos[i3 + 1] += Math.sin(pos[i3] * 0.08 + clock.getElapsedTime()) * 0.02 + mouse.y * 0.04;

          // Wrap around boundary
          if (pos[i3] > 40) {
            pos[i3] = -40;
            pos[i3 + 1] = originalPositions[i3 + 1];
          }
        }
        geometry.attributes.position.needsUpdate = true;

        // Subtle camera tilt with mouse
        camera.position.x = mouse.x * 3;
        camera.position.y = mouse.y * 2;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
        geometry.dispose();
        material.dispose();
        bGeo.dispose();
        bMat.dispose();
      };
    } catch (err) {
      console.warn('HeroAeroField WebGL init failed:', err);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80"
      aria-hidden="true"
    />
  );
};

export default HeroAeroField;
