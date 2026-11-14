import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { houseStops, type StopKey } from "./houseServices";

/**
 * Cutaway model of a British two-storey brick house that the camera tours
 * one service at a time: the front wall and front roof slope fade away for
 * interior stops, the part of the house a service applies to glows orange,
 * and each stop plays a short scene of the work itself (tiles and
 * floorboards laying, fittings going in, paint rolling on, circuits tracing
 * out at night, rain on the roof for leak tracing).
 *
 * Everything is generated in code — geometry and canvas textures, no model
 * or image files.
 *
 * ONLY ever dynamically imported once the section is in view — see
 * ServiceShowcase.tsx. three.js must not sit in the initial bundle.
 */

const CYAN = 0x31cce8;
const ORANGE = 0xff7421;

// House shell (metres-ish). Front of the house faces +z.
const W = 8;
const D = 6;
const T = 0.15;
const FLOOR2 = 2.75; // top of the first-floor slab
const EAVES = 5.35;
const RISE = 1.85;
const PARTITION_X = 0.5;
const CHIMNEY_X = -2.2;

const BASE_FOV = 38;
const BASE_ASPECT = 1.6;

// Real-world size of one repeat of each texture, in metres
const BRICK_M: [number, number] = [0.9, 0.6];
const SLATE_M: [number, number] = [1.0, 1.4];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
const backOut = (x: number) => {
  const c = clamp01(x);
  return 1 + 2.4 * Math.pow(c - 1, 3) + 1.4 * Math.pow(c - 1, 2);
};

type V3 = [number, number, number];

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

/** London stock brick, stretcher bond: 4 bricks x 8 courses per tile */
function brickTexture() {
  return canvasTexture(256, 256, (g) => {
    g.fillStyle = "#cfc6b4";
    g.fillRect(0, 0, 256, 256);
    for (let row = 0; row < 8; row++) {
      for (let col = -1; col < 4; col++) {
        const x = col * 64 + (row % 2 ? 32 : 0);
        const y = row * 32;
        const roll = Math.random();
        const hue = roll < 0.12 ? 18 + Math.random() * 8 : 34 + Math.random() * 9;
        const sat = 32 + Math.random() * 16;
        const lig = roll > 0.9 ? 40 + Math.random() * 8 : 52 + Math.random() * 12;
        g.fillStyle = `hsl(${hue},${sat}%,${lig}%)`;
        g.fillRect(x + 2, y + 2, 60, 28);
        // soot / weathering flecks
        for (let i = 0; i < 5; i++) {
          g.fillStyle = `rgba(60,48,36,${0.05 + Math.random() * 0.1})`;
          g.fillRect(x + 2 + Math.random() * 54, y + 2 + Math.random() * 24, 3 + Math.random() * 8, 2 + Math.random() * 3);
        }
      }
    }
  });
}

/** Welsh slate: staggered courses with a shadow line under each */
function slateTexture() {
  return canvasTexture(256, 256, (g) => {
    g.fillStyle = "#3d4a59";
    g.fillRect(0, 0, 256, 256);
    for (let row = 0; row < 8; row++) {
      for (let col = -1; col < 4; col++) {
        const x = col * 64 + (row % 2 ? 32 : 0);
        const y = row * 32;
        const l = 26 + Math.random() * 10;
        g.fillStyle = `hsl(${208 + Math.random() * 10},${14 + Math.random() * 8}%,${l}%)`;
        g.fillRect(x + 1, y, 62, 31);
        g.fillStyle = "rgba(10,16,24,0.55)";
        g.fillRect(x + 1, y + 29, 62, 3);
      }
    }
  });
}

function woodTexture() {
  return canvasTexture(256, 32, (g) => {
    g.fillStyle = "#c79a63";
    g.fillRect(0, 0, 256, 32);
    for (let i = 0; i < 46; i++) {
      g.strokeStyle = `rgba(${90 + Math.random() * 40},${58 + Math.random() * 25},30,${0.1 + Math.random() * 0.2})`;
      g.lineWidth = 0.6 + Math.random() * 1.2;
      const y = Math.random() * 32;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(80, y + Math.random() * 4 - 2, 170, y + Math.random() * 4 - 2, 256, y + Math.random() * 3 - 1.5);
      g.stroke();
    }
  });
}

function grassTexture() {
  return canvasTexture(128, 128, (g) => {
    g.fillStyle = "#4f7d3c";
    g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = `hsl(${92 + Math.random() * 26},${35 + Math.random() * 25}%,${24 + Math.random() * 22}%)`;
      g.fillRect(Math.random() * 128, Math.random() * 128, 1.5, 3);
    }
  });
}

/** Square floor tile / paving slab: `n` x `n` units per repeat */
function gridTexture(base: string, joint: string, n = 2) {
  return canvasTexture(128, 128, (g) => {
    g.fillStyle = joint;
    g.fillRect(0, 0, 128, 128);
    const s = 128 / n;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        g.fillStyle = base;
        g.globalAlpha = 0.88 + Math.random() * 0.12;
        g.fillRect(c * s + 1.5, r * s + 1.5, s - 3, s - 3);
      }
    }
    g.globalAlpha = 1;
  });
}

