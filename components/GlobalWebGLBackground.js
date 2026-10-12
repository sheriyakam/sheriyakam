import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * GlobalWebGLBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Awwwards SOTD-Grade Global WebGL Background Layer built with Three.js & GSAP.
 *
 * Core Specifications:
 * 1. Spans 100vw / 100vh with fixed positioning behind all DOM elements (pointer-events: none).
 * 2. Dark-mode volumetric field (#0B0F19 base) with 1,600 continuous micro-particles and
 *    floating energy lines that morph based on scroll progress and section state.
 * 3. Smooth morphing states:
 *    - State 0 (Hero): Fluid ambient weightless cloud & harmonic waves.
 *    - State 1 (Emergency & Services): Tight crystalline grid matrix (electric power bus).
 *    - State 2 (Reviews & Footer): Dispersed floating circuit nodes (wide cosmic dispersion).
 * 4. Scroll-Driven Physics:
 *    - GSAP & Scroll velocity maps scroll progress to camera position and dispersion velocity.
 * 5. Interactive Cursor Repulsion:
 *    - GPU vertex shader repulsion force field for instant magnetic spring depth effects.
 * 6. Lighting & Shaders:
 *    - Neon electric-blue (RGB 0, 229, 255) and warm amber rim highlights (RGB 255, 179, 0).
 *    - Depth-of-field bokeh blur and additive bloom blending.
 * 7. Performance:
 *    - DPR clamped to max 1.5x, frustum culling enabled.
 *    - Render loop completely halted (requestAnimationFrame canceled) when tab is out of focus or hidden.
 *    - Zero DOM occlusion or layout shift.
 */
export default function GlobalWebGLBackground() {
  if (Platform.OS !== 'web') {
    return null;
  }

  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    let isDisposed = false;
    let animId = null;
    let isRunning = true;
    let cleanupListeners = () => {};

    // Dynamic import to ensure complete SSR / node export safety
    Promise.all([
      import('three'),
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([THREE, { gsap }, { ScrollTrigger }]) => {
      if (isDisposed || !containerRef.current) return;

      try {
        gsap.registerPlugin(ScrollTrigger);
      } catch (e) {
        // Plugin register safety fallback
      }

      // Container Dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;

      // ─── 1. Scene, Camera & Renderer Setup ─────────────────────────────
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0B0F19);
      scene.fog = new THREE.FogExp2(0x0B0F19, 0.012);

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 300);
      camera.position.set(0, 0, 72);

      const renderer = new THREE.WebGLRenderer({
        powerPreference: 'high-performance',
        antialias: false, // Performance: disabled multi-pass AA in favor of soft point shaders
        alpha: false,
        stencil: false,
        depth: true,
      });

      const clampedDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(clampedDpr);
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const canvas = renderer.domElement;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.display = 'block';
      canvas.style.pointerEvents = 'none';

      containerRef.current.appendChild(canvas);

      // ─── 2. Geometry & Morph Target Construction ───────────────────────
      const PARTICLE_COUNT = 1600;
      const LINE_COUNT = 360;

      const posHero = new Float32Array(PARTICLE_COUNT * 3);
      const posGrid = new Float32Array(PARTICLE_COUNT * 3);
      const posDispersed = new Float32Array(PARTICLE_COUNT * 3);
      const sizes = new Float32Array(PARTICLE_COUNT);
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      const phases = new Float32Array(PARTICLE_COUNT);

      const electricBlue = new THREE.Color(0x00E5FF); // RGB 0, 229, 255
      const warmAmber = new THREE.Color(0xFFB300);    // Warm amber rim

      // Generate Morph Coordinates
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // A. State 0: Hero (Fluid volumetric nebula with harmonic spiral ribbon)
        const u = Math.random();
        const theta = u * Math.PI * 6.0;
        const radius = 10.0 + Math.pow(Math.random(), 0.6) * 44.0;
        const spiralZ = (Math.random() - 0.5) * 40.0;
        posHero[i3] = Math.cos(theta) * radius + (Math.random() - 0.5) * 8.0;
        posHero[i3 + 1] = Math.sin(theta) * (radius * 0.65) + (Math.random() - 0.5) * 8.0;
        posHero[i3 + 2] = spiralZ;

        // B. State 1: Emergency & Services (Tight Crystalline Power Grid Matrix)
        const cols = 20;
        const rows = 10;
        const layers = 8;
        const colIdx = i % cols;
        const rowIdx = Math.floor(i / cols) % rows;
        const layerIdx = Math.floor(i / (cols * rows)) % layers;

        const gridX = (colIdx - cols / 2 + 0.5) * 5.2;
        const gridY = (rowIdx - rows / 2 + 0.5) * 5.2;
        const gridZ = (layerIdx - layers / 2 + 0.5) * 6.5;

        posGrid[i3] = gridX;
        posGrid[i3 + 1] = gridY;
        posGrid[i3 + 2] = gridZ;

        // C. State 2: Reviews & Footer (Dispersed Floating Circuit Nodes)
        const phi = Math.acos(2.0 * Math.random() - 1.0);
        const lam = 2.0 * Math.PI * Math.random();
        const dispRadius = 45.0 + Math.random() * 55.0;
        posDispersed[i3] = dispRadius * Math.sin(phi) * Math.cos(lam);
        posDispersed[i3 + 1] = dispRadius * Math.sin(phi) * Math.sin(lam);
        posDispersed[i3 + 2] = (dispRadius * Math.cos(phi)) * 0.7 - 10.0;

        // Particle Attributes
        sizes[i] = 2.8 + Math.random() * 5.2;
        phases[i] = Math.random();

        // 82% Neon Electric-Blue, 18% Warm Amber Rim
        const isAmber = Math.random() > 0.82;
        const col = isAmber ? warmAmber : electricBlue;
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(posHero, 3));
      particleGeometry.setAttribute('aPosHero', new THREE.BufferAttribute(posHero, 3));
      particleGeometry.setAttribute('aPosGrid', new THREE.BufferAttribute(posGrid, 3));
      particleGeometry.setAttribute('aPosDispersed', new THREE.BufferAttribute(posDispersed, 3));
      particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      particleGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

      // ─── 3. Floating Energy Lines Geometry ────────────────────────────
      const linePosHero = new Float32Array(LINE_COUNT * 2 * 3);
      const linePosGrid = new Float32Array(LINE_COUNT * 2 * 3);
      const linePosDispersed = new Float32Array(LINE_COUNT * 2 * 3);
      const linePhases = new Float32Array(LINE_COUNT * 2);

      for (let l = 0; l < LINE_COUNT; l++) {
        // Connect nearby grid neighbors to create structured electric bus in grid mode
        const p1 = Math.floor(Math.random() * (PARTICLE_COUNT - 25));
        // Prefer grid neighbor or near particle
        const p2 = Math.random() > 0.4 ? p1 + 1 : Math.min(PARTICLE_COUNT - 1, p1 + 20);

        const v1Idx = l * 2;
        const v2Idx = l * 2 + 1;

        for (let axis = 0; axis < 3; axis++) {
          linePosHero[v1Idx * 3 + axis] = posHero[p1 * 3 + axis];
          linePosHero[v2Idx * 3 + axis] = posHero[p2 * 3 + axis];

          linePosGrid[v1Idx * 3 + axis] = posGrid[p1 * 3 + axis];
          linePosGrid[v2Idx * 3 + axis] = posGrid[p2 * 3 + axis];

          linePosDispersed[v1Idx * 3 + axis] = posDispersed[p1 * 3 + axis];
          linePosDispersed[v2Idx * 3 + axis] = posDispersed[p2 * 3 + axis];
        }

        const ph = Math.random();
        linePhases[v1Idx] = ph;
        linePhases[v2Idx] = ph;
      }

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePosHero, 3));
      lineGeometry.setAttribute('aPosHero', new THREE.BufferAttribute(linePosHero, 3));
      lineGeometry.setAttribute('aPosGrid', new THREE.BufferAttribute(linePosGrid, 3));
      lineGeometry.setAttribute('aPosDispersed', new THREE.BufferAttribute(linePosDispersed, 3));
      lineGeometry.setAttribute('aPhase', new THREE.BufferAttribute(linePhases, 1));

      // ─── 4. Custom Shaders with Depth-of-Field & Bloom ──────────────────
      const uniforms = {
        uTime: { value: 0 },
        uMorphState: { value: 0.0 }, // 0.0 = Hero, 1.0 = Grid, 2.0 = Dispersed
        uScrollVelocity: { value: 0.0 },
        uMouse: { value: new THREE.Vector3(-9999, -9999, -9999) },
        uPixelRatio: { value: clampedDpr },
        uLineColor: { value: new THREE.Vector3(0.0, 0.898, 1.0) }
      };

      const particleVertexShader = `
        uniform float uTime;
        uniform float uMorphState;
        uniform float uScrollVelocity;
        uniform vec3 uMouse;
        uniform float uPixelRatio;

        attribute vec3 aPosHero;
        attribute vec3 aPosGrid;
        attribute vec3 aPosDispersed;
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aPhase;

        varying vec3 vColor;
        varying float vAlpha;

        vec3 getHarmonicField(vec3 p, float t, float phase) {
          float s1 = sin(t * 0.75 + phase * 6.28318 + p.y * 0.04);
          float c1 = cos(t * 0.55 + phase * 4.18879 + p.x * 0.04);
          float s2 = sin(t * 0.85 + phase * 5.23598 + p.z * 0.04);
          return vec3(s1 * 1.6, c1 * 1.6, s2 * 2.0);
        }

        void main() {
          // 1. Dual-Phase Morphing
          vec3 basePos;
          if (uMorphState <= 1.0) {
            float t = smoothstep(0.0, 1.0, uMorphState);
            basePos = mix(aPosHero, aPosGrid, t);
          } else {
            float t = smoothstep(1.0, 2.0, uMorphState);
            basePos = mix(aPosGrid, aPosDispersed, t);
          }

          // 2. Velocity Dispersion & Turbulence
          float velEnergy = clamp(abs(uScrollVelocity) * 0.075, 0.0, 4.0);
          vec3 drift = getHarmonicField(basePos, uTime, aPhase) * (1.0 + velEnergy * 1.25);

          // Crystalline lock: tighten grid structure in State 1
          float gridLock = 1.0 - clamp(abs(uMorphState - 1.0), 0.0, 1.0);
          drift *= (1.0 - gridLock * 0.78);

          vec3 pos = basePos + drift;

          // 3. Interactive Cursor Repulsion Force Field
          vec3 delta = pos - uMouse;
          float dist = length(delta.xy);
          float repulsionRadius = 24.0;
          float force = 0.0;

          if (dist < repulsionRadius) {
            float normDist = dist / repulsionRadius;
            force = (1.0 - normDist) * (1.0 - normDist);
            vec2 dir = normalize(delta.xy + vec2(0.0001));
            pos.xy += dir * force * 18.0;
            pos.z += force * 14.0;
          }

          // Dynamic Color & Alpha
          vColor = aColor;
          if (force > 0.02) {
            vColor = mix(vColor, vec3(0.0, 0.898, 1.0), force * 0.85);
          }

          vAlpha = (0.65 + 0.35 * sin(uTime * 2.2 + aPhase * 6.28318)) * (1.0 + force * 0.4);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Depth-scaled point size
          float pointScale = 220.0 / -mvPosition.z;
          gl_PointSize = aSize * pointScale * uPixelRatio * (1.0 + velEnergy * 0.35 + force * 0.6);
        }
      `;

      const particleFragmentShader = `
        precision highp float;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);

          if (dist > 0.5) {
            discard;
          }

          // Depth-of-Field Bokeh Blur & Bloom Core
          float core = smoothstep(0.14, 0.0, dist);
          float halo = smoothstep(0.5, 0.06, dist);

          vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.72);
          float alpha = (core * 0.92 + halo * 0.42) * vAlpha;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      const particleMaterial = new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
      particlePoints.frustumCulled = true;
      scene.add(particlePoints);

      // Line Shaders
      const lineVertexShader = `
        uniform float uTime;
        uniform float uMorphState;
        uniform float uScrollVelocity;
        uniform vec3 uMouse;

        attribute vec3 aPosHero;
        attribute vec3 aPosGrid;
        attribute vec3 aPosDispersed;
        attribute float aPhase;

        varying float vAlpha;

        void main() {
          vec3 basePos;
          if (uMorphState <= 1.0) {
            float t = smoothstep(0.0, 1.0, uMorphState);
            basePos = mix(aPosHero, aPosGrid, t);
          } else {
            float t = smoothstep(1.0, 2.0, uMorphState);
            basePos = mix(aPosGrid, aPosDispersed, t);
          }

          float velEnergy = clamp(abs(uScrollVelocity) * 0.075, 0.0, 4.0);
          float gridLock = 1.0 - clamp(abs(uMorphState - 1.0), 0.0, 1.0);

          vec3 drift = vec3(
            sin(uTime * 0.6 + aPhase * 6.28) * 1.3,
            cos(uTime * 0.5 + aPhase * 4.18) * 1.3,
            sin(uTime * 0.7 + aPhase * 5.23) * 1.6
          ) * (1.0 - gridLock * 0.8) * (1.0 + velEnergy * 0.8);

          vec3 pos = basePos + drift;

          vec3 delta = pos - uMouse;
          float dist = length(delta.xy);
          float radius = 24.0;
          if (dist < radius) {
            float f = (1.0 - dist / radius);
            pos.xy += normalize(delta.xy + vec2(0.0001)) * f * f * 14.0;
            pos.z += f * f * 10.0;
          }

          vAlpha = (0.22 + 0.14 * sin(uTime * 1.8 + aPhase * 6.28) + gridLock * 0.28) * (1.0 + velEnergy * 0.35);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const lineFragmentShader = `
        precision highp float;

        uniform vec3 uLineColor;
        varying float vAlpha;

        void main() {
          gl_FragColor = vec4(uLineColor, clamp(vAlpha, 0.0, 0.55));
        }
      `;

      const lineMaterial = new THREE.ShaderMaterial({
        vertexShader: lineVertexShader,
        fragmentShader: lineFragmentShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const energyLines = new THREE.LineSegments(lineGeometry, lineMaterial);
      energyLines.frustumCulled = true;
      scene.add(energyLines);

      // ─── 5. Interactive Cursor Repulsion Handling ──────────────────────
      const targetMouse = new THREE.Vector3(-9999, -9999, -9999);
      let pointerIdleTimer = null;

      const onPointerMove = (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;

        const vector = new THREE.Vector3(x, y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));

        targetMouse.set(worldPos.x, worldPos.y, 0);

        if (pointerIdleTimer) clearTimeout(pointerIdleTimer);
        pointerIdleTimer = setTimeout(() => {
          targetMouse.set(-9999, -9999, -9999);
        }, 2500);
      };

      const onPointerLeave = () => {
        targetMouse.set(-9999, -9999, -9999);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave, { passive: true });

      // ─── 6. Scroll-Driven Physics & GSAP Morph Transitions ─────────────
      let lastScrollY = window.scrollY || 0;
      let lastScrollTime = performance.now();
      let scrollVelocity = 0;

      const getScrollMetrics = () => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
        const maxScroll = Math.max(
          doc.scrollHeight,
          body.scrollHeight,
          doc.offsetHeight,
          body.offsetHeight
        ) - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
        return { scrollTop, progress };
      };

      const handleScroll = () => {
        const now = performance.now();
        const { scrollTop, progress } = getScrollMetrics();
        const dt = Math.max((now - lastScrollTime) / 1000, 0.001);
        const dy = scrollTop - lastScrollY;
        scrollVelocity = dy / dt;
        lastScrollY = scrollTop;
        lastScrollTime = now;

        // Map Section Morph Target:
        // Progress 0.00 - 0.22: Hero state (0.0)
        // Progress 0.22 - 0.68: Emergency / Services Crystalline Grid (1.0)
        // Progress 0.68 - 1.00: Reviews / Footer Dispersed Nodes (2.0)
        let targetMorph = 0.0;
        if (progress < 0.22) {
          targetMorph = (progress / 0.22) * 0.7;
        } else if (progress < 0.68) {
          targetMorph = 0.7 + ((progress - 0.22) / 0.46) * 0.6;
        } else {
          targetMorph = 1.3 + ((progress - 0.68) / 0.32) * 0.7;
        }

        // GSAP smooth morph tweening
        gsap.to(uniforms.uMorphState, {
          value: targetMorph,
          duration: 0.85,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // GSAP camera orbital tracking
        gsap.to(camera.position, {
          y: -progress * 26.0,
          x: Math.sin(progress * Math.PI) * 7.5,
          duration: 1.0,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      };

      // Listen on window and document capture to handle React Native Web ScrollView
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

      // ─── 7. Viewport Resize Handling ──────────────────────────────────
      const onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h);
        uniforms.uPixelRatio.value = dpr;
      };

      window.addEventListener('resize', onResize, { passive: true });

      // ─── 8. Render Loop Lifecycle & Power Optimization ────────────────
      const clock = new THREE.Clock();

      const animate = () => {
        if (!isRunning || document.hidden || isDisposed) {
          return;
        }

        animId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        uniforms.uTime.value += delta;

        // Smooth mouse spring lerp
        uniforms.uMouse.value.lerp(targetMouse, 0.12);

        // Inertial damping of scroll velocity
        uniforms.uScrollVelocity.value += (scrollVelocity * 0.015 - uniforms.uScrollVelocity.value) * 0.09;
        scrollVelocity *= 0.91; // decay

        // Subtle scene rotation
        scene.rotation.y = Math.sin(uniforms.uTime.value * 0.15) * 0.05;
        scene.rotation.x = Math.cos(uniforms.uTime.value * 0.12) * 0.03;

        renderer.render(scene, camera);
      };

      const startLoop = () => {
        if (isRunning || isDisposed) return;
        isRunning = true;
        clock.start();
        animate();
      };

      const stopLoop = () => {
        if (!isRunning) return;
        isRunning = false;
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      };

      // Pause render loop when tab is hidden or blurred
      const onVisibilityChange = () => {
        if (document.hidden) {
          stopLoop();
        } else {
          startLoop();
        }
      };

      const onWindowBlur = () => stopLoop();
      const onWindowFocus = () => startLoop();

      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('blur', onWindowBlur);
      window.addEventListener('focus', onWindowFocus);

      // Start initial render loop
      animate();

      // ─── 9. Kinetic Typography Entrance Reveal ────────────────────────
      const kineticSelectors = [
        '#hero-kinetic-tag',
        '#hero-kinetic-title',
        '#hero-kinetic-subtitle',
        '#hero-kinetic-trust'
      ].filter((sel) => !!document.querySelector(sel));

      if (kineticSelectors.length > 0) {
        gsap.fromTo(
          kineticSelectors,
          { opacity: 0, y: 24, filter: 'blur(5px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.05,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.15
          }
        );
      }

      // ─── Cleanup Handler ──────────────────────────────────────────────
      cleanupListeners = () => {
        stopLoop();
        if (pointerIdleTimer) clearTimeout(pointerIdleTimer);

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('blur', onWindowBlur);
        window.removeEventListener('focus', onWindowFocus);

        particleGeometry.dispose();
        particleMaterial.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();

        renderer.dispose();
        renderer.forceContextLoss();

        if (canvas.parentElement) {
          canvas.parentElement.removeChild(canvas);
        }
      };
    }).catch((err) => {
      console.warn('[GlobalWebGLBackground] Initialization deferred:', err);
    });

    return () => {
      isDisposed = true;
      cleanupListeners();
    };
  }, []);

  return (
    <div
      id="awwwards-webgl-background"
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: '#0B0F19',
      }}
    />
  );
}
