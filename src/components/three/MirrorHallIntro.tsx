'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * "Mirror Hall" intro — a ring of glowing cards standing on a dark rippling pool.
 * Each card carries one letter of SMART CHOICE. Scrolling turns the ring so the
 * cards come forward one by one while the word builds up below; at the end the
 * camera rises and the scene fades into the homepage hero.
 */

const LETTERS = ['S', 'M', 'A', 'R', 'T', 'C', 'H', 'O', 'I', 'C', 'E'];
const LABELS = [
  'Inverter ACs',
  'Refrigerators',
  'Washing Machines',
  'Smart TVs',
  'Kitchen',
  'Home Comfort',
  'Islandwide Delivery',
  'Installation',
  'Brand Warranty',
  'Honest Advice',
  'Seeduwa',
];
// hue offsets per card around the brand electric blue (deg)
const HUES = [222, 214, 230, 205, 238, 218, 226, 200, 234, 210, 222];
const N = LETTERS.length;
const DWELL_END = 0.86; // scroll fraction spent turning the ring

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ───────── Procedural "molten light" card art (canvas) ───────── */
function paintCard(letter: string, label: string, hue: number, index: number) {
  const W = 420;
  const H = 680;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;

  // Domain-warped flow field → liquid marble in brand blues with a warm accent vein
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const seed = index * 1.731 + 0.37;
  const h2rgb = (h: number, s: number, l: number) => {
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const v = y / H;
      let px = u * 3.2 + seed;
      let py = v * 5.2 - seed * 0.7;
      for (let i = 0; i < 3; i++) {
        const ox = Math.sin(py * 1.7 + seed + i * 1.3) * 0.9 + Math.sin(py * 3.1 - i) * 0.35;
        const oy = Math.cos(px * 1.5 - seed * 0.5 + i * 0.7) * 0.9 + Math.cos(px * 2.9 + i) * 0.35;
        px += ox * 0.55;
        py += oy * 0.55;
      }
      const f = 0.5 + 0.5 * Math.sin(px * 2.2 + py * 1.3);
      const band = Math.pow(Math.abs(Math.sin(px * 3.4 - py * 0.8)), 6); // thin bright veins
      const warm = Math.pow(Math.max(0, Math.sin(px * 1.1 + py * 2.3 + seed)), 14); // rare warm accent
      const l = 0.035 + f * 0.17 + band * 0.3;
      let [r, g, b] = h2rgb(hue + f * 14 - band * 18, 0.72, Math.min(0.8, l));
      r += warm * 90;
      g += warm * 60;
      b += warm * 30;
      const vign = 1 - Math.pow(Math.abs(v - 0.5) * 1.6, 3) * 0.6;
      const o = (y * W + x) * 4;
      d[o] = Math.min(255, r * vign);
      d[o + 1] = Math.min(255, g * vign);
      d[o + 2] = Math.min(255, b * vign);
      d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Darken the centre a little so the letter reads clearly
  const cg = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.7);
  cg.addColorStop(0, 'rgba(3,8,24,0.55)');
  cg.addColorStop(1, 'rgba(3,8,24,0)');
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, W, H);

  // The letter — chrome gradient with electric glow
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 330px Sora, "Plus Jakarta Sans", sans-serif';
  const lg = ctx.createLinearGradient(0, H / 2 - 170, 0, H / 2 + 170);
  lg.addColorStop(0, '#ffffff');
  lg.addColorStop(0.5, '#d8e4ff');
  lg.addColorStop(0.52, '#9fb9ff');
  lg.addColorStop(1, '#ffffff');
  ctx.shadowColor = 'rgba(90,150,255,0.95)';
  ctx.shadowBlur = 60;
  ctx.fillStyle = lg;
  ctx.fillText(letter, W / 2, H / 2 + 14);
  ctx.shadowBlur = 0;

  // Footer: index + label
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.textAlign = 'left';
  ctx.fillText(String(index + 1).padStart(2, '0'), 28, H - 40);
  ctx.textAlign = 'right';
  ctx.fillText(label.toUpperCase(), W - 28, H - 40);

  // Rounded corners + thin light edge
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const o = out.getContext('2d')!;
  const rad = 26;
  o.beginPath();
  o.roundRect(2, 2, W - 4, H - 4, rad);
  o.save();
  o.clip();
  o.drawImage(c, 0, 0);
  o.restore();
  o.strokeStyle = 'rgba(190,210,255,0.55)';
  o.lineWidth = 2;
  o.stroke();
  return out;
}

