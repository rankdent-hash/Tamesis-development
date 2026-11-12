import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Trade tools orbiting a glowing hexagon (the logo's shield shape), with an
 * optional perspective blueprint floor. Everything is procedural geometry —
 * no model files to download or license.
 *
 * The orbit is centred on a DOM element (the first visible entry in
 * `anchorRefs`), so the same scene can wrap the hero quote form on desktop,
 * a spacer on mobile, or the emblem in the closing CTA.
 *
 * ONLY ever dynamically imported — see ToolsBackdrop.tsx. three.js must not
 * sit in the initial bundle.
 */

const CYAN = 0x31cce8;
const ORANGE = 0xff7421;
const FOV = 35;
const CAM_Z = 14;
const VIEW_H = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z;
// Tools are modelled ~1.3 units long and sized for a ring of this radius.
const DESIGN_RING_PX = 280;
const DESIGN_PX_PER_UNIT = 92;

type Materials = {
  steel: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  orange: THREE.MeshStandardMaterial;
  copper: THREE.MeshStandardMaterial;
  paint: THREE.MeshStandardMaterial;
  glow: THREE.MeshBasicMaterial;
};

function extrude(shape: THREE.Shape, depth: number, bevel = 0.014) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 28,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

function hexShape(radius: number, rotation = Math.PI / 2) {
  const s = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = rotation + (i * Math.PI) / 3;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

function hexPath(radius: number, rotation = Math.PI / 2) {
  const p = new THREE.Path();
  for (let i = 0; i < 6; i++) {
    const a = rotation + (i * Math.PI) / 3;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (i === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }
  p.closePath();
  return p;
}

function makeWrench(m: Materials) {
  const g = new THREE.Group();

  const handle = new THREE.Shape();
  const hw = 0.62;
  const hh = 0.08;
  handle.moveTo(-hw, -hh);
  handle.lineTo(hw, -hh * 1.15);
  handle.lineTo(hw, hh * 1.15);
  handle.lineTo(-hw, hh);
  handle.closePath();
  g.add(new THREE.Mesh(extrude(handle, 0.07), m.steel));

  // Open jaw
  const R = 0.3;
  const n = 0.115;
  const a = Math.asin(n / R);
  const jaw = new THREE.Shape();
  jaw.moveTo(R * Math.cos(a), n);
  jaw.absarc(0, 0, R, a, Math.PI * 2 - a, false);
  jaw.lineTo(-0.04, -n);
  jaw.lineTo(-0.04, n);
  jaw.closePath();
  const jawMesh = new THREE.Mesh(extrude(jaw, 0.09), m.steel);
  jawMesh.position.x = 0.82;
  jawMesh.rotation.z = 0.28;
  g.add(jawMesh);

  // Ring end
  const ring = new THREE.Shape();
  ring.absarc(0, 0, 0.23, 0, Math.PI * 2, false);
  ring.holes.push(hexPath(0.125, 0));
  const ringMesh = new THREE.Mesh(extrude(ring, 0.09), m.steel);
  ringMesh.position.x = -0.8;
  g.add(ringMesh);

  return g;
}

function makeHammer(m: Materials) {
  const g = new THREE.Group();

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.058, 1.3, 18), m.orange);
  handle.position.y = -0.08;
  g.add(handle);

  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.07, 0.56, 18), m.rubber);
  grip.position.y = -0.5;
  g.add(grip);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.2), m.steel);
  head.position.y = 0.62;
  g.add(head);

  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.115, 0.14, 24), m.steel);
  face.rotation.z = -Math.PI / 2;
  face.position.set(0.31, 0.62, 0);
  g.add(face);

  // Claw — a tapered wedge, bent slightly downward
  const claw = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.12, 0.36, 4), m.steel);
  claw.rotation.z = Math.PI / 2 + 0.32;
  claw.scale.z = 0.9;
  claw.position.set(-0.4, 0.58, 0);
  g.add(claw);

  return g;
}

function makeScrewdriver(m: Materials) {
  const g = new THREE.Group();

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.1, 0.52, 8), m.orange);
  handle.position.y = -0.46;
  g.add(handle);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.125, 0.08, 8), m.rubber);
  cap.position.y = -0.76;
  g.add(cap);

  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, 0.12, 16), m.steel);
  ferrule.position.y = -0.14;
  g.add(ferrule);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.82, 14), m.steel);
  shaft.position.y = 0.32;
  g.add(shaft);

  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, 0.022), m.steel);
  tip.position.y = 0.77;
  g.add(tip);

  return g;
}

function makeNut(m: Materials) {
  const s = hexShape(0.34, 0);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.17, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return new THREE.Mesh(extrude(s, 0.24, 0.024), m.steel);
}

