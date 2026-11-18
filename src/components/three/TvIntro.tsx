'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Scroll-driven 3D intro:
 *  1. A dark living room with a large curved TV showing "SMART CHOICE" (ambilight glow, glossy floor).
 *  2. As you scroll, the letters dissolve one by one (fade + blur + drift).
 *  3. The camera then dives into the screen and the page fades into the hero.
 *
 * The section is tall (scroll distance) with a sticky full-screen canvas inside.
 * three.js is code-split; rendering pauses off-screen; reduced motion → no dive, text stays.
 */

const WORD = 'SMART CHOICE';
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function TvIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const host = hostRef.current;
    if (!section || !host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import('three');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      const { Reflector } = await import('three/examples/jsm/objects/Reflector.js');
      if (disposed) return;
      try {
        await Promise.all([document.fonts.load('800 200px Sora'), document.fonts.load('600 60px "Plus Jakarta Sans"')]);
      } catch {
        /* fonts optional */
      }
      if (disposed) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mobile = window.matchMedia('(max-width: 767px)').matches;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      } catch {
        setReady(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor('#03060f');
      const canvas = renderer.domElement;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'A large curved TV in a dark living room showing the words Smart Choice');
      Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' });
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog('#03060f', 14, 30);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.25;

      const camera = new THREE.PerspectiveCamera(mobile ? 55 : 36, 1, 0.05, 60);

      /* ───────── Screen texture (canvas) ───────── */
      const TW = 2048;
      const TH = 1024;
      const tc = document.createElement('canvas');
      tc.width = TW;
      tc.height = TH;
      const ctx = tc.getContext('2d')!;
      const screenTex = new THREE.CanvasTexture(tc);
      screenTex.colorSpace = THREE.SRGBColorSpace;
      screenTex.anisotropy = 8;

      const letters = WORD.split('');
      ctx.font = '800 250px Sora, "Plus Jakarta Sans", sans-serif';
      const widths = letters.map((ch) => ctx.measureText(ch).width);
      const spacing = 10;
      const totalW = widths.reduce((a, b) => a + b, 0) + spacing * (letters.length - 1);

      const drawScreen = (p: number, t: number) => {
        // Background: deep electric gradient with slow light sweep
        const g = ctx.createLinearGradient(0, 0, TW, TH);
        g.addColorStop(0, '#040a1f');
        g.addColorStop(0.5, '#0a1c4d');
        g.addColorStop(1, '#040a1f');
        ctx.globalAlpha = 1;
        ctx.filter = 'none';
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, TW, TH);

        const glow = ctx.createRadialGradient(TW / 2, TH / 2, 50, TW / 2, TH / 2, TW * 0.55);
        glow.addColorStop(0, `rgba(47,107,255,${0.55 + 0.1 * Math.sin(t * 1.3)})`);
        glow.addColorStop(1, 'rgba(47,107,255,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, TW, TH);

        // Sweep
        const sx = ((t * 0.18) % 1.6) * TW * 1.2 - TW * 0.4;
        const sweep = ctx.createLinearGradient(sx - 300, 0, sx + 300, 0);
        sweep.addColorStop(0, 'rgba(255,255,255,0)');
        sweep.addColorStop(0.5, 'rgba(160,200,255,0.10)');
        sweep.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sweep;
        ctx.fillRect(0, 0, TW, TH);

        // Fine scanlines
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        for (let y = 0; y < TH; y += 6) ctx.fillRect(0, y, TW, 2);

        // Letters dissolve one by one between p = 0.04 and ~0.42
        let x = (TW - totalW) / 2;
        const baseY = TH / 2 + 70;
        ctx.textBaseline = 'alphabetic';
        ctx.font = '800 250px Sora, "Plus Jakarta Sans", sans-serif';
        letters.forEach((ch, i) => {
          const w = widths[i];
          const order = [5, 4, 6, 3, 7, 2, 8, 1, 9, 0, 10, 11][i] ?? i; // dissolve from the middle outwards
          const lt = reduced ? 0 : clamp((p - 0.04 - order * 0.022) / 0.13);
          const k = ease(lt);
          if (k < 0.999 && ch !== ' ') {
            ctx.save();
            ctx.globalAlpha = 1 - k;
            ctx.filter = k > 0.01 ? `blur(${k * 26}px)` : 'none';
            const cx = x + w / 2;
            ctx.translate(cx, baseY - k * 140 + Math.sin(i * 1.7) * k * 40);
            ctx.scale(1 + k * 0.5, 1 + k * 0.5);
            const lg = ctx.createLinearGradient(0, -200, 0, 20);
            lg.addColorStop(0, '#ffffff');
            lg.addColorStop(0.6, '#cfe0ff');
            lg.addColorStop(1, '#7ea6ff');
            ctx.shadowColor = 'rgba(80,140,255,0.9)';
            ctx.shadowBlur = 50;
            ctx.fillStyle = lg;
            ctx.fillText(ch, -w / 2, 0);
            ctx.restore();
          }
          x += w + spacing;
        });

        // Tagline fades first
        const tagT = reduced ? 0 : clamp((p - 0.02) / 0.1);
        if (tagT < 1) {
          ctx.save();
          ctx.globalAlpha = (1 - tagT) * 0.85;
          ctx.filter = 'none';
          ctx.font = '600 64px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#9fbaff';
          ctx.textAlign = 'center';
          (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '18px';
          ctx.fillText('CHOOSE SMART · LIVE BETTER', TW / 2, baseY + 150);
          ctx.restore();
        }

        // After the letters are gone the screen brightens before the dive
        const bright = reduced ? 0 : clamp((p - 0.5) / 0.4);
        if (bright > 0) {
          ctx.save();
          const bg = ctx.createRadialGradient(TW / 2, TH / 2, 0, TW / 2, TH / 2, TW * 0.7);
          bg.addColorStop(0, `rgba(120,170,255,${0.85 * bright})`);
          bg.addColorStop(1, `rgba(20,60,200,${0.6 * bright})`);
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, TW, TH);
          ctx.restore();
        }
        screenTex.needsUpdate = true;
      };

      /* ───────── Room ───────── */
      const room = new THREE.Group();
      scene.add(room);

      const wallMat = new THREE.MeshStandardMaterial({ color: '#0a1126', roughness: 0.95, metalness: 0 });
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), wallMat);
      wall.position.set(0, 4, -3.2);
      room.add(wall);

      // Vertical wall slats for texture
      const slatMat = new THREE.MeshStandardMaterial({ color: '#0c1530', roughness: 0.7, metalness: 0.1 });
      const slatGeo = new THREE.BoxGeometry(0.16, 9, 0.12);
      for (let i = -24; i <= 24; i++) {
        if (Math.abs(i) < 2) continue;
        const s = new THREE.Mesh(slatGeo, slatMat);
        s.position.set(i * 0.42, 2.5, -3.1);
        room.add(s);
      }

      // Glossy floor: real reflection (desktop) under a dark translucent layer
      const floorY = -2.55;
      if (!mobile) {
        const mirror = new Reflector(new THREE.PlaneGeometry(60, 30), {
          textureWidth: Math.floor(window.innerWidth * 0.5),
          textureHeight: Math.floor(window.innerHeight * 0.5),
          color: new THREE.Color('#7a8299'),
        });
        mirror.rotation.x = -Math.PI / 2;
        mirror.position.y = floorY - 0.01;
        room.add(mirror);
      }
      const floorTop = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 30),
        new THREE.MeshStandardMaterial({ color: '#050913', roughness: mobile ? 0.8 : 0.35, metalness: mobile ? 0.1 : 0.4, transparent: true, opacity: mobile ? 1 : 0.82 })
      );
      floorTop.rotation.x = -Math.PI / 2;
      floorTop.position.y = floorY;
      room.add(floorTop);

      // Low TV console with LED strip
      const consoleMat = new THREE.MeshStandardMaterial({ color: '#0d1222', roughness: 0.45, metalness: 0.3 });
      const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.55, 1.4), consoleMat);
      consoleBox.position.set(0, floorY + 0.3, -2.1);
      room.add(consoleBox);
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(9.3, 0.03, 0.03),
        new THREE.MeshBasicMaterial({ color: '#4f86ff' })
      );
      led.position.set(0, floorY + 0.05, -1.39);
      room.add(led);

      /* ───────── Curved TV ───────── */
      const tv = new THREE.Group();
      tv.position.set(0, 0.55, -1.6);
      room.add(tv);

      const R = 11; // curvature radius
      const SW = 7.6; // screen width (arc length)
      const SH = SW * (9 / 16);
      const arc = SW / R;
      const screenGeo = new THREE.CylinderGeometry(R, R, SH, 96, 1, true, Math.PI - arc / 2, arc);
      const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.BackSide, toneMapped: false });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.z = R; // arc centre sits in front, so the screen curves towards the viewer
      screen.scale.x = -1; // un-mirror the texture when viewed from inside
      tv.add(screen);

      const bezelArc = (SW + 0.16) / R;
      const bezel = new THREE.Mesh(
        new THREE.CylinderGeometry(R + 0.03, R + 0.03, SH + 0.16, 96, 1, true, Math.PI - bezelArc / 2, bezelArc),
        new THREE.MeshStandardMaterial({ color: '#0b0e16', roughness: 0.3, metalness: 0.8, side: THREE.DoubleSide })
      );
      bezel.position.z = R;
      tv.add(bezel);

      const backArc = (SW - 0.6) / R;
      const back = new THREE.Mesh(
        new THREE.CylinderGeometry(R + 0.35, R + 0.35, SH - 0.6, 64, 1, true, Math.PI - backArc / 2, backArc),
        new THREE.MeshStandardMaterial({ color: '#141a2a', roughness: 0.4, metalness: 0.7, side: THREE.DoubleSide })
      );
      back.position.z = R;
      tv.add(back);

      // Chrome stand
      const chrome = new THREE.MeshStandardMaterial({ color: '#c9d4ee', roughness: 0.15, metalness: 1 });
      // stand from the screen bottom down to the console top
      const consoleTop = floorY + 0.575 - tv.position.y; // in TV-local space
      const neckH = Math.max(0.15, -SH / 2 - consoleTop);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.55, neckH, 0.12), chrome);
      neck.position.set(0, -SH / 2 - neckH / 2, -0.35);
      tv.add(neck);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.8), chrome);
      foot.position.set(0, consoleTop + 0.025, -0.4);
      tv.add(foot);

      // Tower speakers either side (chrome trim + blue LED)
      const spkMat = new THREE.MeshStandardMaterial({ color: '#0b0f1c', roughness: 0.35, metalness: 0.6 });
      const coneMat = new THREE.MeshStandardMaterial({ color: '#151b2e', roughness: 0.6, metalness: 0.3 });
      [-1, 1].forEach((side) => {
        const g = new THREE.Group();
        g.position.set(side * 6.2, floorY, -1.6);
        g.rotation.y = -side * 0.25;
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.6, 0.9), spkMat);
        body.position.y = 1.8;
        g.add(body);
        [2.9, 2.0, 1.0].forEach((y, k) => {
          const cone = new THREE.Mesh(new THREE.CylinderGeometry(k === 0 ? 0.16 : 0.3, k === 0 ? 0.16 : 0.3, 0.06, 32), coneMat);
          cone.rotation.x = Math.PI / 2;
          cone.position.set(0, y, 0.46);
          g.add(cone);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(k === 0 ? 0.17 : 0.31, 0.012, 8, 48), chrome);
          ring.position.set(0, y, 0.49);
          g.add(ring);
        });
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.02, 3.2, 0.02), new THREE.MeshBasicMaterial({ color: '#3d74ff' }));
        strip.position.set(side * -0.44, 1.8, 0.46);
        g.add(strip);
        room.add(g);
      });

      // Ceiling light strip
      const ceiling = new THREE.Mesh(new THREE.BoxGeometry(12, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: '#6f95ff' }));
      ceiling.position.set(0, 6.2, -2.9);
      room.add(ceiling);

      // Ambilight: soft coloured light bleeding onto the wall behind the TV
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = glowCanvas.height = 256;
      const gctx = glowCanvas.getContext('2d')!;
      const rg = gctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      rg.addColorStop(0, 'rgba(255,255,255,1)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      gctx.fillStyle = rg;
      gctx.fillRect(0, 0, 256, 256);
      const glowTex = new THREE.CanvasTexture(glowCanvas);
      const ambiMat = new THREE.MeshBasicMaterial({
        map: glowTex,
        color: '#2f6bff',
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ambi = new THREE.Mesh(new THREE.PlaneGeometry(SW * 2.3, SH * 2.6), ambiMat);
      ambi.position.set(0, 0.55, -3.05);
      room.add(ambi);

      // Screen light spill
      const spill = new THREE.PointLight('#4d7dff', 30, 14, 1.6);
      spill.position.set(0, 0.6, 0.8);
      scene.add(spill);
      scene.add(new THREE.AmbientLight('#7f9cff', 0.12));
      const top = new THREE.SpotLight('#9fb8ff', 40, 18, 0.5, 0.7);
      top.position.set(0, 8, 2);
      top.target.position.set(0, 0, -2);
      scene.add(top, top.target);

      // Dust in the light
      const DUST = mobile ? 250 : 500;
      const dpos = new Float32Array(DUST * 3);
      for (let i = 0; i < DUST; i++) {
        dpos[i * 3] = (Math.random() - 0.5) * 14;
        dpos[i * 3 + 1] = Math.random() * 7 - 2.5;
        dpos[i * 3 + 2] = Math.random() * 6 - 2.5;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
      const dust = new THREE.Points(
        dustGeo,
        new THREE.PointsMaterial({ size: 0.025, color: '#9fbaff', transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      scene.add(dust);

      /* ───────── Camera path ───────── */
      const screenCenter = new THREE.Vector3(0, 0.55, -1.6);
      const startPos = new THREE.Vector3(0, mobile ? 0.55 : 1.6, mobile ? 12 : 13.5);
      const camPos = new THREE.Vector3();
      const lookAt = new THREE.Vector3();
      const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (!reduced && !mobile) window.addEventListener('pointermove', onPointer, { passive: true });

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // keep the whole TV in frame on narrow screens
        const needed = (SW * (mobile ? 1.06 : 1.35)) / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.aspect;
        startPos.z = Math.max(mobile ? 6 : 13.5, needed - 1.6);
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      /* ───────── Scroll progress ───────── */
      let progress = 0;
      const readProgress = () => {
        const r = section.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        progress = total > 0 ? clamp(-r.top / total) : 0;
      };
      readProgress();
      window.addEventListener('scroll', readProgress, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(section);

      const timer = new THREE.Timer();
      let raf = 0;
      let lastDraw = -1;
      let lastP = -1;

      const frame = () => {
        timer.update();
        const t = timer.getElapsed();
        const p = progress;

        // Redraw the screen texture at ~30fps or when scroll changes
        if (p !== lastP || t - lastDraw > 1 / 30) {
          drawScreen(p, t);
          lastDraw = t;
          lastP = p;
        }

        // Camera: gentle drift, then dive into the screen (p 0.5 → 1)
        const dive = reduced ? 0 : easeInOut(clamp((p - 0.48) / 0.5));
        pointer.sx += (pointer.x - pointer.sx) * 0.05;
        pointer.sy += (pointer.y - pointer.sy) * 0.05;
        const orbit = (1 - dive) * (reduced ? 0 : 1);
        camPos.set(
          startPos.x + pointer.sx * 0.8 * orbit + Math.sin(t * 0.25) * 0.15 * orbit,
          startPos.y - pointer.sy * 0.4 * orbit,
          startPos.z
        );
        camPos.lerp(new THREE.Vector3(0, screenCenter.y, screenCenter.z + 0.35), dive);
        camera.position.copy(camPos);
        lookAt.copy(screenCenter).setY(screenCenter.y + (1 - dive) * (mobile ? 0 : -0.35));
        camera.lookAt(lookAt);

        ambiMat.opacity = 0.75 + 0.15 * Math.sin(t * 1.3) + dive * 0.4;
        spill.intensity = 30 + dive * 60;
        dust.rotation.y = t * 0.02;

        renderer.render(scene, camera);

        // DOM overlays
        if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(p / 0.06));
        if (skipRef.current) {
          const o = 1 - clamp((p - 0.82) / 0.1);
          skipRef.current.style.opacity = String(o);
          skipRef.current.style.pointerEvents = o < 0.1 ? 'none' : 'auto';
        }
        if (fadeRef.current) fadeRef.current.style.opacity = String(reduced ? 0 : clamp((p - 0.86) / 0.12));
      };

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        frame();
      };
      if (reduced) {
        frame();
        window.addEventListener('scroll', frame, { passive: true });
      } else {
        loop();
      }
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('scroll', readProgress);
        window.removeEventListener('scroll', frame);
        window.removeEventListener('pointermove', onPointer);
        ro.disconnect();
        io.disconnect();
        scene.traverse((o) => {
          const m = o as unknown as {
            geometry?: { dispose: () => void };
            material?: { dispose: () => void } | { dispose: () => void }[];
            dispose?: () => void;
          };
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
          else m.material?.dispose();
        });
        screenTex.dispose();
        glowTex.dispose();
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

  const skip = () => {
    const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Smart Choice intro"
      className="relative -mt-[76px] h-[280vh] bg-[#03060f] motion-reduce:h-screen"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Fallback / loading state: CSS-only TV silhouette with the wordmark */}
        <div
          className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden={ready}
        >
          <div className="relative aspect-video w-[78vw] max-w-[1000px] rounded-[14px] border-[6px] border-[#0b0e16] bg-gradient-to-br from-[#040a1f] via-[#0a1c4d] to-[#040a1f] shadow-[0_0_120px_20px_rgba(47,107,255,0.35)]">
            <p className="absolute inset-0 grid place-items-center font-display text-[8vw] font-extrabold tracking-tight text-white [text-shadow:0_0_40px_rgba(80,140,255,0.9)] lg:text-[96px]">
              SMART CHOICE
            </p>
          </div>
        </div>

        <div ref={hostRef} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,6,15,0.85)_100%)]" />

        {/* Scroll hint + skip */}
        <div ref={hintRef} className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-white/70">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Scroll to enter</span>
          <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-white/30 pt-2">
            <span className="h-2 w-1 animate-bounce rounded-full bg-white/80" />
          </span>
        </div>
        <button
          ref={skipRef}
          onClick={skip}
          className="absolute bottom-8 left-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold text-white/70 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
        >
          Skip intro <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {/* Final fade into the hero (same colour as the hero background) */}
        <div ref={fadeRef} className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
      </div>
    </section>
  );
}
