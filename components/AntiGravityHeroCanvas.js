import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

/**
 * AntiGravityHeroCanvas
 * Awwwards Site-of-the-Day interactive anti-gravity physics hero experience.
 * Powered by Three.js & GSAP with spring physics, inertial damping,
 * magnetic snap/scatter, and cinematic studio electric-blue/amber lighting.
 */
export default function AntiGravityHeroCanvas({ style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !mountRef.current) {
      return;
    }

    let isDisposed = false;
    let renderer;
    let scene;
    let camera;
    let animationFrameId;
    let gsapContext;
    const cleanupFns = [];

    // Dynamically load Three.js and GSAP safely for web execution
    Promise.all([
      import('three'),
      import('gsap')
    ]).then(([THREE, { default: gsap }]) => {
      if (isDisposed || !mountRef.current) return;

      const container = mountRef.current;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 560;

      // 1. Scene & Dark-Mode Minimalist Spatial Environment (#0B0F19)
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b0f19);
      scene.fog = new THREE.FogExp2(0x0b0f19, 0.012);

      // 2. Camera Setup
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 75);

      // 3. WebGL Renderer with Adaptive Pixel Ratio
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);

      // 4. Cinematic Studio Lighting
      // Soft ambient base
      const ambientLight = new THREE.AmbientLight(0x0e1726, 2.0);
      scene.add(ambientLight);

      // Neon Electric-Blue Key Light (RGB 0, 229, 255)
      const blueLight = new THREE.PointLight(0x00e5ff, 4.2, 160);
      blueLight.position.set(-25, 20, 35);
      scene.add(blueLight);

      // Warm Amber Rim Light (#FFB300 / RGB 255, 179, 0)
      const amberLight = new THREE.PointLight(0xffb300, 3.8, 160);
      amberLight.position.set(30, -18, 30);
      scene.add(amberLight);

      // Directional top kicker for metallic specular edges
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(0, 40, 20);
      scene.add(dirLight);

      // 5. Materials Matrix with Specular Reflections
      const metallicBlueMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        metalness: 0.85,
        roughness: 0.18,
        emissive: 0x003b46,
        emissiveIntensity: 0.25,
      });

      const metallicAmberMat = new THREE.MeshStandardMaterial({
        color: 0xffb300,
        metalness: 0.9,
        roughness: 0.22,
        emissive: 0x4a2800,
        emissiveIntensity: 0.2,
      });

      const darkSiliconMat = new THREE.MeshStandardMaterial({
        color: 0x111927,
        metalness: 0.6,
        roughness: 0.35,
      });

      const wireframeCyanMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });

      const glowingSphereMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
      });

      // 6. Physics Simulation Elements Array
      const physicsBodies = [];

      // Helper to add physics entity
      const addBody = (mesh, restX, restY, restZ, mass = 1.0) => {
        mesh.position.set(restX, restY, restZ);
        mesh.frustumCulled = true;
        scene.add(mesh);

        physicsBodies.push({
          mesh,
          rest: new THREE.Vector3(restX, restY, restZ),
          pos: mesh.position,
          vel: new THREE.Vector3(0, 0, 0),
          rotVel: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.015
          ),
          mass,
          floatPhase: Math.random() * Math.PI * 2,
          floatSpeed: 0.8 + Math.random() * 0.6,
        });
      };

      // 7. Generate Abstract 3D Circuit & Anti-Gravity Geometries

      // A. Microchips / IC Processors (Silicon wafer with gold/amber contacts)
      for (let i = 0; i < 6; i++) {
        const chipGroup = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(4.5, 3.2, 0.7);
        const bodyMesh = new THREE.Mesh(bodyGeo, darkSiliconMat);
        chipGroup.add(bodyMesh);

        // Gold contact pins on sides
        const pinGeo = new THREE.BoxGeometry(0.5, 0.2, 0.8);
        for (let p = -1.6; p <= 1.6; p += 0.8) {
          const pinLeft = new THREE.Mesh(pinGeo, metallicAmberMat);
          pinLeft.position.set(-2.4, p, 0);
          chipGroup.add(pinLeft);

          const pinRight = new THREE.Mesh(pinGeo, metallicAmberMat);
          pinRight.position.set(2.4, p, 0);
          chipGroup.add(pinRight);
        }

        const rx = (i % 2 === 0 ? -1 : 1) * (18 + Math.random() * 22);
        const ry = (Math.random() - 0.5) * 28;
        const rz = (Math.random() - 0.5) * 20;
        addBody(chipGroup, rx, ry, rz, 1.4);
      }

      // B. Toroidal Chokes / Inductor Coils
      const torusGeo = new THREE.TorusGeometry(3.2, 0.9, 16, 32);
      for (let i = 0; i < 5; i++) {
        const torusMesh = new THREE.Mesh(torusGeo, metallicAmberMat);
        const rx = (i % 2 === 0 ? -26 : 28) + (Math.random() - 0.5) * 15;
        const ry = -14 + i * 7;
        const rz = (Math.random() - 0.5) * 18;
        addBody(torusMesh, rx, ry, rz, 1.2);
      }

      // C. Cylindrical Capacitors (Electric-Blue with silver terminals)
      const cylGeo = new THREE.CylinderGeometry(1.6, 1.6, 5.0, 24);
      for (let i = 0; i < 6; i++) {
        const cylMesh = new THREE.Mesh(cylGeo, metallicBlueMat);
        const rx = (Math.random() - 0.5) * 55;
        const ry = (Math.random() - 0.5) * 32;
        const rz = (Math.random() - 0.5) * 22;
        addBody(cylMesh, rx, ry, rz, 1.0);
      }

      // D. Floating Geometric Wireframe Polyhedrons
      const icosaGeo = new THREE.IcosahedronGeometry(3.6, 1);
      for (let i = 0; i < 4; i++) {
        const wireMesh = new THREE.Mesh(icosaGeo, wireframeCyanMat);
        const rx = (i % 2 === 0 ? -32 : 32) + (Math.random() - 0.5) * 10;
        const ry = (Math.random() - 0.5) * 24;
        const rz = (Math.random() - 0.5) * 15;
        addBody(wireMesh, rx, ry, rz, 0.8);
      }

      // E. Glowing Micro-Spheres
      const sphereGeo = new THREE.SphereGeometry(0.8, 16, 16);
      for (let i = 0; i < 18; i++) {
        const isAmber = i % 3 === 0;
        const sMat = isAmber
          ? new THREE.MeshBasicMaterial({ color: 0xffb300 })
          : glowingSphereMat;
        const sMesh = new THREE.Mesh(sphereGeo, sMat);
        const rx = (Math.random() - 0.5) * 70;
        const ry = (Math.random() - 0.5) * 40;
        const rz = (Math.random() - 0.5) * 30;
        addBody(sMesh, rx, ry, rz, 0.5);
      }

      // F. Subtle Ambient Electrical Dust Particles (Stars)
      const starCount = 180;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 120;
        starPos[i + 1] = (Math.random() - 0.5) * 80;
        starPos[i + 2] = (Math.random() - 0.5) * 50;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x00e5ff,
        size: 0.5,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // 8. GSAP Kinetic Entrance Reveal
      gsapContext = gsap.context(() => {
        // Entrance scale & drift for physics bodies
        physicsBodies.forEach((body, idx) => {
          body.mesh.scale.set(0.001, 0.001, 0.001);
          gsap.to(body.mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.4,
            delay: idx * 0.035,
            ease: 'power3.out',
          });
        });

        // Breathing pulse on the rim studio lights
        gsap.to(blueLight, {
          intensity: 5.2,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to(amberLight, {
          intensity: 4.6,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Kinetic Typography Staggered Reveal (DOM elements behind canvas)
        if (typeof document !== 'undefined') {
          const kineticElements = ['#hero-kinetic-tag', '#hero-kinetic-title', '#hero-kinetic-subtitle', '#hero-kinetic-trust']
            .map((id) => document.querySelector(id))
            .filter(Boolean);

          if (kineticElements.length > 0) {
            gsap.fromTo(
              kineticElements,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
            );
          }
        }
      });

      // 9. Interactive Cursor Tracking & Unprojected Ray Position
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, worldPos: new THREE.Vector3(0, 0, 0) };
      const raycaster = new THREE.Raycaster();
      const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

      const handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
        const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

        mouse.targetX = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.targetY = -(((clientY - rect.top) / rect.height) * 2 - 1);

        // Map mouse to 3D world plane at Z = 0
        raycaster.setFromCamera(new THREE.Vector2(mouse.targetX, mouse.targetY), camera);
        raycaster.ray.intersectPlane(planeZ, mouse.worldPos);
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      cleanupFns.push(() => window.removeEventListener('pointermove', handlePointerMove));

      // 10. Responsive Resize Handler
      const handleResize = () => {
        if (!container) return;
        const newW = container.clientWidth || window.innerWidth;
        const newH = container.clientHeight || 560;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);
      cleanupFns.push(() => window.removeEventListener('resize', handleResize));

      // 11. 60 FPS Anti-Gravity & Spring Physics Simulation Loop
      const clock = new THREE.Clock();
      const SPRING_K = 0.024;       // Restitution pull strength to magnetic equilibrium
      const DAMPING = 0.915;        // Inertial velocity decay
      const REPEL_RADIUS = 26.0;    // Cursor magnetic repulsion horizon
      const REPEL_FORCE = 38.0;     // Scatter burst impulse strength

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const elapsedTime = clock.getElapsedTime();

        // Smooth camera parallax tilt
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
        camera.position.x = mouse.x * 6.5;
        camera.position.y = mouse.y * 4.5;
        camera.lookAt(0, 0, 0);

        // Rotate ambient starfield
        starField.rotation.y = elapsedTime * 0.015;

        // Simulate each anti-gravity body
        for (let i = 0; i < physicsBodies.length; i++) {
          const body = physicsBodies[i];

          // A. Weightless Floating Drift (Micro-Harmonic Oscillation)
          const floatY = Math.sin(elapsedTime * body.floatSpeed + body.floatPhase) * 1.8;
          const floatX = Math.cos(elapsedTime * 0.6 * body.floatSpeed + body.floatPhase) * 1.1;
          const targetRestPos = new THREE.Vector3(
            body.rest.x + floatX,
            body.rest.y + floatY,
            body.rest.z
          );

          // B. Spring Restitution Force (Pull back to magnetic rest position)
          const springForce = new THREE.Vector3()
            .subVectors(targetRestPos, body.pos)
            .multiplyScalar(SPRING_K / body.mass);
          body.vel.add(springForce);

          // C. Dynamic Cursor Repulsion & Scatter Impulse
          const distToCursor = body.pos.distanceTo(mouse.worldPos);
          if (distToCursor < REPEL_RADIUS && distToCursor > 0.01) {
            const repelStrength = ((REPEL_RADIUS - distToCursor) / REPEL_RADIUS) * (REPEL_FORCE / body.mass);
            const repelDir = new THREE.Vector3()
              .subVectors(body.pos, mouse.worldPos)
              .normalize()
              .multiplyScalar(repelStrength * dt);

            // Give a 3D scatter burst with upward/tumbling component
            repelDir.z += Math.sin(elapsedTime * 3 + i) * 0.35;
            body.vel.add(repelDir);

            // Agitate angular tumbling velocity on impact
            body.rotVel.x += (Math.random() - 0.5) * 0.04;
            body.rotVel.y += (Math.random() - 0.5) * 0.04;
          }

          // D. Inertial Damping & Position Integration
          body.vel.multiplyScalar(DAMPING);
          body.pos.add(body.vel);

          // E. Angular Momentum & Rotational Inertia
          body.rotVel.multiplyScalar(0.96);
          body.mesh.rotation.x += body.rotVel.x + 0.004;
          body.mesh.rotation.y += body.rotVel.y + 0.006;
          body.mesh.rotation.z += body.rotVel.z + 0.002;
        }

        renderer.render(scene, camera);
      };

      animate();

      // 12. Complete Cleanup Handler
      return () => {
        cancelAnimationFrame(animationFrameId);
        cleanupFns.forEach((fn) => fn());
        if (gsapContext) gsapContext.revert();

        // Dispose Three.js WebGL resources
        if (renderer) {
          if (renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          renderer.dispose();
        }

        scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        scene.clear();
      };
    }).catch((err) => {
      console.warn('[AntiGravityHeroCanvas] WebGL load skipped:', err);
    });

    return () => {
      isDisposed = true;
    };
  }, []);

  return (
    <View
      ref={mountRef}
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        {
          overflow: 'hidden',
          backgroundColor: '#0b0f19',
        },
        style,
      ]}
    />
  );
}
