'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
const RING_END = 0.5; // scroll fraction spent turning the ring
const ASM_END = 0.72; // by here the cards have risen into a row spelling the name
// The last screen-height of scroll is the hand-off: SMART and CHOICE part to the sides,
// and the home page (pulled up underneath) opens out from the middle.
const BG = '#050B1A'; // = tailwind `ink`, so the intro melts into the hero with no seam

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

  // Domain-warped flow field → liquid marble in brand blues with a warm accent vein.
  // The marble is smooth, so it is computed at 1/3 size and scaled up: ~9× less
  // work on the main thread with no visible difference.
  const SW = Math.round(W / 3);
  const SH = Math.round(H / 3);
  const small = document.createElement('canvas');
  small.width = SW;
  small.height = SH;
  const sctx = small.getContext('2d')!;
  const img = sctx.createImageData(SW, SH);
  const d = img.data;
  const seed = index * 1.731 + 0.37;
  const h2rgb = (h: number, s: number, l: number) => {
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  };
  for (let y = 0; y < SH; y++) {
    for (let x = 0; x < SW; x++) {
      const u = x / SW;
      const v = y / SH;
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
      const o = (y * SW + x) * 4;
      d[o] = Math.min(255, r * vign);
      d[o + 1] = Math.min(255, g * vign);
      d[o + 2] = Math.min(255, b * vign);
      d[o + 3] = 255;
    }
  }
  sctx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(small, 0, 0, W, H);

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
  ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
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
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
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
    bg: { value: null },
    fadeOut: { value: 0 },
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
    uniform vec3 bg;
    uniform float fadeOut;
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
      // sit on the page colour (not pure black) so the horizon never shows a seam
      gl_FragColor = vec4(bg + base.rgb * color * fade * (1.0 - fadeOut), 1.0);
      #include <colorspace_fragment>
    }`,
};

export default function MirrorHallIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const host = hostRef.current;
    if (!section || !host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    if (section.getBoundingClientRect().bottom > window.innerHeight) document.documentElement.dataset.intro = 'on';

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
      renderer.setClearColor(BG);
      const canvas = renderer.domElement;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'A ring of glowing cards spelling SMART CHOICE, reflected in a dark pool');
      Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' });
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(BG, 0.035);
      const camera = new THREE.PerspectiveCamera(mobile ? 44 : 28, 1, 0.1, 90);

      /* Ring of cards */
      const RADIUS = mobile ? 4.6 : 6.6;
      const CW = 1.5;
      const CH = CW * (680 / 420);
      const cardY = CH / 2;
      const textures: InstanceType<typeof THREE.Texture>[] = [];
      type Mat = InstanceType<typeof THREE.MeshBasicMaterial>;
      const cards: { group: InstanceType<typeof THREE.Group>; card: Mat; glow: Mat; label: Mat }[] = [];

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
        // let the browser paint (title animation, scroll) between cards
        await new Promise((r) => setTimeout(r, 0));
        if (disposed) {
          renderer.dispose();
          canvas.remove();
          return;
        }
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
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, depthWrite: false });
        const label = new THREE.Mesh(new THREE.PlaneGeometry(CW * 1.4, CW * 1.4 * (64 / 512)), labelMat);
        label.position.y = CH / 2 + 0.22;

        const g = new THREE.Group();
        g.add(glow, card, label);
        scene.add(g); // placed every frame: on the ring, then flown into the name row
        cards.push({ group: g, card: mat, glow: glowMat, label: labelMat });
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
      const poolUniforms = (pool.material as unknown as { uniforms: Record<string, { value: unknown }> }).uniforms;
      poolUniforms.bg.value = new THREE.Color(BG);

      // faint light ring on the water under the cards
      const haloMat = new THREE.MeshBasicMaterial({ map: glowTex, color: '#2f6bff', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
      const halo = new THREE.Mesh(new THREE.RingGeometry(RADIUS - 0.9, RADIUS + 0.9, 96), haloMat);
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
      const moteMat = new THREE.PointsMaterial({ size: 0.03, color: '#9fbaff', transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
      const motes = new THREE.Points(moteGeo, moteMat);
      scene.add(motes);

      /* Camera */
      const camBase = new THREE.Vector3(0, mobile ? 1.45 : 1.25, RADIUS + (mobile ? 9.5 : 12.5));
      const target = new THREE.Vector3(0, cardY * (mobile ? 0.95 : 1.02), RADIUS - 2);
      // Fit the ring between the top title and the bottom word on any screen size:
      // find a look-at height (and, if needed, extra distance) so the front card's
      // label clears the title and its base clears the word below.
      let fitY = target.y;
      let fitZ = 0;
      const topPt = new THREE.Vector3(0, cardY + (CH / 2) * 1.04 + 0.12 + 0.22 + 0.16, RADIUS);
      const basePt = new THREE.Vector3(0, 0.05, RADIUS);
      const toScreenY = (v: InstanceType<typeof THREE.Vector3>, h: number) => ((1 - v.clone().project(camera).y) / 2) * h;
      const fit = () => {
        const h = host.clientHeight;
        const hostTop = host.getBoundingClientRect().top;
        const titleB = titleRef.current ? titleRef.current.getBoundingClientRect().bottom - hostTop + 28 : 0;
        const wordT = bottomRef.current ? bottomRef.current.getBoundingClientRect().top - hostTop - 36 : h;
        for (let dz = 0; dz <= 30; dz += 0.5) {
          for (let ty = 4; ty >= -1; ty -= 0.04) {
            camera.position.set(camBase.x, camBase.y, camBase.z + dz);
            camera.lookAt(target.x, ty, target.z);
            camera.updateMatrixWorld();
            const topY = toScreenY(topPt, h);
            const baseY = toScreenY(basePt, h);
            if (topY >= titleB && baseY <= wordT) {
              fitY = ty;
              fitZ = dz;
              return;
            }
          }
        }
      };
      // Where each card stands once the name is assembled: upright on the water at ROW_Z,
      // so the pool keeps reflecting every card right underneath it.
      // One row "SMART CHOICE" on wide screens, two rows "SMART / CHOICE" on narrow ones.
      const ROW_Z = RADIUS + 0.6;
      const HOVER = 0.14; // small gap between card base and its reflection
      let slots: { x: number; y: number }[] = [];
      let rowScale = 1;
      let rowLookY = 0;
      let spreadX = 6;
      const layout = () => {
        const dist = camBase.z + fitZ - ROW_Z;
        const hh = dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const hw = hh * camera.aspect;
        const gx = CW * 1.08;
        const gy = CH * 1.08;
        const availW = hw * 2 * 0.88;
        const availH = hh * 2 * 0.34;
        const s1 = Math.min(availW / ((N - 1 + 0.6) * gx + CW), availH / CH);
        const s2 = Math.min(availW / (5 * gx + CW), availH / (gy + CH));
        const two = s2 > s1 * 1.25;
        rowScale = Math.min(two ? s2 : s1, 1.1);
        const baseY = (CH / 2) * rowScale + HOVER;
        // aim the camera so the waterline under the row sits ~60% down the screen,
        // leaving room for the reflections below it
        const water = new THREE.Vector3(0, 0, ROW_Z);
        spreadX = hw * 1.15;
        rowLookY = fitY;
        for (let ty = fitY; ty >= -4; ty -= 0.02) {
          camera.position.set(camBase.x, camBase.y, camBase.z + fitZ);
          camera.lookAt(target.x, ty, target.z);
          camera.updateMatrixWorld();
          if ((1 - water.clone().project(camera).y) / 2 <= 0.6) {
            rowLookY = ty;
            break;
          }
        }
        slots = LETTERS.map((_, i) => {
          if (!two) {
            const k = i + (i >= 5 ? 0.6 : 0);
            return { x: (k - (N - 1 + 0.6) / 2) * gx * rowScale, y: baseY };
          }
          const top = i < 5;
          const c = top ? i : i - 5;
          const cnt = top ? 5 : 6;
          return { x: (c - (cnt - 1) / 2) * gx * rowScale, y: baseY + (top ? gy * rowScale : 0) };
        });
      };
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        fit();
        layout();
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
      let outStart = 0.82; // progress where the last screen-height (the hand-off) begins
      const readProgress = () => {
        const r = section.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        progress = total > 0 ? clamp(-r.top / total) : 0;
        if (total > 0) outStart = 1 - window.innerHeight / total;
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
      const ringPos = new THREE.Vector3();
      const rowPos = new THREE.Vector3();
      const ringQ = new THREE.Quaternion();
      const euler = new THREE.Euler();
      const partQ = new THREE.Quaternion();
      const STAG = 0.05; // per-card delay while assembling

      const frame = () => {
        timer.update();
        const t = timer.getElapsed();
        const p = isReduced ? 0 : progress;

        // 1) ring turns with scroll, settling on each card
        const raw = clamp(p / RING_END) * (N - 1);
        const base = Math.floor(raw);
        const frac = raw - base;
        const settled = base + easeInOut(clamp((frac - 0.2) / 0.6));
        const targetRot = -settled * step;
        rot += (targetRot - rot) * 0.08;
        const ringRot = rot + (isReduced ? 0 : Math.sin(t * 0.3) * 0.01);

        const idx = Math.round(clamp(-rot / step, 0, N - 1));
        if (idx !== lastActive) {
          lastActive = idx;
          setActive(idx);
        }

        // 2) cards rise off the pool and line up as the name
        const asm = isReduced ? 0 : clamp((p - RING_END) / (ASM_END - RING_END));
        // 3) hand-off: the two words part and the home page opens from the middle
        const o = isReduced ? 0 : clamp((p - outStart) / (1 - outStart));

        pointer.sx += (pointer.x - pointer.sx) * 0.05;
        pointer.sy += (pointer.y - pointer.sy) * 0.05;
        const pw = 1 - asm * 0.7;
        camPos.copy(camBase);
        camPos.x += pointer.sx * 0.9 * pw;
        camPos.y += -pointer.sy * 0.35 * pw;
        camPos.z += fitZ + o * 1.2;
        camera.position.copy(camPos);
        const lookY = fitY + (rowLookY - fitY) * easeInOut(asm);
        camera.lookAt(target.x, lookY, target.z);

        cards.forEach((c, i) => {
          const a = i * step + ringRot;
          const k = clamp((Math.cos(a) - 0.55) / 0.45); // 1 = facing camera
          ringPos.set(Math.sin(a) * RADIUS, cardY + k * 0.12 + Math.sin(t * 0.9 + i * 0.8) * 0.03, Math.cos(a) * RADIUS);
          euler.set(0, a, 0);
          ringQ.setFromEuler(euler);

          const e = easeInOut(clamp((asm - i * STAG) / (1 - (N - 1) * STAG)));
          const sl = slots[i] ?? { x: 0, y: 0 };
          // parting: SMART slides left, CHOICE right; the letters nearest the gap go first
          const side = i < 5 ? -1 : 1;
          const fromGap = i < 5 ? 4 - i : i - 5;
          const sp = easeInOut(clamp((o - fromGap * 0.035) / 0.6));
          const fade = 1 - clamp((sp - 0.3) / 0.55);

          rowPos.set(sl.x + side * sp * spreadX, sl.y + Math.sin(t * 1.2 + i * 0.6) * 0.015 * e, ROW_Z + sp * 0.8);
          euler.set(0, -side * sp * 0.75, 0); // swing to face the opening
          partQ.setFromEuler(euler);

          c.group.position.lerpVectors(ringPos, rowPos, e);
          c.group.position.y += Math.sin(Math.PI * e) * 1.8; // lift up off the water on the way
          c.group.quaternion.copy(ringQ).slerp(partQ, e); // upright, facing the viewer
          const rs = 0.94 + k * 0.1;
          c.group.scale.setScalar((rs + (rowScale - rs) * e) * (1 - sp * 0.25));

          const ringGlow = Math.max(0, 0.03 + k * 0.6 + Math.sin(t * 1.5 + i) * 0.03 * k);
          c.glow.opacity = (ringGlow * (1 - e) + e * (0.2 + Math.sin(t * 1.5 + i) * 0.04)) * fade;
          c.card.opacity = fade;
          c.label.opacity = (1 - e) * fade;
        });

        poolUniforms.time.value = t;
        poolUniforms.fadeOut.value = clamp(o * 1.4) * 0.6;
        haloMat.opacity = 0.12 * (1 - asm);
        moteMat.opacity = 0.6 * (1 - o * 0.7);
        motes.rotation.y = t * 0.015;
        renderer.render(scene, camera);

        // the HTML word hands over to the 3D row; the title clears for the hero
        if (bottomRef.current) bottomRef.current.style.opacity = String(1 - clamp(asm / 0.35));
        if (titleRef.current) titleRef.current.style.opacity = String(1 - clamp(o / 0.35));
        if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(p / 0.05));
        // hide the site header while the intro plays; bring it back as the hero opens
        const introOn = p < outStart + (1 - outStart) * 0.55 && section.getBoundingClientRect().bottom > 0;
        const root = document.documentElement;
        if (introOn && root.dataset.intro !== 'on') root.dataset.intro = 'on';
        else if (!introOn && root.dataset.intro === 'on') delete root.dataset.intro;

        // Opening in the middle: a soft circular hole in the intro grows to reveal the hero,
        // which is held in place underneath and pops from 90% to full size.
        const stage = stageRef.current;
        const hero = section.nextElementSibling as HTMLElement | null;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const r = Math.pow(clamp((o - 0.06) / 0.94), 1.5) * Math.hypot(w, h) * 0.56;
        if (stage) {
          const soft = Math.min(140, r);
          const m = r < 1 ? '' : `radial-gradient(circle at 50% 50%, transparent ${r}px, #000 ${r + soft}px)`;
          stage.style.maskImage = m;
          stage.style.setProperty('-webkit-mask-image', m);
        }
        if (hero) {
          if (o > 0 && o < 1) {
            const heroTop = section.getBoundingClientRect().bottom - h; // where it would sit unpinned
            const s = 0.9 + 0.1 * (1 - Math.pow(1 - clamp(o / 0.8), 3));
            hero.style.transformOrigin = `50% ${h / 2}px`;
            hero.style.transform = `translateY(${-heroTop}px) scale(${s})`;
          } else {
            hero.style.transform = '';
          }
        }
      };

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        frame();
      };
      loop();
      setReady(true);

      cleanup = () => {
        delete document.documentElement.dataset.intro;
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

  const calm = useReducedMotion();
  const word = 'SMART CHOICE';
  // number of letters (ignoring the space) revealed so far
  const shown = reduced ? N : active + 1;

  return (
    <section
      ref={sectionRef}
      aria-label="Smart Choice intro"
      className="relative z-10 -mt-[76px] h-[620vh] motion-reduce:h-screen"
    >
      <div ref={stageRef} className="sc-noise sticky top-0 h-screen overflow-hidden bg-ink">
        <div ref={hostRef} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />

        {/* Edge vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,11,26,0.9)_100%)]" />

        {/* Top title */}
        <div ref={titleRef} className="pointer-events-none absolute inset-x-0 top-[44px] px-4 text-center text-white sm:top-[52px]">
          <motion.p
            initial={calm ? false : { opacity: 0, letterSpacing: '0.9em' }}
            animate={{ opacity: 1, letterSpacing: '0.45em' }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-4 text-xs font-semibold uppercase text-white/55 sm:text-sm"
          >
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-electric-300 sm:block" />
            Smart Choice LK · Seeduwa
            <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-electric-300 sm:block" />
          </motion.p>
          <h2 className="mt-3 font-display text-4xl font-light leading-tight tracking-[-0.025em] sm:text-5xl xl:text-[4rem]">
            {['Choose', 'smart.'].map((w, i) => (
              <motion.span
                key={w}
                initial={calm ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mr-[0.25em] inline-block text-white/95"
              >
                {w}
              </motion.span>
            ))}
            <motion.span
              initial={calm ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="sc-chrome-text inline-block animate-shine"
            >
              Live better.
            </motion.span>
          </h2>
        </div>

        {/* Bottom: building word, label, dots */}
        <div ref={bottomRef} className="pointer-events-none absolute inset-x-0 bottom-[92px] text-center text-white sm:bottom-[84px]">
          <p aria-label="Smart Choice" className="relative inline-block font-display text-5xl font-light tracking-[0.16em] sm:text-7xl xl:text-[5.5rem]">
            {word.split('').map((ch, i) => {
              const letterIdx = word.slice(0, i + 1).replace(/ /g, '').length; // 1-based among letters
              const on = ch === ' ' || letterIdx <= shown;
              return (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={false}
                  animate={
                    on
                      ? { opacity: 1, scale: calm ? 1 : [1.45, 1], filter: calm ? 'blur(0px)' : ['blur(10px)', 'blur(0px)'] }
                      : { opacity: 0.12, scale: 1, filter: 'blur(0px)' }
                  }
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={on ? { animationDelay: `${i * 0.09}s` } : undefined}
                  className={`inline-block ${on ? 'sc-lit [text-shadow:0_0_28px_rgba(80,140,255,0.85)]' : 'text-white'}`}
                >
                  {ch === ' ' ? '\u00a0' : ch}
                </motion.span>
              );
            })}
          </p>
          <div className="mt-3 h-6 overflow-hidden">
            {/* re-keyed on change so the new label slides up; no exit step, so fast scrolling never leaves it blank */}
            <motion.p
              key={active}
              initial={calm ? false : { y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm font-semibold uppercase tracking-[0.32em] text-electric-300 sm:text-base"
            >
              {LABELS[active]}
            </motion.p>
          </div>
          <div className="mt-4 flex justify-center gap-1.5">
            {LETTERS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? 'w-8 bg-white shadow-[0_0_10px_rgba(120,170,255,0.9)]' : i < active ? 'w-1.5 bg-electric-300/70' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/55">
          <span className="grid h-9 w-[22px] justify-center rounded-full border border-white/35 pt-1.5">
            <span className="h-2 w-[3px] animate-bounce rounded-full bg-white/80" />
          </span>
          Scroll
        </div>
      </div>
    </section>
  );
}
