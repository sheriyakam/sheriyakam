import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

/**
 * ThreeCircuitCanvas
 * Renders an interactive 3D WebGL electrical node grid using Three.js on Web.
 * Safely falls back on native platforms and during SSR / static generation.
 */
export default function ThreeCircuitCanvas({ style, interactive = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !mountRef.current) {
      return;
    }

    let renderer;
    let scene;
    let camera;
    let animationFrameId;
    let particlesMesh;
    let linesMesh;
    let pointLight;
    let isDisposed = false;

    // Async import Three.js safely for Web runtime
    import('three').then((THREE) => {
      if (isDisposed || !mountRef.current) return;

      const width = mountRef.current.clientWidth || window.innerWidth;
      const height = mountRef.current.clientHeight || 500;

      // 1. Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 85;

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);

      // Append canvas
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // 3. Ambient & Point Lighting
      const ambientLight = new THREE.AmbientLight(0x0a192f, 1.5);
      scene.add(ambientLight);

      pointLight = new THREE.PointLight(0x06b6d4, 3, 120);
      pointLight.position.set(0, 0, 40);
      scene.add(pointLight);

      const goldLight = new THREE.PointLight(0xf59e0b, 2.5, 120);
      goldLight.position.set(30, -20, 30);
      scene.add(goldLight);

      // 4. Electrical Grid Nodes & Network
      const nodeCount = 48;
      const positions = new Float32Array(nodeCount * 3);
      const colors = new Float32Array(nodeCount * 3);
      const nodes = [];

      for (let i = 0; i < nodeCount; i++) {
        const x = (Math.random() - 0.5) * 120;
        const y = (Math.random() - 0.5) * 65;
        const z = (Math.random() - 0.5) * 35;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Alternate cyan / electric gold / white
        const isGold = i % 3 === 0;
        colors[i * 3] = isGold ? 0.96 : 0.05;
        colors[i * 3 + 1] = isGold ? 0.62 : 0.71;
        colors[i * 3 + 2] = isGold ? 0.05 : 0.83;

        nodes.push(new THREE.Vector3(x, y, z));
      }

      // Point cloud for nodes
      const particlesGeo = new THREE.BufferGeometry();
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particlesMat = new THREE.PointsMaterial({
        size: 3.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      particlesMesh = new THREE.Points(particlesGeo, particlesMat);
      scene.add(particlesMesh);

      // 5. Interconnecting circuit lines (high-voltage conduits)
      const linePositions = [];
      const lineColors = [];

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodes[i].distanceTo(nodes[j]);
          if (dist < 26) {
            linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
            linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);

            const alpha = 1.0 - dist / 26;
            lineColors.push(0.04 * alpha, 0.45 * alpha, 0.7 * alpha);
            lineColors.push(0.04 * alpha, 0.45 * alpha, 0.7 * alpha);
          }
        }
      }

      const linesGeo = new THREE.BufferGeometry();
      linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      linesGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const linesMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      linesMesh = new THREE.LineSegments(linesGeo, linesMat);
      scene.add(linesMesh);

      // 6. Interactive Mouse Tracking
      let targetMouseX = 0;
      let targetMouseY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;

      const handleMouseMove = (e) => {
        if (!interactive) return;
        const rect = mountRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        targetMouseX = (x - 0.5) * 2;
        targetMouseY = -(y - 0.5) * 2;
      };

      if (interactive) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
      }

      // 7. Resize Observer
      const handleResize = () => {
        if (!mountRef.current || !renderer || !camera) return;
        const newW = mountRef.current.clientWidth || window.innerWidth;
        const newH = mountRef.current.clientHeight || 500;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      // 8. Animation loop
      let clock = new THREE.Clock();

      const animate = () => {
        if (isDisposed) return;
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse damping
        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;

        if (particlesMesh) {
          particlesMesh.rotation.y = elapsedTime * 0.04 + currentMouseX * 0.3;
          particlesMesh.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1 + currentMouseY * 0.2;
        }

        if (linesMesh) {
          linesMesh.rotation.y = elapsedTime * 0.04 + currentMouseX * 0.3;
          linesMesh.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1 + currentMouseY * 0.2;
        }

        if (pointLight) {
          pointLight.position.x = currentMouseX * 45;
          pointLight.position.y = currentMouseY * 30;
          pointLight.intensity = 2.5 + Math.sin(elapsedTime * 4) * 0.8; // Voltage shimmer pulse
        }

        renderer.render(scene, camera);
      };

      animate();
    }).catch((err) => {
      console.warn('[ThreeCircuitCanvas] Three.js initialization fallback:', err);
    });

    return () => {
      isDisposed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
      }
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [interactive]);

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.nativeFallbackGrid} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  nativeFallbackGrid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 8, 20, 0.4)',
  }
});