function blotchTexture() {
  const tex = canvasTexture(256, 256, (g) => {
    for (let i = 0; i < 46; i++) {
      const x = 40 + Math.random() * 176;
      const y = 70 + Math.random() * 170;
      const r = 14 + Math.random() * 34;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(38,52,44,0.55)");
      grad.addColorStop(1, "rgba(38,52,44,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function polylineTube(points: V3[], radius: number, material: THREE.Material) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < points.length - 1; i++) {
    path.add(new THREE.LineCurve3(new THREE.Vector3(...points[i]), new THREE.Vector3(...points[i + 1])));
  }
  const segments = Math.max(8, (points.length - 1) * 10);
  return new THREE.Mesh(new THREE.TubeGeometry(path, segments, radius, 8, false), material);
}

export function HouseTour({
  activeIndex,
  viewShift = 0,
  onReady,
}: {
  activeIndex: number;
  /** Fraction of the width to push the picture right, to clear an overlay on the left */
  viewShift?: number;
  onReady?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  const shiftRef = useRef(viewShift);
  const [failed, setFailed] = useState(false);
  activeRef.current = activeIndex;
  shiftRef.current = viewShift;

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

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 120);

    // ---- Lights (day values; the frame loop blends toward night / rain) ----
    const hemi = new THREE.HemisphereLight(0xe9f4ff, 0x3a3226, 0.6);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff4e2, 2.3);
    sun.position.set(-7, 13, 11);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -11;
    sun.shadow.camera.right = 11;
    sun.shadow.camera.top = 11;
    sun.shadow.camera.bottom = -11;
    sun.shadow.camera.far = 45;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    scene.add(sun);
    const dayColor = new THREE.Color(0xfff4e2);
    const nightColor = new THREE.Color(0x86a8ff);

    // ---- Textures + materials ----
    const textures: THREE.Texture[] = [];
    const owned: THREE.Material[] = [];
    const keep = <M extends THREE.Material>(m: M) => {
      owned.push(m);
      return m;
    };
    const tiled = (base: THREE.Texture, rx: number, ry: number) => {
      const t = base.clone();
      t.repeat.set(rx, ry);
      t.needsUpdate = true;
      textures.push(t);
      return t;
    };
    const brickBase = brickTexture();
    const slateBase = slateTexture();
    const woodBase = woodTexture();
    const grassBase = grassTexture();
    const kitchenTileBase = gridTexture("#8c98a6", "#5c6672");
    const pavingBase = gridTexture("#b9b4aa", "#8d877c");
    textures.push(brickBase, slateBase, woodBase, grassBase, kitchenTileBase, pavingBase);

    const std = (color: number, roughness = 0.85, metalness = 0) =>
      keep(new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    const brick = (lenM: number, heightM: number) =>
      keep(new THREE.MeshStandardMaterial({ map: tiled(brickBase, lenM / BRICK_M[0], heightM / BRICK_M[1]), roughness: 0.95 }));

    const plasterMat = std(0xf1ece3, 0.95);
    const ceilingMat = std(0xf8f6f1, 0.95);
    const trimMat = std(0xffffff, 0.5);
    const slabMat = std(0x9a9488, 0.9);
    const steelMat = std(0xcfd6dd, 0.25, 0.9);
    const blackMat = std(0x1d2126, 0.5);
    const whiteMat = std(0xffffff, 0.25);
    const fabricMat = std(0x5d7389, 0.95);
    const cushionMat = std(0xd9a441, 0.95);
    const darkWoodMat = std(0x5a4636, 0.7);
    const terracottaMat = std(0xb5623c, 0.85);
    const brassMat = std(0xd4af37, 0.3, 0.9);

    // Front-of-house materials all fade together for cutaway stops
    const frontMats: { mat: THREE.Material; base: number }[] = [];
    const frontMat = <M extends THREE.Material>(m: M, base = 1) => {
      m.transparent = true;
      frontMats.push({ mat: m, base });
      return keep(m);
    };
    const frontBrickMat = frontMat(
      new THREE.MeshStandardMaterial({ map: tiled(brickBase, 1 / BRICK_M[0], 1 / BRICK_M[1]), roughness: 0.95 })
    );
    const frontRoofMat = frontMat(new THREE.MeshStandardMaterial({ roughness: 0.75 }));
    const frontTrimMat = frontMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }));
    const frontStoneMat = frontMat(new THREE.MeshStandardMaterial({ color: 0xd9d2c3, roughness: 0.9 }));
    const frontBrassMat = frontMat(new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.9 }));
    const frontDoorMat = frontMat(new THREE.MeshStandardMaterial({ color: 0xe8651a, roughness: 0.45 }));
    const frontDoorPanelMat = frontMat(new THREE.MeshStandardMaterial({ color: 0xc9530f, roughness: 0.45 }));
    const glassMat = frontMat(
      new THREE.MeshStandardMaterial({ color: 0x9fc4d6, roughness: 0.08, metalness: 0.3, emissive: 0xffc56b, emissiveIntensity: 0 }),
      0.55
    );
    const lampMat = frontMat(new THREE.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffc56b, emissiveIntensity: 0.2 }));

    // One glow-able material set per stop: whatever is built with it lights
    // up orange while that stop is active.
    const accents = new Map<StopKey, THREE.MeshStandardMaterial[]>();
    const accent = (key: StopKey, params: THREE.MeshStandardMaterialParameters) => {
      const m = keep(new THREE.MeshStandardMaterial({ roughness: 0.6, ...params, emissive: ORANGE, emissiveIntensity: 0 }));
      accents.set(key, [...(accents.get(key) ?? []), m]);
      return m;
    };
    // Things that only exist while their stop is active (callouts, traces)
    const activeOnly = new Map<StopKey, THREE.Object3D[]>();
    const showOnlyFor = (key: StopKey, obj: THREE.Object3D) => {
      obj.visible = false;
      activeOnly.set(key, [...(activeOnly.get(key) ?? []), obj]);
      return obj;
    };

    const house = new THREE.Group();
    scene.add(house);
    const front = new THREE.Group();
    house.add(front);

    const box = (
      parent: THREE.Object3D,
      size: V3,
      pos: V3,
      material: THREE.Material | THREE.Material[],
      shadow = true
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      m.position.set(...pos);
      m.castShadow = shadow;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    const cyl = (parent: THREE.Object3D, rTop: number, rBottom: number, h: number, pos: V3, material: THREE.Material, seg = 16) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg), material);
      m.position.set(...pos);
      m.castShadow = true;
      parent.add(m);
      return m;
    };
    // Fittings that scale in from a point on the floor/wall when installed
    const installs: { group: THREE.Group; pivot: THREE.Vector3; order: number }[] = [];
    const installGroup = (pivot: V3, order: number) => {
      const group = new THREE.Group();
      house.add(group);
      installs.push({ group, pivot: new THREE.Vector3(...pivot), order });
      return group;
    };

    // ---- Stage: blueprint disc + shadow catcher ----
    const groundMat = keep(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color(CYAN) }, uBase: { value: new THREE.Color(0x0d1e33) } },
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
          uniform vec3 uBase;
          varying vec3 vWorld;
          void main() {
            vec2 cell = vWorld.xz;
            vec2 grid = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
            float line = 1.0 - min(min(grid.x, grid.y), 1.0);
            float r = length(vWorld.xz - vec2(0.0, 1.5));
            float fade = 1.0 - smoothstep(8.0, 15.0, r);
            vec3 col = mix(uBase, uColor, line * 0.55);
            gl_FragColor = vec4(col, fade * (0.9 + line * 0.1));
          }
        `,
      })
    );
    const ground = new THREE.Mesh(new THREE.CircleGeometry(16, 64), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.16, 1.5);
    scene.add(ground);
    const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(16, 48), keep(new THREE.ShadowMaterial({ opacity: 0.4 })));
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.set(0, -0.15, 1.5);
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);

    // ---- Shell: brick outside, plaster inside ----
    const zBack = -D / 2 + T;
    const zFront = D / 2 - T;
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    const wall = (size: V3, pos: V3, outerFace: number, lenM: number) => {
      const mats: THREE.Material[] = Array(6).fill(plasterMat);
      mats[outerFace] = brick(lenM, size[1]);
      return box(house, size, pos, mats);
    };
    box(house, [W, 0.15, D], [0, -0.075, 0], slabMat);
    wall([W, EAVES, T], [0, EAVES / 2, -D / 2 + T / 2], 5, W);
    wall([T, EAVES, D], [-W / 2 + T / 2, EAVES / 2, 0], 1, D);
    wall([T, EAVES, D], [W / 2 - T / 2, EAVES / 2, 0], 0, D);
    box(house, [W - 2 * T, 0.15, D - T], [0, FLOOR2 - 0.075, 0], ceilingMat);
    box(house, [W - 2 * T, 0.1, D - T], [0, EAVES - 0.05, 0], ceilingMat);

    const gableShape = new THREE.Shape();
    gableShape.moveTo(-D / 2, 0);
    gableShape.lineTo(D / 2, 0);
    gableShape.lineTo(0, RISE);
    gableShape.closePath();
    const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: T, bevelEnabled: false });
    const gableMat = keep(
      new THREE.MeshStandardMaterial({ map: tiled(brickBase, 1 / BRICK_M[0], 1 / BRICK_M[1]), roughness: 0.95 })
    );
    [-W / 2, W / 2 - T].forEach((x) => {
      const g = new THREE.Mesh(gableGeo, gableMat);
      g.rotation.y = Math.PI / 2;
      g.position.set(x, EAVES, 0);
      g.castShadow = true;
      house.add(g);
    });

    // Internal partition: ground floor has a doorway, first floor is solid
    const DOOR_Z0 = 1.7;
    const DOOR_Z1 = 2.6;
    const GH = FLOOR2 - 0.15;
    box(house, [T, GH, DOOR_Z0 - zBack], [PARTITION_X, GH / 2, (DOOR_Z0 + zBack) / 2], plasterMat);
    box(house, [T, GH, zFront - DOOR_Z1], [PARTITION_X, GH / 2, (zFront + DOOR_Z1) / 2], plasterMat);
    box(house, [T, 0.5, DOOR_Z1 - DOOR_Z0], [PARTITION_X, 2.35, (DOOR_Z0 + DOOR_Z1) / 2], plasterMat);
    box(house, [T, EAVES - FLOOR2 - 0.1, D - T], [PARTITION_X, (EAVES + FLOOR2) / 2 - 0.05, 0], plasterMat);

    // ---- Roof: slate, back slope stays, front slope fades with the front ----
    const HALF = D / 2 + 0.3;
    const slopeLen = Math.hypot(HALF, RISE);
    const pitch = Math.atan2(RISE, HALF);
    const slateRepeat: [number, number] = [(W + 0.6) / SLATE_M[0], slopeLen / SLATE_M[1]];
    const backRoofMat = keep(new THREE.MeshStandardMaterial({ map: tiled(slateBase, ...slateRepeat), roughness: 0.75 }));
    frontRoofMat.map = tiled(slateBase, ...slateRepeat);
    const backSlope = box(house, [W + 0.6, 0.12, slopeLen], [0, EAVES + RISE / 2, -HALF / 2], backRoofMat);
    backSlope.rotation.x = -pitch;
    const frontSlope = box(front, [W + 0.6, 0.12, slopeLen], [0, EAVES + RISE / 2, HALF / 2], frontRoofMat);
    frontSlope.rotation.x = pitch;
    box(house, [W + 0.7, 0.14, 0.26], [0, EAVES + RISE + 0.07, 0], terracottaMat); // ridge tiles
    box(front, [W + 0.6, 0.2, 0.05], [0, EAVES - 0.02, D / 2 + 0.3], frontTrimMat); // fascia

    // Chimney stack on the ridge with clay pots
    const leakMat = accent("leak", { color: 0x8f979f, roughness: 0.45, metalness: 0.5 });
    const stackMats = [0.8, 0.8, 0.8, 0.8, 0.8, 0.8].map((len) => brick(len, 1.5));
    box(house, [0.8, 1.5, 0.8], [CHIMNEY_X, EAVES + RISE + 0.1, 0], stackMats);
    box(house, [0.96, 0.12, 0.96], [CHIMNEY_X, EAVES + RISE + 0.9, 0], slabMat);
    [-0.2, 0.2].forEach((dx) => cyl(house, 0.11, 0.14, 0.36, [CHIMNEY_X + dx, EAVES + RISE + 1.13, 0], terracottaMat));
    box(house, [1.1, 0.14, 1.1], [CHIMNEY_X, EAVES + RISE - 0.52, 0], leakMat); // lead flashing

    // Rainwater goods (part of the leak story)
    const gutterMat = frontMat(accent("leak", { color: 0x1d2126, roughness: 0.5 }));
    box(front, [W + 0.6, 0.12, 0.16], [0, EAVES - 0.1, D / 2 + 0.4], gutterMat);
    const downpipe = polylineTube(
      [
        [W / 2 - 0.2, EAVES - 0.15, D / 2 + 0.4],
        [W / 2 - 0.2, EAVES - 0.45, D / 2 + 0.1],
        [W / 2 - 0.2, 0.1, D / 2 + 0.1],
      ],
      0.055,
      gutterMat
    );
    front.add(downpipe);

    // ---- Front elevation ----
    const wallShape = new THREE.Shape();
    wallShape.moveTo(-W / 2, 0);
    wallShape.lineTo(W / 2, 0);
    wallShape.lineTo(W / 2, EAVES);
    wallShape.lineTo(-W / 2, EAVES);
    wallShape.closePath();
    const DOOR = { x: -0.4, y: 1.05, w: 1.0, h: 2.1 };
    const windows = [
      { x: -2.4, y: 1.55, w: 1.5, h: 1.5 },
      { x: 2.4, y: 1.55, w: 1.5, h: 1.5 },
      { x: -2.4, y: 4.1, w: 1.5, h: 1.45 },
      { x: 2.4, y: 4.1, w: 1.5, h: 1.45 },
    ];
    [...windows, DOOR].forEach((o) => {
      const hole = new THREE.Path();
      hole.moveTo(o.x - o.w / 2, o.y - o.h / 2);
      hole.lineTo(o.x + o.w / 2, o.y - o.h / 2);
      hole.lineTo(o.x + o.w / 2, o.y + o.h / 2);
      hole.lineTo(o.x - o.w / 2, o.y + o.h / 2);
      hole.closePath();
      wallShape.holes.push(hole);
    });
    const frontWall = new THREE.Mesh(new THREE.ExtrudeGeometry(wallShape, { depth: T, bevelEnabled: false }), frontBrickMat);
    frontWall.position.z = D / 2 - T;
    frontWall.castShadow = true;
    front.add(frontWall);

    // Sash windows: white frame, meeting rail, glazing bar, stone sill and lintel
    const FZ0 = D / 2 - T / 2;
    windows.forEach((o) => {
      box(front, [o.w, o.h, 0.02], [o.x, o.y, FZ0], glassMat, false);
      const f = 0.07;
      box(front, [o.w, f, 0.12], [o.x, o.y + o.h / 2 - f / 2, FZ0], frontTrimMat, false);
      box(front, [o.w, f, 0.12], [o.x, o.y - o.h / 2 + f / 2, FZ0], frontTrimMat, false);
      box(front, [f, o.h, 0.12], [o.x - o.w / 2 + f / 2, o.y, FZ0], frontTrimMat, false);
      box(front, [f, o.h, 0.12], [o.x + o.w / 2 - f / 2, o.y, FZ0], frontTrimMat, false);
      box(front, [o.w, 0.06, 0.14], [o.x, o.y, FZ0], frontTrimMat, false);
      box(front, [0.035, o.h, 0.08], [o.x, o.y, FZ0], frontTrimMat, false);
      box(front, [o.w + 0.3, 0.09, 0.24], [o.x, o.y - o.h / 2 - 0.045, D / 2 + 0.04], frontStoneMat);
      box(front, [o.w + 0.3, 0.2, 0.05], [o.x, o.y + o.h / 2 + 0.1, D / 2 + 0.01], frontStoneMat, false);
    });

    // Panelled front door with frame, fanlight, letterbox, step and wall lamp
    box(front, [DOOR.w, 1.82, 0.06], [DOOR.x, 0.91, FZ0], frontDoorMat, false);
    [
      [-0.22, 1.32],
      [0.22, 1.32],
      [-0.22, 0.5],
      [0.22, 0.5],
    ].forEach(([dx, y]) => box(front, [0.32, 0.6, 0.02], [DOOR.x + dx, y, FZ0 + 0.035], frontDoorPanelMat, false));
    box(front, [0.22, 0.045, 0.02], [DOOR.x, 0.93, FZ0 + 0.045], frontBrassMat, false);
    box(front, [0.05, 0.05, 0.06], [DOOR.x + 0.4, 1.0, FZ0 + 0.05], frontBrassMat, false);
    box(front, [DOOR.w, 0.24, 0.02], [DOOR.x, 1.96, FZ0], glassMat, false);
    box(front, [DOOR.w, 0.06, 0.12], [DOOR.x, 1.83, FZ0], frontTrimMat, false);
    box(front, [0.07, DOOR.h, 0.12], [DOOR.x - DOOR.w / 2 + 0.035, DOOR.y, FZ0], frontTrimMat, false);
    box(front, [0.07, DOOR.h, 0.12], [DOOR.x + DOOR.w / 2 - 0.035, DOOR.y, FZ0], frontTrimMat, false);
    box(front, [DOOR.w + 0.3, 0.2, 0.05], [DOOR.x, DOOR.h + 0.1, D / 2 + 0.01], frontStoneMat, false);
    box(front, [1.4, 0.14, 0.5], [DOOR.x, -0.08, D / 2 + 0.25], frontStoneMat);
    box(front, [0.08, 0.22, 0.1], [DOOR.x + 0.85, 1.95, D / 2 + 0.05], gutterMat, false);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), lampMat);
    lamp.position.set(DOOR.x + 0.85, 1.8, D / 2 + 0.1);
    front.add(lamp);

    // ---- Lighting fittings: a pendant and a warm point light per room ----
    const elecMat = accent("electrical", { color: 0xf2f6fa, roughness: 0.4 });
    const bulbMat = keep(new THREE.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffc56b, emissiveIntensity: 0.3 }));
    const shadeMat = keep(new THREE.MeshStandardMaterial({ color: 0xf3ead8, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffc56b, emissiveIntensity: 0 }));
    const lights: V3[] = [
      [-1.75, GH, 0.2],
      [2.25, GH, 0.2],
      [-1.75, EAVES - 0.1, 0.2],
      [2.25, EAVES - 0.1, 0.2],
    ];
    const roomLights = lights.map(([x, y, z]) => {
      cyl(house, 0.012, 0.012, 0.4, [x, y - 0.2, z], blackMat, 6).castShadow = false;
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.2, 20, 1, true), shadeMat);
      shade.position.set(x, y - 0.46, z);
      house.add(shade);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), bulbMat);
      bulb.position.set(x, y - 0.52, z);
      house.add(bulb);
      const light = new THREE.PointLight(0xffd29a, 0, 7.5, 1.6);
      light.position.set(x, y - 0.6, z);
      house.add(light);
      return light;
    });

    // ---- Bathroom (first floor, right) ----
    const bathMat = accent("bathroom", { color: 0xffffff, roughness: 0.25 });
    const unitMat = accent("bathroom", { color: 0x34506e, roughness: 0.6 });
    const worktopMat = accent("bathroom", { color: 0xe9e6df, roughness: 0.4 });
    const waterMat = std(0x9fe3f0, 0.15);
    const screenMat = keep(new THREE.MeshStandardMaterial({ color: 0xbfe6f0, roughness: 0.05, transparent: true, opacity: 0.35 }));

    const bathG = installGroup([2.85, FLOOR2, -2.4], 0);
    box(bathG, [1.7, 0.56, 0.78], [2.85, FLOOR2 + 0.28, -2.4], bathMat);
    box(bathG, [1.5, 0.04, 0.56], [2.85, FLOOR2 + 0.57, -2.4], waterMat, false);
    box(bathG, [0.04, 1.5, 0.7], [2.0, FLOOR2 + 1.3, -2.42], screenMat, false);
    cyl(bathG, 0.02, 0.02, 0.22, [3.55, FLOOR2 + 0.67, -2.55], steelMat, 8);
    box(bathG, [0.16, 0.03, 0.03], [3.48, FLOOR2 + 0.77, -2.55], steelMat, false);
    const basinG = installGroup([1.25, FLOOR2, -2.6], 1);
    box(basinG, [0.2, 0.75, 0.2], [1.25, FLOOR2 + 0.375, -2.62], bathMat);
    box(basinG, [0.62, 0.16, 0.46], [1.25, FLOOR2 + 0.83, -2.56], bathMat);
    cyl(basinG, 0.018, 0.018, 0.16, [1.25, FLOOR2 + 0.98, -2.72], steelMat, 8);
    box(basinG, [0.66, 0.85, 0.03], [1.25, FLOOR2 + 1.75, zBack + 0.05], steelMat, false);
    const wcG = installGroup([3.5, FLOOR2, -0.5], 2);
    box(wcG, [0.2, 0.42, 0.46], [3.72, FLOOR2 + 0.68, -0.5], bathMat);
    box(wcG, [0.52, 0.4, 0.4], [3.4, FLOOR2 + 0.2, -0.5], bathMat);
    box(wcG, [0.5, 0.04, 0.42], [3.4, FLOOR2 + 0.42, -0.5], bathMat, false);

    // Tiles: back wall first (bottom row up), then the floor
    const tileMat = accent("tiling", { color: 0xe9f1f2, roughness: 0.2 });
    const tiles: { p: V3; flat: boolean }[] = [];
    const TX0 = PARTITION_X + T / 2 + 0.02;
    const TX1 = W / 2 - T - 0.02;
    const cols = 10;
    const tw = (TX1 - TX0) / cols;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < cols; c++) {
        tiles.push({ p: [TX0 + tw * (c + 0.5), FLOOR2 + 0.17 + r * 0.34, zBack + 0.02], flat: false });
      }
    }
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < cols; c++) {
        tiles.push({ p: [TX0 + tw * (c + 0.5), FLOOR2 + 0.012, zBack + 0.19 + r * 0.34], flat: true });
      }
    }
    const tileMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(tw - 0.022, 0.318, 0.025), tileMat, tiles.length);
    tileMesh.receiveShadow = true;
    house.add(tileMesh);

    // ---- Kitchen (ground floor, right) ----
    const KX0 = PARTITION_X + T / 2;
    const KX1 = W / 2 - T;
    box(
      house,
      [KX1 - KX0, 0.02, zFront - zBack],
      [(KX0 + KX1) / 2, 0.012, 0],
      keep(new THREE.MeshStandardMaterial({ map: tiled(kitchenTileBase, 3, 5), roughness: 0.5 })),
      false
    );
    const baseG = installGroup([2.0, 0, -2.5], 3);
    box(baseG, [2.6, 0.88, 0.6], [1.95, 0.44, -2.5], unitMat);
    [0.98, 1.63, 2.28, 2.93].forEach((x) => box(baseG, [0.03, 0.12, 0.03], [x, 0.7, -2.18], brassMat, false));
    box(baseG, [2.7, 0.05, 0.66], [1.95, 0.905, -2.48], worktopMat);
    box(baseG, [0.62, 0.02, 0.4], [1.3, 0.935, -2.48], steelMat, false); // sink
    cyl(baseG, 0.018, 0.018, 0.26, [1.3, 1.06, -2.72], steelMat, 8);
    box(baseG, [0.6, 0.015, 0.5], [2.6, 0.938, -2.48], blackMat, false); // hob
    box(baseG, [0.58, 0.5, 0.02], [2.6, 0.5, -2.19], blackMat, false); // oven door
    const wallG = installGroup([2.0, 2.0, -2.7], 4);
    box(wallG, [1.2, 0.7, 0.36], [1.25, 2.0, -2.66], unitMat);
    box(wallG, [0.7, 0.14, 0.45], [2.6, 1.72, -2.6], steelMat); // extractor hood
    box(wallG, [0.3, 0.6, 0.3], [2.6, 2.1, -2.68], steelMat);
    box(house, [2.7, 0.55, 0.02], [1.95, 1.2, zBack + 0.012], whiteMat, false); // splashback
    const fridgeG = installGroup([3.45, 0, -2.45], 5);
    box(fridgeG, [0.7, 1.9, 0.68], [3.48, 0.95, -2.48], steelMat);
    box(fridgeG, [0.03, 0.5, 0.03], [3.2, 1.2, -2.12], blackMat, false);

    // ---- Living room (ground floor, left) ----
    const LX0 = -W / 2 + T + 0.01;
    const LX1 = PARTITION_X - T / 2 - 0.01;
    const plankMat = accent("flooring", { map: tiled(woodBase, 2, 1), roughness: 0.55 });
    const PLANKS = 19;
    const plankW = (zFront - zBack) / PLANKS;
    const plankGeo = new THREE.BoxGeometry(LX1 - LX0, 0.03, plankW - 0.012);
    plankGeo.translate((LX1 - LX0) / 2, 0, 0); // grow from the left edge
    const plankMesh = new THREE.InstancedMesh(plankGeo, plankMat, PLANKS);
    plankMesh.receiveShadow = true;
    const tone = new THREE.Color();
    for (let i = 0; i < PLANKS; i++) plankMesh.setColorAt(i, tone.setHSL(0.08, 0.25, 0.78 + Math.random() * 0.2));
    house.add(plankMesh);

    // Chimney breast with fireplace, under the stack
    box(house, [1.5, GH, 0.4], [CHIMNEY_X, GH / 2, zBack + 0.2], plasterMat);
    box(house, [0.8, 0.85, 0.06], [CHIMNEY_X, 0.45, zBack + 0.4], blackMat, false);
    box(house, [1.25, 0.1, 0.16], [CHIMNEY_X, 1.05, zBack + 0.46], trimMat);
    [-0.52, 0.52].forEach((dx) => box(house, [0.16, 1.0, 0.1], [CHIMNEY_X + dx, 0.5, zBack + 0.44], trimMat));
    box(house, [1.5, 0.05, 0.4], [CHIMNEY_X, 0.045, zBack + 0.6], slabMat, false);
    box(house, [0.9, 0.6, 0.03], [CHIMNEY_X, 1.75, zBack + 0.42], steelMat, false); // mirror

    // Sofa on the party wall, rug and coffee table
    box(house, [0.85, 0.42, 1.9], [LX0 + 0.5, 0.25, -1.3], fabricMat);
    box(house, [0.22, 0.55, 1.9], [LX0 + 0.16, 0.7, -1.3], fabricMat);
    [-2.15, -0.45].forEach((z) => box(house, [0.85, 0.3, 0.2], [LX0 + 0.5, 0.6, z], fabricMat));
    [-1.75, -0.85].forEach((z) => box(house, [0.14, 0.36, 0.4], [LX0 + 0.36, 0.64, z], cushionMat));
    box(house, [1.9, 0.015, 1.5], [-2.0, 0.04, -1.1], std(0x93a1ae, 1), false);
    box(house, [0.9, 0.05, 0.5], [-2.0, 0.36, -1.1], darkWoodMat);
    [
      [-0.4, -0.2],
      [0.4, -0.2],
      [-0.4, 0.2],
      [0.4, 0.2],
    ].forEach(([dx, dz]) => box(house, [0.05, 0.33, 0.05], [-2.0 + dx, 0.18, -1.1 + dz], darkWoodMat, false));

    // Radiators (heating): living room, bedroom, and a towel rail in the bathroom
    const radMat = accent("heating", { color: 0xffffff, roughness: 0.35 });
    const radiator = (x: number, floorY: number) => {
      box(house, [0.9, 0.55, 0.08], [x, floorY + 0.45, zBack + 0.07], radMat);
      for (let i = 0; i < 8; i++) box(house, [0.02, 0.5, 0.02], [x - 0.39 + i * 0.11, floorY + 0.45, zBack + 0.12], radMat, false);
    };
    radiator(-0.95, 0);
    radiator(-1.3, FLOOR2);
    const TOWEL_Z = 1.1;
    for (let i = 0; i < 6; i++) box(house, [0.03, 0.03, 0.5], [W / 2 - T - 0.06, FLOOR2 + 0.7 + i * 0.16, TOWEL_Z], radMat, false);
    [-0.25, 0.25].forEach((dz) => box(house, [0.03, 0.95, 0.03], [W / 2 - T - 0.06, FLOOR2 + 1.1, TOWEL_Z + dz], radMat, false));

    // Stairs, door, architrave and skirting — the joinery
    const woodMat = accent("carpentry", { color: 0xc49a6c, roughness: 0.6, map: tiled(woodBase, 1, 1) });
    for (let i = 0; i < 10; i++) {
      const h = 0.275 * (i + 1);
      box(house, [0.85, h, 0.3], [0, h / 2, 1.3 - i * 0.3], woodMat);
    }
    box(house, [0.1, 1.05, 0.1], [-0.4, 0.52, 1.5], woodMat); // newel post
    const doorPivot = new THREE.Group();
    doorPivot.position.set(PARTITION_X, 0, DOOR_Z0);
    doorPivot.rotation.y = -0.75;
    house.add(doorPivot);
    box(doorPivot, [0.05, 2.03, 0.86], [0, 1.015, 0.43], woodMat);
    box(doorPivot, [0.09, 0.03, 0.12], [0, 1.0, 0.78], brassMat, false);
    [DOOR_Z0 - 0.04, DOOR_Z1 + 0.04].forEach((z) => box(house, [T + 0.04, 2.1, 0.08], [PARTITION_X, 1.05, z], woodMat, false));
    box(house, [T + 0.04, 0.08, DOOR_Z1 - DOOR_Z0 + 0.16], [PARTITION_X, 2.12, (DOOR_Z0 + DOOR_Z1) / 2], woodMat, false);
    box(house, [LX1 - LX0, 0.14, 0.03], [(LX0 + LX1) / 2, 0.1, zBack + 0.015], woodMat, false);
    box(house, [0.03, 0.14, zFront - zBack], [LX0 + 0.015, 0.1, 0], woodMat, false);

    // ---- Bedroom (first floor, left) ----
    box(house, [LX1 - LX0, 0.02, zFront - zBack], [(LX0 + LX1) / 2, FLOOR2 + 0.012, 0], std(0xb9b0a3, 1), false); // carpet
    box(house, [1.6, 0.3, 2.05], [-2.6, FLOOR2 + 0.25, -1.75], darkWoodMat);
    box(house, [1.56, 0.2, 1.98], [-2.6, FLOOR2 + 0.5, -1.72], whiteMat);
    box(house, [1.6, 0.22, 1.35], [-2.6, FLOOR2 + 0.56, -1.35], std(0x7f95ab, 1));
    [-0.38, 0.38].forEach((dx) => box(house, [0.62, 0.14, 0.38], [-2.6 + dx, FLOOR2 + 0.66, -2.45], whiteMat));
    box(house, [1.7, 1.0, 0.1], [-2.6, FLOOR2 + 0.6, zBack + 0.07], fabricMat);
    box(house, [0.45, 0.5, 0.4], [-3.55, FLOOR2 + 0.25, -2.55], darkWoodMat);
    cyl(house, 0.1, 0.14, 0.2, [-3.55, FLOOR2 + 0.72, -2.55], shadeMat, 12);
    box(house, [1.2, 2.05, 0.58], [-0.3, FLOOR2 + 1.03, -2.5], trimMat);
    box(house, [0.02, 1.9, 0.02], [-0.3, FLOOR2 + 1.03, -2.2], blackMat, false);
    box(house, [LX1 - LX0, 0.14, 0.03], [(LX0 + LX1) / 2, FLOOR2 + 0.09, zBack + 0.03], trimMat, false);

    // Paint: a colour panel on the back wall that wipes in behind a roller
    const paintMat = accent("painting", { color: 0x9fb9a8, roughness: 0.85 });
    paintMat.emissive.set(0x5c7d6b);
    const PAINT_W = LX1 - LX0;
    const PAINT_H = EAVES - FLOOR2 - 0.12;
    const paintGeo = new THREE.PlaneGeometry(PAINT_W, PAINT_H);
    paintGeo.translate(PAINT_W / 2, 0, 0);
    const paint = new THREE.Mesh(paintGeo, paintMat);
    paint.position.set(LX0, FLOOR2 + PAINT_H / 2, zBack + 0.012);
    paint.receiveShadow = true;
    house.add(paint);
    const roller = new THREE.Group();
    roller.add(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.6, 16), accent("painting", { color: 0xff9248, roughness: 0.9 })));
    const rollerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), blackMat);
    rollerHandle.rotation.x = Math.PI / 2.6;
    rollerHandle.position.set(0, -0.2, 0.3);
    roller.add(rollerHandle);
    house.add(roller);
    showOnlyFor("painting", roller);

    // ---- Plumbing: boiler, radiator feed, wastes, the stack and the drain ----
    const pipeMat = accent("plumbing", { color: 0xe08a52, roughness: 0.3, metalness: 0.9 });
    const stackMat = accent("plumbing", { color: 0x2a2f35, roughness: 0.5 });
    const PZ = zBack + 0.1;
    const RXI = W / 2 - T - 0.1;
    // Plumbing proper: water to the sink and basin, and the wastes to the stack
    const pipes: THREE.Mesh[] = [
      polylineTube([[1.3, 0.86, PZ], [1.3, 0.24, PZ], [RXI, 0.24, PZ]], 0.045, pipeMat),
      polylineTube([[1.25, FLOOR2 + 0.75, PZ], [1.25, FLOOR2 + 0.24, PZ], [RXI, FLOOR2 + 0.24, PZ]], 0.045, pipeMat),
      polylineTube([[2.85, FLOOR2 + 0.3, PZ + 0.1], [2.85, FLOOR2 + 0.24, PZ], [RXI, FLOOR2 + 0.24, PZ]], 0.045, pipeMat),
      polylineTube([[RXI, FLOOR2 + 0.75, PZ], [RXI, 0.05, PZ]], 0.075, stackMat),
      polylineTube([[W / 2 + 0.12, EAVES - 0.3, -1.6], [W / 2 + 0.12, 0.1, -1.6], [W / 2 + 0.6, 0.02, -1.6]], 0.08, stackMat),
    ];
    pipes.forEach((p) => house.add(p));
    const pipeCounts = pipes.map((p) => p.geometry.index!.count);
    box(house, [0.5, 0.1, 0.5], [W / 2 + 0.75, -0.02, -1.6], blackMat);

    // ---- Heating: boiler, and flow pipework out to each radiator ----
    const BOILER_Z = -0.3;
    box(house, [0.3, 0.72, 0.46], [RXI - 0.06, 1.75, BOILER_Z], radMat);
    box(house, [0.02, 0.1, 0.2], [RXI - 0.22, 1.56, BOILER_Z], blackMat, false); // control panel
    const flameMat = keep(new THREE.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: 0, toneMapped: false }));
    box(house, [0.02, 0.12, 0.12], [RXI - 0.222, 1.82, BOILER_Z], flameMat, false); // sight glass
    cyl(house, 0.05, 0.05, GH - 2.11, [RXI - 0.06, (GH + 2.11) / 2, BOILER_Z], steelMat, 10); // flue
    const heatMat = accent("heating", { color: 0xd9743c, roughness: 0.3, metalness: 0.9 });
    const HY = 0.1;
    const heatPipes: THREE.Mesh[] = [
      // down from the boiler, along the back wall to the living-room radiator
      polylineTube([[RXI, 1.39, BOILER_Z], [RXI, HY, BOILER_Z], [RXI - 0.12, HY, PZ], [-0.95, HY, PZ], [-0.95, 0.2, PZ]], 0.04, heatMat),
      // up through the floor to the towel rail
      polylineTube([[RXI + 0.06, 2.11, BOILER_Z + 0.15], [RXI + 0.06, FLOOR2 + HY, BOILER_Z + 0.15], [RXI + 0.06, FLOOR2 + HY, TOWEL_Z], [RXI + 0.06, FLOOR2 + 0.62, TOWEL_Z]], 0.04, heatMat),
      // and along the first-floor back wall to the bedroom radiator
      polylineTube([[RXI + 0.06, FLOOR2 + HY, BOILER_Z + 0.15], [RXI - 0.12, FLOOR2 + HY, PZ], [-1.3, FLOOR2 + HY, PZ], [-1.3, FLOOR2 + 0.2, PZ]], 0.04, heatMat),
    ];
    heatPipes.forEach((p) => house.add(p));
    const heatCounts = heatPipes.map((p) => p.geometry.index!.count);

    // ---- Electrics: consumer unit, sockets and circuit traces ----
    const CU: V3 = [W / 2 - T - 0.07, 1.6, 1.4];
    box(house, [0.14, 0.5, 0.38], CU, elecMat);
    const sockets: V3[] = [
      [-0.3, 0.4, zBack + 0.03],
      [1.0, 1.2, zBack + 0.03],
      [-1.4, FLOOR2 + 0.4, zBack + 0.03],
      [2.0, FLOOR2 + 1.2, zBack + 0.03],
    ];
    sockets.forEach((p) => box(house, [0.2, 0.14, 0.03], p, elecMat, false));

    const wireMat = keep(new THREE.MeshBasicMaterial({ color: 0xff7a1f, toneMapped: false }));
    const RX = W / 2 - T - 0.03;
    const BZ = zBack + 0.03;
    const c1 = GH - 0.03;
    const c2 = EAVES - 0.13;
    const LZ = 0.2;
    const wireRuns: V3[][] = [
      [[RX, 1.85, CU[2]], [RX, c1, CU[2]], [RX, c1, LZ], [2.25, c1, LZ], [-1.75, c1, LZ]],
      [[RX, 1.85, CU[2]], [RX, c1, CU[2]], [RX, c1, BZ], [RX, c2, BZ], [RX, c2, LZ], [2.25, c2, LZ], [-1.75, c2, LZ]],
      [[RX, 1.35, CU[2]], [RX, 0.4, CU[2]], [RX, 0.4, BZ], [1.0, 0.4, BZ], [1.0, 1.2, BZ]],
      [[1.0, 0.4, BZ], [-0.3, 0.4, BZ]],
      [[RX, c1, BZ], [RX, FLOOR2 + 0.4, BZ], [2.0, FLOOR2 + 0.4, BZ], [2.0, FLOOR2 + 1.2, BZ]],
      [[2.0, FLOOR2 + 0.4, BZ], [-1.4, FLOOR2 + 0.4, BZ]],
    ];
    const wires = wireRuns.map((run) => {
      const m = polylineTube(run, 0.036, wireMat);
      house.add(m);
      showOnlyFor("electrical", m);
      return m;
    });
    const wireCounts = wires.map((w) => w.geometry.index!.count);

    // ---- Damp: a patch low on the living-room wall that gets treated ----
    const dampTex = blotchTexture();
    textures.push(dampTex);
    const DAMP_Z = 1.3;
    const dampMat = keep(new THREE.MeshBasicMaterial({ map: dampTex, transparent: true, opacity: 0, depthWrite: false }));
    const damp = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.7), dampMat);
    damp.rotation.y = Math.PI / 2;
    damp.position.set(LX0 + 0.04, 0.85, DAMP_Z);
    house.add(damp);
    const scanMat = keep(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false }));
    const scan = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 1.9), scanMat);
    scan.rotation.y = Math.PI / 2;
    scan.position.set(LX0 + 0.05, 0.95, DAMP_Z - 1.2);
    house.add(scan);

    // ---- Leak tracing: pulses where water gets in, and rain ----
    const pulseMat = keep(
      new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.9, toneMapped: false, side: THREE.DoubleSide })
    );
    const pulses = [
      [CHIMNEY_X, 0.85],
      [1.8, 1.7],
      [-0.2, 2.9],
    ].map(([x, down]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.3, 32), pulseMat);
      ring.position.set(x, EAVES + RISE - Math.sin(pitch) * down + 0.09, Math.cos(pitch) * down);
      ring.rotation.x = -Math.PI / 2 + pitch;
      house.add(ring);
      showOnlyFor("leak", ring);
      return ring;
    });
    const DROPS = 320;
    const rainPos = new Float32Array(DROPS * 6);
    const rainSeed = Array.from({ length: DROPS }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: Math.random() * 14,
      z: -5 + Math.random() * 15,
    }));
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    const rainMat = keep(new THREE.LineBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0 }));
    const rain = new THREE.LineSegments(rainGeo, rainMat);
    rain.frustumCulled = false;
    rain.visible = false;
    scene.add(rain);

    // ---- Front garden: lawn, path, hedge and a close-board fence ----
    const FZ = D / 2 + 3.5;
    box(
      house,
      [9.9, 0.04, 3.45],
      [0, -0.13, D / 2 + 1.75],
      keep(new THREE.MeshStandardMaterial({ map: tiled(grassBase, 6, 2.2), roughness: 1 })),
      false
    );
    box(
      house,
      [1.1, 0.05, 3.2],
      [DOOR.x, -0.115, D / 2 + 1.95],
      keep(new THREE.MeshStandardMaterial({ map: tiled(pavingBase, 1, 3), roughness: 0.9 })),
      false
    );
    box(house, [3.3, 0.75, 0.55], [-3.1, 0.25, FZ - 0.55], std(0x3d6b38, 1));
    const fenceMat = accent("fencing", { color: 0x9a7650, roughness: 0.8, map: tiled(woodBase, 1, 3) });
    const fenceParts: { mesh: THREE.Mesh; baseY: number; h: number; order: number }[] = [];
    const fencePart = (size: V3, pos: V3, order: number, parent: THREE.Object3D = house) => {
      const mesh = box(parent, size, pos, fenceMat);
      fenceParts.push({ mesh, baseY: pos[1] - size[1] / 2, h: size[1], order });
      return mesh;
    };
    const GATE0 = DOOR.x - 0.6;
    const GATE1 = DOOR.x + 0.6;
    const bays: [number, number][] = [];
    for (let x = -5; x < 5 - 0.01; x += 1.25) {
      const x1 = Math.min(x + 1.25, 5);
      if (x1 <= GATE0 || x >= GATE1) bays.push([x, x1]);
      else {
        if (x < GATE0) bays.push([x, GATE0]);
        if (x1 > GATE1) bays.push([GATE1, x1]);
      }
    }
    bays.forEach(([x0, x1], i) => {
      fencePart([x1 - x0 - 0.04, 1.15, 0.05], [(x0 + x1) / 2, 0.45, FZ], i);
      fencePart([0.12, 1.3, 0.12], [x0, 0.52, FZ], i);
    });
    fencePart([0.12, 1.3, 0.12], [5, 0.52, FZ], bays.length);
    const gatePivot = new THREE.Group();
    gatePivot.position.set(GATE0, 0, FZ);
    gatePivot.rotation.y = 0.75;
    house.add(gatePivot);
    fencePart([GATE1 - GATE0 - 0.14, 1.0, 0.05], [(GATE1 - GATE0) / 2, 0.4, 0], bays.length + 1, gatePivot);
    [-5, 5].forEach((x, i) => fencePart([0.05, 1.15, 3.45], [x, 0.45, FZ - 1.75], bays.length + 2 + i));

    // ---- Reveal helpers ----
    const dummy = new THREE.Object3D();
    const setTiles = (p: number) => {
      const n = tiles.length;
      tiles.forEach((tile, i) => {
        const s = smooth((p * (n + 24) - i) / 24);
        dummy.position.set(...tile.p);
        dummy.rotation.set(tile.flat ? -Math.PI / 2 : 0, 0, 0);
        dummy.scale.setScalar(Math.max(0.0001, s));
        dummy.updateMatrix();
        tileMesh.setMatrixAt(i, dummy.matrix);
      });
      tileMesh.instanceMatrix.needsUpdate = true;
    };
    const setPlanks = (p: number) => {
      for (let i = 0; i < PLANKS; i++) {
        const s = smooth((p * (PLANKS + 5) - i) / 5);
        dummy.position.set(LX0, 0.016, zBack + plankW * (i + 0.5));
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(Math.max(0.0001, s), 1, 1);
        dummy.updateMatrix();
        plankMesh.setMatrixAt(i, dummy.matrix);
      }
      plankMesh.instanceMatrix.needsUpdate = true;
    };
    const setInstalls = (p: number) => {
      installs.forEach(({ group, pivot, order }) => {
        const s = Math.max(0.0001, backOut(p * (installs.length + 1.5) - order));
        group.scale.setScalar(s);
        group.position.copy(pivot).multiplyScalar(1 - s);
      });
    };
    const setFence = (p: number) => {
      const n = bays.length + 4;
      fenceParts.forEach(({ mesh, baseY, h, order }) => {
        const s = Math.max(0.0001, backOut(p * (n + 3) - order) );
        mesh.scale.y = s;
        mesh.position.y = baseY + (h * s) / 2;
      });
    };
    setTiles(1);
    setPlanks(1);

    // ---- Sizing: hold the horizontal framing as the box gets narrower ----
    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const baseTan = Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2));
      const fov = camera.aspect >= BASE_ASPECT ? BASE_FOV : THREE.MathUtils.radToDeg(2 * Math.atan((baseTan * BASE_ASPECT) / camera.aspect));
      camera.fov = Math.min(fov, 72);
      if (shiftRef.current) camera.setViewOffset(w, h, -w * shiftRef.current, 0, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
    let appliedShift = shiftRef.current;
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    // ---- Drag to look around (eases back on release) ----
    const look = { yaw: 0, pitch: 0, dragging: false, x: 0, y: 0 };
    const el = renderer.domElement;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";
    const onDown = (e: PointerEvent) => {
      look.dragging = true;
      look.x = e.clientX;
      look.y = e.clientY;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!look.dragging) return;
      look.yaw = THREE.MathUtils.clamp(look.yaw - (e.clientX - look.x) * 0.006, -0.9, 0.9);
      look.pitch = THREE.MathUtils.clamp(look.pitch + (e.clientY - look.y) * 0.004, -0.25, 0.35);
      look.x = e.clientX;
      look.y = e.clientY;
    };
    const onUp = () => {
      look.dragging = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(mount);

    // ---- Animation ----
    const camPos = new THREE.Vector3(...houseStops[0].camera);
    const camTarget = new THREE.Vector3(...houseStops[0].target);
    const wantPos = new THREE.Vector3();
    const wantTarget = new THREE.Vector3();
    const offset = new THREE.Vector3();
    const spherical = new THREE.Spherical();
    const weights = houseStops.map((_, i) => (i === activeRef.current ? 1 : 0));
    let shellOpacity = 1;
    let night = 0;
    let currentIdx = -1;
    let stopStart = performance.now();
    const t0 = performance.now();
    let last = t0;
    let raf = 0;
    let disposed = false;
    let readyFired = false;
    const settled = { tiling: true, flooring: true, bathroom: true, fencing: true, plumbing: true, heating: true };

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      // Time-based easing, so the camera takes the same ~1.5s to arrive on a
      // slow phone as on a fast desktop.
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const k = (rate: number) => (reduceMotion ? 1 : 1 - Math.exp(-dt * rate));
      if (appliedShift !== shiftRef.current) {
        appliedShift = shiftRef.current;
        setSize();
      }
      const idx = Math.min(activeRef.current, houseStops.length - 1);
      if (idx !== currentIdx) {
        currentIdx = idx;
        stopStart = now;
      }
      const stop = houseStops[idx];
      const key = stop.key;
      const stopT = reduceMotion ? 99 : (now - stopStart) / 1000;
      // Let the camera arrive before the work animation starts
      const work = (duration: number, delay = 0.9) => smooth((stopT - delay) / duration);

      // Camera
      wantTarget.set(...stop.target);
      if (key === "overview" && !reduceMotion) {
        const a = 0.55 + Math.sin(t * 0.16) * 0.5;
        wantPos.set(Math.sin(a) * 17, 8.5, Math.cos(a) * 17 + 0.5);
      } else {
        wantPos.set(...stop.camera);
      }
      camPos.lerp(wantPos, k(2.6));
      camTarget.lerp(wantTarget, k(2.6));
      if (!look.dragging) {
        look.yaw *= 1 - k(3.5);
        look.pitch *= 1 - k(3.5);
      }
      offset.copy(camPos).sub(camTarget);
      spherical.setFromVector3(offset);
      spherical.theta += look.yaw;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi - look.pitch, 0.25, 1.5);
      offset.setFromSpherical(spherical);
      camera.position.copy(camTarget).add(offset);
      camera.lookAt(camTarget);

      // Time of day: electrics are shown at night, leak tracing under rain cloud
      // and heating on a winter evening with the lamps on.
      const wantNight = key === "electrical" ? 1 : key === "heating" ? 0.72 : key === "leak" ? 0.5 : 0;
      night += (wantNight - night) * k(2.2);
      sun.intensity = THREE.MathUtils.lerp(2.3, 0.1, night);
      sun.color.copy(dayColor).lerp(nightColor, night);
      hemi.intensity = THREE.MathUtils.lerp(0.6, 0.07, night);
      scene.environmentIntensity = THREE.MathUtils.lerp(0.35, 0.03, night);

      // Front wall + front roof slope: on for outside stops, off for cutaways.
      // The electrical stop opens outside at night (windows lit), then cuts away.
      const wantShell = key === "electrical" ? stopT < 3.2 && !reduceMotion : stop.shell;
      shellOpacity += ((wantShell ? 1 : 0) - shellOpacity) * k(4.5);
      const solid = shellOpacity > 0.6;
      frontMats.forEach(({ mat, base }) => {
        mat.opacity = base * shellOpacity;
        mat.depthWrite = solid;
      });
      front.visible = shellOpacity > 0.02;
      frontWall.castShadow = frontSlope.castShadow = solid;

      // Highlights
      houseStops.forEach((s, i) => {
        weights[i] += ((i === idx ? 1 : 0) - weights[i]) * k(4.5);
        const w = weights[i];
        const glow = w * (0.3 + Math.sin(t * 3) * 0.08);
        accents.get(s.key)?.forEach((m) => (m.emissiveIntensity = glow));
        activeOnly.get(s.key)?.forEach((o) => (o.visible = w > 0.04));
      });

      // ---- Per-stop scenes (everything rests "finished" when inactive) ----
      if (key === "tiling") {
        setTiles(work(2.6));
        settled.tiling = false;
      } else if (!settled.tiling) {
        setTiles(1);
        settled.tiling = true;
      }

      if (key === "flooring") {
        setPlanks(work(2.4));
        settled.flooring = false;
      } else if (!settled.flooring) {
        setPlanks(1);
        settled.flooring = true;
      }

      if (key === "bathroom") {
        setInstalls(work(3.2));
        settled.bathroom = false;
      } else if (!settled.bathroom) {
        setInstalls(1);
        settled.bathroom = true;
      }

      if (key === "fencing") {
        setFence(work(3));
        settled.fencing = false;
      } else if (!settled.fencing) {
        setFence(1);
        settled.fencing = true;
      }

      if (key === "plumbing") {
        const p = work(3);
        pipes.forEach((pipe, i) => {
          const local = clamp01(p * pipes.length - i);
          pipe.geometry.setDrawRange(0, Math.floor((pipeCounts[i] * local) / 48) * 48);
        });
        settled.plumbing = false;
      } else if (!settled.plumbing) {
        pipes.forEach((pipe) => pipe.geometry.setDrawRange(0, Infinity));
        settled.plumbing = true;
      }

      // Heating: the boiler fires, then heat runs out along each flow pipe
      if (key === "heating") {
        const p = work(3.4, 1.4);
        heatPipes.forEach((pipe, i) => {
          const local = clamp01(p * heatPipes.length - i * 0.6);
          pipe.geometry.setDrawRange(0, Math.floor((heatCounts[i] * local) / 48) * 48);
        });
        flameMat.opacity = smooth((stopT - 0.7) / 0.6) * (0.75 + Math.sin(t * 17) * 0.12 + Math.sin(t * 7.3) * 0.1);
        settled.heating = false;
      } else if (!settled.heating) {
        heatPipes.forEach((pipe) => pipe.geometry.setDrawRange(0, Infinity));
        flameMat.opacity = 0;
        settled.heating = true;
      }

      const paintP = key === "painting" ? work(3) : 1;
      paint.scale.x = Math.max(0.0001, paintP);
      roller.visible = key === "painting" && paintP < 1 && paintP > 0;
      roller.position.set(LX0 + PAINT_W * paintP, FLOOR2 + PAINT_H / 2 + Math.sin(t * 5) * (PAINT_H / 2 - 0.4), zBack + 0.14);

      // Carpentry: the internal door swings on its hinges
      const doorWant = key === "carpentry" && !reduceMotion ? -0.25 - (0.5 + 0.5 * Math.sin(stopT * 1.3 - 1.2)) * 1.15 : -0.75;
      doorPivot.rotation.y += (doorWant - doorPivot.rotation.y) * k(5);

      // Electrics: circuits trace out once the front has opened, then lights come up
      const wireP = key === "electrical" ? work(2.6, 3.8) : 0;
      wires.forEach((w, i) => w.geometry.setDrawRange(0, Math.floor((wireCounts[i] * wireP) / 48) * 48));
      const lit = night * (key === "electrical" ? 0.35 + 0.65 * Math.max(wireP, stopT < 3.2 ? 1 : 0) : 1);
      roomLights.forEach((l) => (l.intensity = lit * 9));
      bulbMat.emissiveIntensity = 0.3 + lit * 2.6;
      shadeMat.emissiveIntensity = lit * 0.55;
      glassMat.emissiveIntensity = night * 1.5;
      lampMat.emissiveIntensity = 0.2 + night * 2.5;

      if (key === "damp") {
        // patch shows, a scan line sweeps across, the patch clears behind it
        const appear = smooth((stopT - 0.6) / 0.9);
        const sweep = smooth((stopT - 4) / 2.2);
        dampMat.opacity = appear * (1 - sweep) * 0.95;
        scanMat.opacity = sweep > 0 && sweep < 1 ? 0.9 : 0;
        scan.position.z = DAMP_Z - 1.2 + sweep * 2.4;
      } else {
        dampMat.opacity *= 1 - k(6);
        scanMat.opacity = 0;
      }

      // Leak tracing: pulses on the roof, rain falling
      const leakW = weights[houseStops.findIndex((s) => s.key === "leak")] ?? 0;
      pulses.forEach((ring, i) => ring.scale.setScalar(0.7 + ((t * 0.6 + i * 0.33) % 1) * 1.3));
      pulseMat.opacity = 0.35 + (1 - ((t * 0.6) % 1)) * 0.6;
      rain.visible = leakW > 0.04 && !reduceMotion;
      if (rain.visible) {
        rainMat.opacity = leakW * 0.55;
        rainSeed.forEach((d, i) => {
          d.y -= dt * 15;
          if (d.y < 0) d.y += 14;
          rainPos.set([d.x, d.y, d.z, d.x + 0.05, d.y + 0.42, d.z], i * 6);
        });
        rainGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    };

    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      frame(now);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) obj.geometry.dispose();
      });
      owned.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
      envTarget.dispose();
      room.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onReady]);

  if (failed) return null;
  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

export default HouseTour;
