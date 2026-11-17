'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Real-time Three.js scene behind the hero product:
 * chrome orbit rings, floating chrome shapes and an electric particle field.
 * - three.js is code-split (dynamic import) so it never blocks first paint
 * - pauses when off-screen or the tab is hidden
 * - DPR capped, low segment counts for background geometry
 * - reduced motion: renders a single still frame
 * - pointer parallax + scroll-linked rotation (GSAP ScrollTrigger)
 */
export default function HeroScene({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import('three');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      const gsapMod = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);
      if (disposed) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;

      // Renderer
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return; // WebGL unavailable → CSS fallback stays visible
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'Animated 3D chrome rings and light particles around the featured appliance');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.2, 9);

      const ELECTRIC = new THREE.Color('#2F6BFF');
      const GLOW = new THREE.Color('#38BDF8');

      const world = new THREE.Group();
      scene.add(world);

      // Chrome orbit rings (hero objects → higher segment count)
      const chrome = new THREE.MeshStandardMaterial({ color: '#dfe7ff', metalness: 1, roughness: 0.12 });
      const electricMat = new THREE.MeshStandardMaterial({
        color: ELECTRIC,
        emissive: ELECTRIC,
        emissiveIntensity: 2.2,
        metalness: 0.4,
        roughness: 0.3,
      });
      const rings: InstanceType<typeof THREE.Mesh>[] = [];
      const ringSpecs = [
        { r: 3.3, t: 0.055, mat: chrome, rot: [1.25, 0.15, 0] },
        { r: 2.75, t: 0.03, mat: electricMat, rot: [1.05, -0.5, 0.3] },
        { r: 3.8, t: 0.02, mat: electricMat, rot: [1.45, 0.6, -0.2] },
      ] as const;
      ringSpecs.forEach((s) => {
        const m = new THREE.Mesh(new THREE.TorusGeometry(s.r, s.t, 24, 160), s.mat);
        m.rotation.set(s.rot[0], s.rot[1], s.rot[2]);
        world.add(m);
        rings.push(m);
      });

      // Floating chrome shapes orbiting the product
      const floaters: { mesh: InstanceType<typeof THREE.Mesh>; radius: number; speed: number; phase: number; y: number }[] = [];
      const shapeGeos = [
        new THREE.IcosahedronGeometry(0.32, 1),
        new THREE.SphereGeometry(0.22, 24, 24),
        new THREE.CapsuleGeometry(0.12, 0.42, 8, 16),
        new THREE.TorusGeometry(0.2, 0.07, 12, 32),
        new THREE.OctahedronGeometry(0.26, 0),
      ];
      for (let i = 0; i < 7; i++) {
        const mat = i % 3 === 0 ? electricMat : chrome;
        const mesh = new THREE.Mesh(shapeGeos[i % shapeGeos.length], mat);
        const f = { mesh, radius: 2.6 + Math.random() * 1.6, speed: 0.12 + Math.random() * 0.16, phase: (i / 7) * Math.PI * 2, y: (Math.random() - 0.5) * 2.4 };
        world.add(mesh);
        floaters.push(f);
      }

      // Particle field (background → cheap points)
      const COUNT = coarse ? 700 : 1400;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const r = 3 + Math.random() * 6;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
        positions[i * 3 + 1] = r * Math.cos(ph) * 0.6;
        positions[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
        const c = Math.random() > 0.5 ? ELECTRIC : GLOW;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const pMat = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // Lights
      scene.add(new THREE.AmbientLight('#8fb0ff', 0.35));
      const key = new THREE.PointLight(ELECTRIC, 40, 20);
      key.position.set(-3, 2, 4);
      scene.add(key);
      const rim = new THREE.PointLight(GLOW, 25, 20);
      rim.position.set(4, -1, 3);
      scene.add(rim);

      // Sizing
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // Pointer parallax (desktop)
      const pointer = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (!coarse && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

      // Scroll-linked rotation & dolly as the hero leaves the viewport
      const scrollState = { spin: 0, zoom: 0 };
      let st: { kill: () => void } | undefined;
      if (!reduced) {
        const tween = gsap.to(scrollState, {
          spin: Math.PI * 0.9,
          zoom: 2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: host.closest('section') ?? host,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
        st = tween.scrollTrigger ?? undefined;
      }

      // Visibility → pause rendering
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);

      const timer = new THREE.Timer();
      let raf = 0;
      const renderFrame = () => {
        timer.update();
        const t = timer.getElapsed();
        rings[0].rotation.z = t * 0.12;
        rings[1].rotation.z = -t * 0.18;
        rings[2].rotation.z = t * 0.08;
        floaters.forEach((f, i) => {
          const a = f.phase + t * f.speed;
          f.mesh.position.set(Math.cos(a) * f.radius, f.y + Math.sin(t * 0.8 + i) * 0.25, Math.sin(a) * f.radius * 0.55);
          f.mesh.rotation.x = t * 0.6 + i;
          f.mesh.rotation.y = t * 0.4 + i;
        });
        particles.rotation.y = t * 0.025;

        const targetX = pointer.y * 0.18;
        const targetY = pointer.x * 0.3 + scrollState.spin;
        world.rotation.x += (targetX - world.rotation.x) * 0.05;
        world.rotation.y += (targetY - world.rotation.y) * 0.05;
        camera.position.z = 9 + scrollState.zoom;
        renderer.render(scene, camera);
      };

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        renderFrame();
      };

      if (reduced) {
        renderFrame();
      } else {
        loop();
      }
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onPointer);
        ro.disconnect();
        io.disconnect();
        st?.kill();
        scene.traverse((o) => {
          const m = o as unknown as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | { dispose: () => void }[] };
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
          else m.material?.dispose();
        });
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={hostRef} className={`transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'} ${className}`} />
  );
}