function makeGear(m: Materials) {
  const teeth = 10;
  const rOuter = 0.44;
  const rInner = 0.34;
  const step = (Math.PI * 2) / teeth;
  const s = new THREE.Shape();
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [
      [rInner, a],
      [rOuter, a + step * 0.16],
      [rOuter, a + step * 0.46],
      [rInner, a + step * 0.62],
    ];
    pts.forEach(([r, ang], j) => {
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r;
      if (i === 0 && j === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
  }
  s.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.14, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return new THREE.Mesh(extrude(s, 0.13, 0.016), m.orange);
}

function makePipe(m: Materials) {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.66, -0.3, 0),
      new THREE.Vector3(-0.2, -0.3, 0),
      new THREE.Vector3(0.14, -0.2, 0),
      new THREE.Vector3(0.29, 0.1, 0),
      new THREE.Vector3(0.3, 0.56, 0),
    ],
    false,
    "catmullrom",
    0.5
  );
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.115, 20, false), m.copper));

  const flangeGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.1, 24);
  const f1 = new THREE.Mesh(flangeGeo, m.steel);
  f1.rotation.z = Math.PI / 2;
  f1.position.set(-0.66, -0.3, 0);
  g.add(f1);
  const f2 = new THREE.Mesh(flangeGeo, m.steel);
  f2.position.set(0.3, 0.56, 0);
  g.add(f2);

  g.position.set(0.15, -0.1, 0);
  return g;
}

function makeRoller(m: Materials) {
  const g = new THREE.Group();

  const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.66, 28), m.paint);
  roller.rotation.z = Math.PI / 2;
  roller.position.y = 0.5;
  g.add(roller);

  const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16);
  const caps = new THREE.Mesh(capGeo, m.steel);
  caps.rotation.z = Math.PI / 2;
  caps.position.y = 0.5;
  g.add(caps);

  const frame = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0.34, 0.5, 0),
      new THREE.Vector3(0.48, 0.5, 0),
      new THREE.Vector3(0.5, 0.36, 0),
      new THREE.Vector3(0.46, 0.2, 0),
      new THREE.Vector3(0.04, 0.14, 0),
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(0, -0.14, 0),
    ],
    false,
    "catmullrom",
    0.15
  );
  g.add(new THREE.Mesh(new THREE.TubeGeometry(frame, 60, 0.024, 10, false), m.steel));

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.075, 0.56, 14), m.orange);
  handle.position.y = -0.4;
  g.add(handle);

  g.position.y = -0.05;
  return g;
}

function makeLevel(m: Materials) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.09), m.orange));

  const capGeo = new THREE.BoxGeometry(0.07, 0.22, 0.11);
  [-0.75, 0.75].forEach((x) => {
    const cap = new THREE.Mesh(capGeo, m.rubber);
    cap.position.x = x;
    g.add(cap);
  });

  const windowGeo = new THREE.BoxGeometry(0.3, 0.11, 0.1);
  const vialGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.22, 12);
  [-0.42, 0, 0.42].forEach((x) => {
    const win = new THREE.Mesh(windowGeo, m.rubber);
    win.position.x = x;
    g.add(win);
    const vial = new THREE.Mesh(vialGeo, m.glow);
    vial.rotation.z = Math.PI / 2;
    vial.position.set(x, 0, 0.012);
    g.add(vial);
  });

  return g;
}

function makeHexRing(outer: number, inner: number, depth: number, material: THREE.Material) {
  const s = hexShape(outer);
  s.holes.push(hexPath(inner));
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  return new THREE.Mesh(g, material);
}

type Tool = {
  object: THREE.Object3D;
  angle: number;
  phase: number;
  spin: number;
  delay: number;
};