function paintLabel(text: string) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(200,215,255,0.85)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '6px';
  ctx.fillText(text.toUpperCase(), 256, 32);
  return c;
}

/* ───────── Rippling pool reflector shader ───────── */
const PoolShader = {
  name: 'PoolReflector',
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    time: { value: 0 },
    strength: { value: 1 },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec2 vPlane;
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      vPlane = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float strength;
    varying vec4 vUv;
    varying vec2 vPlane;
    void main() {
      vec2 p = vPlane;
      float d = length(p);
      // concentric ripples from the ring + slow cross waves
      float rip = sin(d * 5.5 - time * 1.6) * 0.6 + sin(p.x * 3.1 + time * 0.7) * 0.25 + sin(p.y * 4.3 - time * 0.9) * 0.25;
      vec4 uv = vUv;
      uv.x += rip * 0.035 * strength;
      uv.y += cos(d * 4.0 - time * 1.2) * 0.025 * strength;
      vec4 base = texture2DProj(tDiffuse, uv);
      // fade the reflection with distance from the ring
      float fade = 1.0 - smoothstep(4.0, 16.0, d);
      gl_FragColor = vec4(base.rgb * color * fade, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

export default function MirrorHallIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const host = hostRef.current;
    if (!section || !host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import('three');
      const { Reflector } = await import('three/examples/jsm/objects/Reflector.js');
      if (disposed) return;
      try {
        await Promise.all([document.fonts.load('800 200px Sora'), document.fonts.load('600 26px "Plus Jakarta Sans"')]);
      } catch {
        /* optional */
      }
      if (disposed) return;

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      setReduced(isReduced);

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      } catch {
        setReady(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.setClearColor('#04060d');
      const canvas = renderer.domElement;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'A ring of glowing cards spelling SMART CHOICE, reflected in a dark pool');
      Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' });
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2('#04060d', 0.035);
      const camera = new THREE.PerspectiveCamera(mobile ? 44 : 28, 1, 0.1, 90);

      /* Ring of cards */
      const RADIUS = mobile ? 4.6 : 6.6;
      const CW = 1.5;
      const CH = CW * (680 / 420);
      const cardY = CH / 2;
      const ring = new THREE.Group();
      scene.add(ring);
      const textures: InstanceType<typeof THREE.Texture>[] = [];
      const cards: { group: InstanceType<typeof THREE.Group>; mat: InstanceType<typeof THREE.MeshBasicMaterial>; glow: InstanceType<typeof THREE.MeshBasicMaterial> }[] = [];

      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = glowCanvas.height = 128;
      const gctx = glowCanvas.getContext('2d')!;
      const gg = gctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      gg.addColorStop(0, 'rgba(255,255,255,1)');
      gg.addColorStop(1, 'rgba(255,255,255,0)');
      gctx.fillStyle = gg;
      gctx.fillRect(0, 0, 128, 128);
      const glowTex = new THREE.CanvasTexture(glowCanvas);
      textures.push(glowTex);

      for (let i = 0; i < N; i++) {
        const tex = new THREE.CanvasTexture(paintCard(LETTERS[i], LABELS[i], HUES[i], i));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        textures.push(tex);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: THREE.DoubleSide });
        const card = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), mat);

        const glowMat = new THREE.MeshBasicMaterial({
          map: glowTex,
          color: new THREE.Color().setHSL(HUES[i] / 360, 0.95, 0.5),
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(CW * 2.6, CH * 1.8), glowMat);
        glow.position.z = -0.05;

        const labelTex = new THREE.CanvasTexture(paintLabel(LABELS[i]));
        labelTex.colorSpace = THREE.SRGBColorSpace;
        textures.push(labelTex);
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(CW * 1.4, CW * 1.4 * (64 / 512)),
          new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, depthWrite: false })
        );
        label.position.y = CH / 2 + 0.22;

        const g = new THREE.Group();
        g.add(glow, card, label);
        const a = (i / N) * Math.PI * 2;
        g.position.set(Math.sin(a) * RADIUS, cardY, Math.cos(a) * RADIUS);
        g.rotation.y = a; // face outwards
        ring.add(g);
        cards.push({ group: g, mat, glow: glowMat });
      }

      /* Pool */
      const pool = new Reflector(new THREE.CircleGeometry(40, 64), {
        shader: PoolShader,
        textureWidth: Math.floor(window.innerWidth * (mobile ? 0.5 : 0.75)),
        textureHeight: Math.floor(window.innerHeight * (mobile ? 0.5 : 0.75)),
        color: new THREE.Color('#8e9cc4'),
        clipBias: 0.003,
      });
      pool.rotation.x = -Math.PI / 2;
      scene.add(pool);
      const poolUniforms = (pool.material as unknown as { uniforms: Record<string, { value: number }> }).uniforms;

      // faint light ring on the water under the cards
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(RADIUS - 0.9, RADIUS + 0.9, 96),
        new THREE.MeshBasicMaterial({ map: glowTex, color: '#2f6bff', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = 0.01;
      scene.add(halo);

      // Floating light motes
      const M = mobile ? 220 : 420;
      const mp = new Float32Array(M * 3);
      for (let i = 0; i < M; i++) {
        const r = 2 + Math.random() * 14;
        const a = Math.random() * Math.PI * 2;
        mp[i * 3] = Math.cos(a) * r;
        mp[i * 3 + 1] = 0.2 + Math.random() * 6;
        mp[i * 3 + 2] = Math.sin(a) * r;
      }
      const moteGeo = new THREE.BufferGeometry();
      moteGeo.setAttribute('position', new THREE.BufferAttribute(mp, 3));
      const motes = new THREE.Points(
        moteGeo,
        new THREE.PointsMaterial({ size: 0.03, color: '#9fbaff', transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      scene.add(motes);

      /* Camera */
      const camBase = new THREE.Vector3(0, mobile ? 1.45 : 1.25, RADIUS + (mobile ? 9.5 : 12.5));
      const target = new THREE.Vector3(0, cardY * (mobile ? 0.95 : 1.02), RADIUS - 2);
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (!isReduced && !mobile) window.addEventListener('pointermove', onPointer, { passive: true });

      /* Scroll */
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
      let rot = 0;
      let lastActive = -1;
      let raf = 0;
      const step = (Math.PI * 2) / N;
      const camPos = new THREE.Vector3();

      const frame = () => {
        timer.update();
        const t = timer.getElapsed();
        const p = isReduced ? 0 : progress;

        // card index follows scroll with a gentle "settle" on each card
        const raw = clamp(p / DWELL_END) * (N - 1);
        const base = Math.floor(raw);
        const frac = raw - base;
        const settled = base + easeInOut(clamp((frac - 0.2) / 0.6));
        const targetRot = -settled * step;
        rot += (targetRot - rot) * 0.08;
        ring.rotation.y = rot + (isReduced ? 0 : Math.sin(t * 0.3) * 0.01);

        const idx = Math.round(clamp(-rot / step, 0, N - 1));
        if (idx !== lastActive) {
          lastActive = idx;
          setActive(idx);
        }

        // emphasise the card facing the camera
        cards.forEach((c, i) => {
          const a = i * step + rot;
          const facing = Math.cos(a); // 1 = front
          const k = clamp((facing - 0.55) / 0.45);
          c.glow.opacity = Math.max(0, 0.03 + k * 0.6 + Math.sin(t * 1.5 + i) * 0.03 * k);
          c.group.position.y = cardY + k * 0.12 + Math.sin(t * 0.9 + i * 0.8) * 0.03;
          c.group.scale.setScalar(0.94 + k * 0.1);
        });

        // outro: rise + pull back, then fade into the hero
        const out = isReduced ? 0 : easeInOut(clamp((p - DWELL_END) / (1 - DWELL_END)));
        pointer.sx += (pointer.x - pointer.sx) * 0.05;
        pointer.sy += (pointer.y - pointer.sy) * 0.05;
        camPos.copy(camBase);
        camPos.x += pointer.sx * 0.9;
        camPos.y += -pointer.sy * 0.35 + out * 5.5;
        camPos.z += out * 4;
        camera.position.copy(camPos);
        camera.lookAt(target.x, target.y - out * 1.2, target.z - out * 3);

        poolUniforms.time.value = t;
        motes.rotation.y = t * 0.015;
        renderer.render(scene, camera);

        if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(p / 0.05));
        if (skipRef.current) {
          const o = 1 - clamp((p - 0.85) / 0.08);
          skipRef.current.style.opacity = String(o);
          skipRef.current.style.pointerEvents = o < 0.1 ? 'none' : 'auto';
        }
        if (fadeRef.current) fadeRef.current.style.opacity = String(clamp((p - 0.92) / 0.08));
      };

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        frame();
      };
      loop();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('scroll', readProgress);
        window.removeEventListener('pointermove', onPointer);
        ro.disconnect();
        io.disconnect();
        scene.traverse((o) => {
          const m = o as unknown as { geometry?: { dispose: () => void }; material?: { dispose: () => void } };
          m.geometry?.dispose();
          m.material?.dispose();
        });
        (pool as unknown as { dispose?: () => void }).dispose?.();
        textures.forEach((x) => x.dispose());
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

  const word = 'SMART CHOICE';
  // number of letters (ignoring the space) revealed so far
  const shown = reduced ? N : active + 1;

  return (
    <section
      ref={sectionRef}
      aria-label="Smart Choice intro"
      className="relative -mt-[76px] h-[520vh] bg-[#04060d] motion-reduce:h-screen"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={hostRef} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />

        {/* Edge vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(4,6,13,0.9)_100%)]" />

        {/* Top title */}
        <div className="pointer-events-none absolute inset-x-0 top-[96px] text-center text-white sm:top-[110px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-white/45 sm:text-[11px]">Smart Choice LK · Seeduwa</p>
          <h2 className="mt-3 font-display text-3xl font-light tracking-[-0.02em] text-white/95 sm:text-5xl">
            Choose smart. <span className="text-white/50">Live better.</span>
          </h2>
        </div>

        {/* Bottom: counter, building word, dots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[84px] text-center text-white sm:bottom-[72px]">
          <p className="text-xs font-semibold tabular-nums tracking-[0.3em] text-white/50">
            {String(active + 1).padStart(2, '0')} <span className="text-white/25">/ {String(N).padStart(2, '0')}</span>
          </p>
          <p aria-label="Smart Choice" className="mt-2 font-display text-4xl font-light tracking-[0.18em] sm:text-6xl">
            {word.split('').map((ch, i) => {
              const letterIdx = word.slice(0, i + 1).replace(/ /g, '').length; // 1-based among letters
              const on = ch === ' ' || letterIdx <= shown;
              return (
                <span
                  key={i}
                  aria-hidden
                  className={`inline-block transition-all duration-500 ${on ? 'text-white [text-shadow:0_0_24px_rgba(80,140,255,0.8)]' : 'text-white/[0.12]'}`}
                >
                  {ch === ' ' ? ' ' : ch}
                </span>
              );
            })}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-300">{LABELS[active]}</p>
          <div className="mt-4 flex justify-center gap-1.5">
            {LETTERS.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/25'}`} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">
          Scroll
        </div>
        <button
          ref={skipRef}
          onClick={skip}
          className="absolute bottom-6 left-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold text-white/70 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
        >
          Skip intro <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {/* Final fade into the hero */}
        <div ref={fadeRef} className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
      </div>
    </section>
  );
}