export function ToolsScene({
  anchorRefs,
  floor = false,
  ringScale = 1,
  onReady,
}: {
  anchorRefs: RefObject<HTMLElement | null>[];
  floor?: boolean;
  /** Grow the hexagon beyond a snug fit around the anchor (1 = snug). */
  ringScale?: number;
  onReady?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });

    const scene = new THREE.Scene();

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.85;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    // ---- Lights: cool key, warm orange kicker ----
    scene.add(new THREE.HemisphereLight(0xbfe9ff, 0x050c16, 0.7));
    const key = new THREE.DirectionalLight(0xdff6ff, 2.2);
    key.position.set(-4, 6, 8);
    scene.add(key);
    const kicker = new THREE.PointLight(ORANGE, 60, 30, 1.6);
    kicker.position.set(5, -3, 5);
    scene.add(kicker);
    const cyanFill = new THREE.PointLight(CYAN, 40, 30, 1.6);
    cyanFill.position.set(-5, 3, 3);
    scene.add(cyanFill);

    // ---- Materials ----
    const materials: Materials = {
      steel: new THREE.MeshStandardMaterial({ color: 0xc3d1de, metalness: 0.95, roughness: 0.24 }),
      rubber: new THREE.MeshStandardMaterial({ color: 0x14263c, metalness: 0.1, roughness: 0.6 }),
      orange: new THREE.MeshStandardMaterial({ color: ORANGE, metalness: 0.15, roughness: 0.38 }),
      copper: new THREE.MeshStandardMaterial({ color: 0xe08a52, metalness: 1, roughness: 0.26 }),
      paint: new THREE.MeshStandardMaterial({ color: 0x35c3df, metalness: 0, roughness: 0.92 }),
      glow: new THREE.MeshBasicMaterial({ color: 0x9ff0ff, toneMapped: false }),
    };

    // ---- Rig: everything that follows the anchor ----
    const rig = new THREE.Group();
    scene.add(rig);

    const ringMatCyan = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.75, toneMapped: false });
    const ringMatOrange = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.6, toneMapped: false });
    const plateMat = new THREE.MeshBasicMaterial({ color: 0x1498b0, transparent: true, opacity: 0.07, toneMapped: false, depthWrite: false });

    const haloMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.13, toneMapped: false, depthWrite: false });

    // Kept on the anchor's own plane: pushed back in z, perspective would
    // slide the hexagon toward the middle of the screen and hide one side
    // of it behind whatever it is supposed to frame.
    const ringGroup = new THREE.Group();
    const ringMain = makeHexRing(1, 0.968, 0.04, ringMatCyan);
    const ringHalo = makeHexRing(1.035, 0.93, 0.01, haloMat);
    const ringOuter = makeHexRing(1.13, 1.116, 0.02, ringMatOrange);
    const ringInner = makeHexRing(0.9, 0.893, 0.02, ringMatCyan);
    const plate = new THREE.Mesh(new THREE.ShapeGeometry(hexShape(0.968)), plateMat);
    ringHalo.position.z = -0.02;
    ringOuter.position.z = -0.25;
    ringInner.position.z = 0.2;
    plate.position.z = -0.05;
    ringGroup.add(ringMain, ringHalo, ringOuter, ringInner, plate);
    rig.add(ringGroup);

    const builders = [makeWrench, makeGear, makeHammer, makePipe, makeScrewdriver, makeNut, makeRoller, makeLevel];
    const tools: Tool[] = builders.map((build, i) => {
      const inner = build(materials);
      const holder = new THREE.Group();
      holder.add(inner);
      rig.add(holder);
      return {
        object: holder,
        angle: (i / builders.length) * Math.PI * 2 + 0.35,
        phase: i * 1.7,
        spin: (i % 2 === 0 ? 1 : -1) * (0.12 + (i % 3) * 0.05),
        delay: 0.25 + i * 0.09,
      };
    });

    // ---- Blueprint floor ----
    // A shader-drawn grid on a single plane rather than GridHelper's GL
    // lines: lines are anti-aliased, and it fades to transparent with
    // distance instead of to a fixed fog colour, so it sits cleanly over
    // whatever gradient the section has behind the canvas.
    let floorMesh: THREE.Mesh | null = null;
    let floorMat: THREE.ShaderMaterial | null = null;
    if (floor) {
      floorMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color(CYAN) },
          uOffset: { value: 0 },
          uOpacity: { value: 0.34 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorld;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uOffset;
          uniform float uOpacity;
          varying vec3 vWorld;
          void main() {
            vec2 cell = vec2(vWorld.x, vWorld.z + uOffset) / 2.0;
            vec2 grid = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
            float line = 1.0 - min(min(grid.x, grid.y) * 0.75, 1.0);
            float dist = length(vWorld.xz - cameraPosition.xz);
            float fade = 1.0 - smoothstep(13.0, 40.0, dist);
            gl_FragColor = vec4(uColor, line * fade * uOpacity);
          }
        `,
      });
      floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(240, 120), floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.set(0, -VIEW_H * 0.47, -40);
      scene.add(floorMesh);
    }

    // ---- Dust motes ----
    const MOTES = 110;
    const motePos = new Float32Array(MOTES * 3);
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0x9ff0ff,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      toneMapped: false,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    // ---- Layout: map the anchor's DOM rect onto the z=0 plane ----
    let ringRadius = 3;
    let toolScale = 1;
    let viewW = VIEW_H;
    let orbitX = 3;
    let orbitY = 3;

    const seedMotes = () => {
      for (let i = 0; i < MOTES; i++) {
        motePos[i * 3] = (Math.random() - 0.5) * viewW * 1.2;
        motePos[i * 3 + 1] = (Math.random() - 0.5) * VIEW_H * 1.1;
        motePos[i * 3 + 2] = -6 + Math.random() * 8;
      }
      moteGeo.attributes.position.needsUpdate = true;
    };

    const layout = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const worldPerPx = VIEW_H / h;
      viewW = VIEW_H * camera.aspect;

      const anchor = anchorRefs.map((r) => r.current).find((el) => el && el.getClientRects().length > 0);
      const box = mount.getBoundingClientRect();
      let cx = w * 0.5;
      let cy = h * 0.5;
      let halfW = Math.min(w, h) * 0.22;
      let halfH = halfW;
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        cx = r.left + r.width / 2 - box.left;
        cy = r.top + r.height / 2 - box.top;
        halfW = r.width / 2;
        halfH = r.height / 2;
      }

      // Pointy-top hexagon that clears the anchor on every side, but never
      // runs off the edge of the canvas.
      let ringPx = Math.max((halfW / 0.866) * 1.12, halfH * 1.18) * ringScale;
      const spare = Math.min(cx, w - cx) - 12;
      ringPx = Math.max(60, Math.min(ringPx, spare / 0.866));

      ringRadius = ringPx * worldPerPx;
      toolScale = THREE.MathUtils.clamp(ringPx / DESIGN_RING_PX, 0.42, 1) * DESIGN_PX_PER_UNIT * worldPerPx;
      // Big rings frame a card that hides their middle, so tools ride just
      // inside the line. Small rings have content in the middle (a rating,
      // the emblem) — there the tools orbit outside it instead.
      const orbit = ringPx < 180 ? 1.14 : 0.92;
      orbitX = ringRadius * orbit;
      orbitY = ringRadius * (orbit + 0.03);

      rig.position.set((cx - w / 2) * worldPerPx, -(cy - h / 2) * worldPerPx, 0);
      ringGroup.scale.setScalar(ringRadius);
      if (floorMesh) floorMesh.visible = w >= 1024;
    };

    layout();
    seedMotes();

    const ro = new ResizeObserver(() => {
      layout();
      if (reduceMotion) renderFrame(performance.now());
    });
    ro.observe(mount);
    // The anchor fades/slides in after mount — re-measure once it has settled.
    const settle = window.setTimeout(layout, 900);

    // ---- Pointer parallax ----
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    // ---- Only render while on screen ----
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(mount);

    const start = performance.now();
    let last = start;
    let raf = 0;
    let disposed = false;
    let readyFired = false;

    const easeOutBack = (x: number) => {
      const c1 = 1.4;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    function renderFrame(now: number) {
      const t = reduceMotion ? 6 : (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      rig.rotation.y += (pointer.x * 0.22 - rig.rotation.y) * 0.04;
      rig.rotation.x += (pointer.y * 0.14 - rig.rotation.x) * 0.04;

      // A gentle sway rather than a full spin, so the hexagons stay
      // squared-up with the card they frame.
      ringOuter.rotation.z = Math.sin(t * 0.22 + 1) * 0.07;
      ringInner.rotation.z = Math.sin(t * 0.3 + 2.4) * 0.05;
      ringMatCyan.opacity = 0.62 + Math.sin(t * 1.4) * 0.13;

      tools.forEach((tool) => {
        const a = tool.angle + t * 0.11;
        const depth = Math.sin(a * 2 + tool.phase);
        tool.object.position.set(
          Math.cos(a) * orbitX,
          Math.sin(a) * orbitY + Math.sin(t * 0.7 + tool.phase) * 0.12,
          depth * 0.9
        );
        // Mostly camera-facing so each silhouette stays readable.
        tool.object.rotation.set(
          Math.sin(t * 0.5 + tool.phase) * 0.45,
          Math.sin(t * 0.38 + tool.phase * 1.3) * 0.6,
          tool.phase + t * tool.spin
        );
        const intro = reduceMotion ? 1 : THREE.MathUtils.clamp((t - tool.delay) / 0.9, 0, 1);
        tool.object.scale.setScalar(toolScale * (intro <= 0 ? 0.0001 : easeOutBack(intro)));
      });

      if (!reduceMotion) {
        for (let i = 0; i < MOTES; i++) {
          motePos[i * 3 + 1] += dt * (0.08 + (i % 5) * 0.02);
          if (motePos[i * 3 + 1] > VIEW_H * 0.58) motePos[i * 3 + 1] = -VIEW_H * 0.58;
        }
        moteGeo.attributes.position.needsUpdate = true;
        if (floorMat) floorMat.uniforms.uOffset.value = (t * 0.6) % 2;
      }

      renderer.render(scene, camera);

      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    }

    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      renderFrame(now);
    };

    if (reduceMotion) renderFrame(performance.now());
    else raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
        }
      });
      Object.values(materials).forEach((mat) => mat.dispose());
      [ringMatCyan, ringMatOrange, plateMat, haloMat, moteMat].forEach((mat) => mat.dispose());
      floorMat?.dispose();
      envTarget.dispose();
      room.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // anchorRefs are stable refs owned by the parent section
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floor, ringScale, onReady]);

  if (failed) return null;

  return <div ref={mountRef} className="absolute inset-0" />;
}

export default ToolsScene;
