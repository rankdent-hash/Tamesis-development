import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { houseStops, type StopKey } from "./houseServices";

/**
 * Cutaway "architect's model" of a two-storey house that the camera tours
 * one service at a time: the front wall and front roof slope fade away for
 * interior stops, the part of the house a service applies to glows orange,
 * and several stops play a short animation of the work itself (tiles and
 * floorboards laying, paint rolling on, circuits tracing out).
 *
 * Everything is generated in code — no model or texture files.
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

const BASE_FOV = 38;
const BASE_ASPECT = 1.6;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};

type V3 = [number, number, number];

function polylineTube(points: V3[], radius: number, material: THREE.Material) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < points.length - 1; i++) {
    path.add(new THREE.LineCurve3(new THREE.Vector3(...points[i]), new THREE.Vector3(...points[i + 1])));
  }
  const segments = Math.max(8, (points.length - 1) * 10);
  return new THREE.Mesh(new THREE.TubeGeometry(path, segments, radius, 8, false), material);
}

function blotchTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
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
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
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
    renderer.toneMappingExposure = 0.92;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.35;

    const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 120);

    // ---- Lights: a soft cool sky, a key light from the open front ----
    scene.add(new THREE.HemisphereLight(0xdff3ff, 0x0a1626, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.1);
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
    const rim = new THREE.PointLight(CYAN, 45, 40, 1.7);
    rim.position.set(9, 6, -6);
    scene.add(rim);

    // ---- Materials ----
    const owned: THREE.Material[] = [];
    const std = (color: number, roughness = 0.85, metalness = 0) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
      owned.push(m);
      return m;
    };
    const wallMat = std(0xd3deea, 0.92);
    const slabMat = std(0xaab9c9, 0.9);
    const furnMat = std(0x8fa5bc, 0.75);
    const darkMat = std(0x1b3350, 0.7);
    const whiteMat = std(0xffffff, 0.3);
    const roofBackMat = std(0x16304c, 0.7);
    const frontMat = new THREE.MeshStandardMaterial({ color: 0xd3deea, roughness: 0.92, transparent: true });
    const frontRoofMat = new THREE.MeshStandardMaterial({ color: 0x16304c, roughness: 0.7, transparent: true });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x5fd3e8,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.45,
    });
    const frontDoorMat = new THREE.MeshStandardMaterial({ color: ORANGE, roughness: 0.5, transparent: true });
    const edgeMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 });
    const frontEdgeMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 });
    owned.push(frontMat, frontRoofMat, glassMat, frontDoorMat, edgeMat, frontEdgeMat);

    // One glow-able material set per stop: whatever is built with it lights
    // up orange while that stop is active.
    const accents = new Map<StopKey, THREE.MeshStandardMaterial[]>();
    const accent = (key: StopKey, color: number, roughness = 0.6, metalness = 0) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive: ORANGE, emissiveIntensity: 0 });
      owned.push(m);
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
      material: THREE.Material,
      shadow = true
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      m.position.set(...pos);
      m.castShadow = shadow;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    const outline = (mesh: THREE.Mesh, material: THREE.LineBasicMaterial = edgeMat) => {
      const lines = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 30), material);
      mesh.add(lines);
      return mesh;
    };

    // ---- Stage: blueprint disc + shadow catcher ----
    const groundMat = new THREE.ShaderMaterial({
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
    });
    owned.push(groundMat);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(16, 64), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.16, 1.5);
    scene.add(ground);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    owned.push(shadowMat);
    const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(16, 48), shadowMat);
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.set(0, -0.15, 1.5);
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);

    // ---- Shell ----
    box(house, [W, 0.15, D], [0, -0.075, 0], slabMat);
    outline(box(house, [W, EAVES, T], [0, EAVES / 2, -D / 2 + T / 2], wallMat));
    outline(box(house, [T, EAVES, D], [-W / 2 + T / 2, EAVES / 2, 0], wallMat));
    outline(box(house, [T, EAVES, D], [W / 2 - T / 2, EAVES / 2, 0], wallMat));
    box(house, [W - 2 * T, 0.15, D - T], [0, FLOOR2 - 0.075, 0], slabMat);

    const gableShape = new THREE.Shape();
    gableShape.moveTo(-D / 2, 0);
    gableShape.lineTo(D / 2, 0);
    gableShape.lineTo(0, RISE);
    gableShape.closePath();
    const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: T, bevelEnabled: false });
    [-W / 2, W / 2 - T].forEach((x) => {
      const g = new THREE.Mesh(gableGeo, wallMat);
      g.rotation.y = Math.PI / 2;
      g.position.set(x, EAVES, 0);
      g.castShadow = true;
      house.add(g);
    });

    // Internal partition: ground floor has a doorway, first floor is solid
    const DOOR_Z0 = 1.7;
    const DOOR_Z1 = 2.6;
    const zBack = -D / 2 + T;
    const zFront = D / 2 - T;
    box(house, [T, FLOOR2 - 0.15, DOOR_Z0 - zBack], [PARTITION_X, (FLOOR2 - 0.15) / 2, (DOOR_Z0 + zBack) / 2], wallMat);
    box(house, [T, FLOOR2 - 0.15, zFront - DOOR_Z1], [PARTITION_X, (FLOOR2 - 0.15) / 2, (zFront + DOOR_Z1) / 2], wallMat);
    box(house, [T, 0.5, DOOR_Z1 - DOOR_Z0], [PARTITION_X, 2.35, (DOOR_Z0 + DOOR_Z1) / 2], wallMat);
    box(house, [T, EAVES - FLOOR2, D - T], [PARTITION_X, (EAVES + FLOOR2) / 2, 0], wallMat);

    // Roof: back slope stays, front slope belongs to the removable front
    const HALF = D / 2 + 0.3;
    const slopeLen = Math.hypot(HALF, RISE);
    const pitch = Math.atan2(RISE, HALF);
    const backSlope = outline(box(house, [W + 0.6, 0.12, slopeLen], [0, EAVES + RISE / 2, -HALF / 2], roofBackMat));
    backSlope.rotation.x = -pitch;
    const frontSlope = outline(
      box(front, [W + 0.6, 0.12, slopeLen], [0, EAVES + RISE / 2, HALF / 2], frontRoofMat),
      frontEdgeMat
    );
    frontSlope.rotation.x = pitch;

    const leakMat = accent("leak", 0xb9c6d4, 0.5, 0.4);
    box(house, [0.7, 1.5, 0.7], [2.4, EAVES + RISE + 0.1, 0], wallMat);
    box(house, [0.86, 0.14, 0.86], [2.4, EAVES + RISE + 0.9, 0], darkMat);
    box(house, [1.0, 0.12, 1.0], [2.4, EAVES + RISE - 0.5, 0], leakMat); // flashing collar
    const gutter = box(house, [W + 0.6, 0.12, 0.16], [0, EAVES - 0.08, D / 2 + 0.34], leakMat);
    showOnlyFor("leak", gutter);

    // Front wall with window and door openings
    const wallShape = new THREE.Shape();
    wallShape.moveTo(-W / 2, 0);
    wallShape.lineTo(W / 2, 0);
    wallShape.lineTo(W / 2, EAVES);
    wallShape.lineTo(-W / 2, EAVES);
    wallShape.closePath();
    const openings: { x: number; y: number; w: number; h: number; door?: boolean }[] = [
      { x: -2.4, y: 1.5, w: 1.7, h: 1.3 },
      { x: 2.4, y: 1.5, w: 1.7, h: 1.3 },
      { x: -2.4, y: 4.15, w: 1.7, h: 1.3 },
      { x: 2.4, y: 4.15, w: 1.7, h: 1.3 },
      { x: -0.4, y: 1.05, w: 1.0, h: 2.1, door: true },
    ];
    openings.forEach((o) => {
      const hole = new THREE.Path();
      hole.moveTo(o.x - o.w / 2, o.y - o.h / 2);
      hole.lineTo(o.x + o.w / 2, o.y - o.h / 2);
      hole.lineTo(o.x + o.w / 2, o.y + o.h / 2);
      hole.lineTo(o.x - o.w / 2, o.y + o.h / 2);
      hole.closePath();
      wallShape.holes.push(hole);
      const pane = box(front, [o.w, o.h, 0.04], [o.x, o.y, D / 2 - T / 2], o.door ? frontDoorMat : glassMat, false);
      if (!o.door) outline(pane, frontEdgeMat);
    });
    const frontWall = new THREE.Mesh(new THREE.ExtrudeGeometry(wallShape, { depth: T, bevelEnabled: false }), frontMat);
    frontWall.position.z = D / 2 - T;
    frontWall.castShadow = true;
    outline(frontWall, frontEdgeMat);
    front.add(frontWall);

    // ---- Bathroom (first floor, right) ----
    const bathMat = accent("bathroom", 0xffffff, 0.3);
    const unitMat = accent("bathroom", 0x8fa5bc, 0.7);
    box(house, [1.7, 0.55, 0.75], [2.85, FLOOR2 + 0.275, -2.4], bathMat);
    box(house, [1.5, 0.04, 0.55], [2.85, FLOOR2 + 0.56, -2.4], std(0x9fe3f0, 0.15));
    box(house, [0.2, 0.75, 0.2], [1.25, FLOOR2 + 0.375, -2.6], bathMat);
    box(house, [0.62, 0.16, 0.46], [1.25, FLOOR2 + 0.83, -2.55], bathMat);
    box(house, [0.2, 0.55, 0.46], [3.7, FLOOR2 + 0.6, -0.5], bathMat);
    box(house, [0.5, 0.4, 0.4], [3.4, FLOOR2 + 0.2, -0.5], bathMat);
    box(house, [0.7, 0.9, 0.04], [1.25, FLOOR2 + 1.75, -2.82], glassMat, false);

    // Tiles: back wall first (bottom row up), then the floor
    const tileMat = accent("tiling", 0xd9f3f8, 0.25);
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
    const tileMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(tw - 0.025, 0.315, 0.025), tileMat, tiles.length);
    tileMesh.receiveShadow = true;
    house.add(tileMesh);

    // ---- Kitchen (ground floor, right) ----
    box(house, [W / 2 - T - PARTITION_X - T / 2, 0.02, zFront - zBack], [(PARTITION_X + W / 2) / 2 - 0.04, 0.012, 0], std(0x7f93a8, 0.6), false);
    box(house, [3.1, 0.9, 0.6], [2.25, 0.45, -2.5], unitMat);
    box(house, [3.2, 0.06, 0.66], [2.25, 0.93, -2.48], darkMat);
    box(house, [0.7, 0.03, 0.42], [1.5, 0.965, -2.48], whiteMat);
    box(house, [3.1, 0.7, 0.36], [2.25, 2.0, -2.64], unitMat);
    box(house, [0.72, 1.9, 0.7], [3.45, 0.95, -1.25], whiteMat);

    // ---- Living room (ground floor, left) ----
    const LX0 = -W / 2 + T + 0.01;
    const LX1 = PARTITION_X - T / 2 - 0.01;
    const plankMat = accent("flooring", 0xcaa57c, 0.55);
    const PLANKS = 19;
    const plankW = (zFront - zBack) / PLANKS;
    const plankGeo = new THREE.BoxGeometry(LX1 - LX0, 0.03, plankW - 0.02);
    plankGeo.translate((LX1 - LX0) / 2, 0, 0); // grow from the left edge
    const plankMesh = new THREE.InstancedMesh(plankGeo, plankMat, PLANKS);
    plankMesh.receiveShadow = true;
    house.add(plankMesh);

    box(house, [2.0, 0.42, 0.85], [-2.3, 0.26, -2.25], furnMat);
    box(house, [2.0, 0.55, 0.22], [-2.3, 0.72, -2.6], furnMat);
    box(house, [0.2, 0.3, 0.85], [-3.25, 0.6, -2.25], furnMat);
    box(house, [0.2, 0.3, 0.85], [-1.35, 0.6, -2.25], furnMat);
    box(house, [1.0, 0.3, 0.55], [-2.3, 0.2, -0.9], darkMat);

    // Stairs up the partition, an open door, skirting — the joinery
    const woodMat = accent("carpentry", 0xc49a6c, 0.6);
    for (let i = 0; i < 10; i++) {
      const h = 0.275 * (i + 1);
      box(house, [0.85, h, 0.3], [0, h / 2, 1.3 - i * 0.3], woodMat);
    }
    const doorPivot = new THREE.Group();
    doorPivot.position.set(PARTITION_X, 0, DOOR_Z0);
    doorPivot.rotation.y = -0.75;
    house.add(doorPivot);
    box(doorPivot, [0.05, 2.05, 0.88], [0, 1.025, 0.44], woodMat);
    box(house, [LX1 - LX0, 0.12, 0.04], [(LX0 + LX1) / 2, 0.09, zBack + 0.02], woodMat);
    box(house, [0.04, 0.12, zFront - zBack], [LX0 + 0.02, 0.09, 0], woodMat);

    // ---- Bedroom (first floor, left) ----
    box(house, [LX1 - LX0, 0.02, zFront - zBack], [(LX0 + LX1) / 2, FLOOR2 + 0.012, 0], std(0x8ea3ba, 0.95), false);
    box(house, [1.6, 0.4, 2.0], [-2.7, FLOOR2 + 0.2, -1.75], furnMat);
    box(house, [1.6, 0.14, 1.5], [-2.7, FLOOR2 + 0.47, -1.45], whiteMat);
    box(house, [1.6, 0.8, 0.12], [-2.7, FLOOR2 + 0.4, -2.72], darkMat);
    box(house, [1.1, 2.0, 0.55], [-0.35, FLOOR2 + 1.0, -2.5], furnMat);

    // Paint: a colour panel on the back wall that wipes in behind a roller
    const paintMat = accent("painting", 0x6fd0e2, 0.8);
    paintMat.emissive.set(0x1498b0);
    const PAINT_W = LX1 - LX0;
    const PAINT_H = EAVES - FLOOR2 - 0.05;
    const paintGeo = new THREE.PlaneGeometry(PAINT_W, PAINT_H);
    paintGeo.translate(PAINT_W / 2, 0, 0);
    const paint = new THREE.Mesh(paintGeo, paintMat);
    paint.position.set(LX0, FLOOR2 + PAINT_H / 2, zBack + 0.012);
    paint.receiveShadow = true;
    house.add(paint);
    const roller = new THREE.Group();
    const rollerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.6, 16), accent("painting", 0xff9248, 0.9));
    roller.add(rollerHead);
    const rollerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), darkMat);
    rollerHandle.rotation.x = Math.PI / 2.6;
    rollerHandle.position.set(0, -0.2, 0.3);
    roller.add(rollerHandle);
    house.add(roller);
    showOnlyFor("painting", roller);

    // ---- Plumbing: wastes and supplies to the stack, and the drain ----
    const pipeMat = accent("plumbing", 0xe08a52, 0.3, 0.9);
    const PZ = zBack + 0.1;
    const pipeRuns: V3[][] = [
      [[1.25, FLOOR2 + 0.75, PZ], [1.25, FLOOR2 + 0.12, PZ], [3.68, FLOOR2 + 0.12, PZ]],
      [[2.85, FLOOR2 + 0.3, PZ], [2.85, FLOOR2 + 0.12, PZ]],
      [[3.4, FLOOR2 + 0.2, -0.75], [3.68, FLOOR2 + 0.2, -0.75], [3.68, FLOOR2 + 0.2, PZ]],
      [[1.5, 0.9, PZ], [1.5, 0.12, PZ], [3.68, 0.12, PZ]],
    ];
    pipeRuns.forEach((run) => house.add(polylineTube(run, 0.06, pipeMat)));
    house.add(polylineTube([[3.68, FLOOR2 + 0.9, PZ], [3.68, 0.05, PZ]], 0.08, pipeMat));
    // Outside: soil stack on the gable wall down to a gully
    house.add(polylineTube([[W / 2 + 0.12, EAVES - 0.3, -1.6], [W / 2 + 0.12, 0.1, -1.6], [W / 2 + 0.6, 0.02, -1.6]], 0.085, pipeMat));
    box(house, [0.5, 0.1, 0.5], [W / 2 + 0.75, -0.02, -1.6], darkMat);

    // ---- Electrics: consumer unit, pendants, sockets, and circuit traces ----
    const elecMat = accent("electrical", 0xf2f6fa, 0.4);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffc56b, emissiveIntensity: 0.5 });
    owned.push(bulbMat);
    const CU: V3 = [3.7, 1.6, 1.4];
    box(house, [0.14, 0.5, 0.38], CU, elecMat);
    const lights: V3[] = [
      [-1.75, FLOOR2 - 0.15, 0],
      [2.25, FLOOR2 - 0.15, 0],
      [-1.75, EAVES - 0.05, 0],
      [2.25, EAVES - 0.05, 0],
    ];
    lights.forEach(([x, y, z]) => {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 6), darkMat);
      cord.position.set(x, y - 0.225, z);
      house.add(cord);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), bulbMat);
      bulb.position.set(x, y - 0.5, z);
      house.add(bulb);
    });
    const sockets: V3[] = [
      [-3.0, 0.4, zBack + 0.03],
      [1.0, 1.2, zBack + 0.03],
      [-1.4, FLOOR2 + 0.4, zBack + 0.03],
      [2.0, FLOOR2 + 1.2, zBack + 0.03],
    ];
    sockets.forEach((p) => box(house, [0.2, 0.14, 0.03], p, elecMat, false));

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xffb37a, toneMapped: false });
    owned.push(wireMat);
    const RX = W / 2 - T - 0.03; // inside face of the right wall
    const BZ = zBack + 0.03; // inside face of the back wall
    const c1 = FLOOR2 - 0.18; // ground-floor ceiling
    const c2 = EAVES - 0.04; // first-floor ceiling
    const wireRuns: V3[][] = [
      [[RX, 1.85, CU[2]], [RX, c1, CU[2]], [RX, c1, 0], [2.25, c1, 0], [-1.75, c1, 0]],
      [[RX, 1.85, CU[2]], [RX, c1, CU[2]], [RX, c1, BZ], [RX, c2, BZ], [RX, c2, 0], [2.25, c2, 0], [-1.75, c2, 0]],
      [[RX, 1.35, CU[2]], [RX, 0.4, CU[2]], [RX, 0.4, BZ], [1.0, 0.4, BZ], [1.0, 1.2, BZ]],
      [[1.0, 0.4, BZ], [-3.0, 0.4, BZ]],
      [[RX, c1, BZ], [RX, FLOOR2 + 0.4, BZ], [2.0, FLOOR2 + 0.4, BZ], [2.0, FLOOR2 + 1.2, BZ]],
      [[2.0, FLOOR2 + 0.4, BZ], [-1.4, FLOOR2 + 0.4, BZ]],
    ];
    const wires = wireRuns.map((run) => {
      const m = polylineTube(run, 0.028, wireMat);
      house.add(m);
      showOnlyFor("electrical", m);
      return m;
    });

    // ---- Damp: a patch low on the living-room wall that gets treated ----
    const dampTex = blotchTexture();
    const dampMat = new THREE.MeshBasicMaterial({ map: dampTex, transparent: true, opacity: 0, depthWrite: false });
    owned.push(dampMat);
    const damp = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.7), dampMat);
    damp.rotation.y = Math.PI / 2;
    damp.position.set(LX0 + 0.04, 0.85, -1.5);
    house.add(damp);
    const scanMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false });
    owned.push(scanMat);
    const scan = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 1.9), scanMat);
    scan.rotation.y = Math.PI / 2;
    scan.position.set(LX0 + 0.05, 0.95, -2.8);
    house.add(scan);
    box(house, [0.05, 1.9, 2.7], [LX0 + 0.005, 0.95, -1.5], accent("damp", 0xd3deea, 0.9), false).visible = true;

    // ---- Leak tracing: pulses on the roof where water gets in ----
    const pulseMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.9, toneMapped: false, side: THREE.DoubleSide });
    owned.push(pulseMat);
    const pulses = [
      [2.4, 0.75],
      [-1.6, 1.7],
      [0.6, 2.9],
    ].map(([x, down]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.3, 32), pulseMat);
      // lie on the front slope, `down` metres below the ridge
      ring.position.set(x, EAVES + RISE - Math.sin(pitch) * down + 0.09, Math.cos(pitch) * down);
      ring.rotation.x = -Math.PI / 2 + pitch;
      house.add(ring);
      showOnlyFor("leak", ring);
      return ring;
    });

    // ---- Garden: path, fence and gate ----
    const fenceMat = accent("fencing", 0xb58d63, 0.7);
    box(house, [1.0, 0.04, 3.4], [-0.4, -0.13, D / 2 + 1.7], slabMat);
    const FZ = D / 2 + 3.5;
    const GATE0 = -0.95;
    const GATE1 = 0.15;
    const panel = (x0: number, x1: number) => {
      box(house, [x1 - x0, 1.0, 0.05], [(x0 + x1) / 2, 0.42, FZ], fenceMat);
      box(house, [x1 - x0, 0.07, 0.09], [(x0 + x1) / 2, 0.8, FZ], fenceMat);
    };
    panel(-5, GATE0);
    panel(GATE1, 5);
    for (let x = -5; x <= 5.01; x += 1.25) {
      if (x > GATE0 + 0.2 && x < GATE1 - 0.2) continue;
      box(house, [0.12, 1.2, 0.12], [x, 0.45, FZ], fenceMat);
    }
    [GATE0, GATE1].forEach((x) => box(house, [0.14, 1.3, 0.14], [x, 0.5, FZ], fenceMat));
    const gatePivot = new THREE.Group();
    gatePivot.position.set(GATE0, 0, FZ);
    gatePivot.rotation.y = 0.7;
    house.add(gatePivot);
    box(gatePivot, [GATE1 - GATE0 - 0.1, 0.95, 0.05], [(GATE1 - GATE0) / 2, 0.42, 0], fenceMat);
    [-5, 5].forEach((x) => box(house, [0.05, 1.0, 3.5], [x, 0.42, FZ - 1.75], fenceMat));

    // ---- Instanced reveal helpers ----
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
    setTiles(1);
    setPlanks(1);
    const wireCounts = wires.map((w) => w.geometry.index!.count);

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
    let currentIdx = -1;
    let stopStart = performance.now();
    const t0 = performance.now();
    let last = t0;
    let raf = 0;
    let disposed = false;
    let readyFired = false;
    let tilesDone = true;
    let planksDone = true;

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
        tilesDone = false;
        planksDone = false;
      }
      const stop = houseStops[idx];
      const stopT = reduceMotion ? 99 : (now - stopStart) / 1000;
      // Let the camera arrive before the work animation starts
      const work = (duration: number) => smooth((stopT - 0.9) / duration);

      // Camera
      wantTarget.set(...stop.target);
      if (stop.key === "overview" && !reduceMotion) {
        const a = 0.55 + Math.sin(t * 0.16) * 0.5;
        wantPos.set(Math.sin(a) * 17 , 8.5, Math.cos(a) * 17 + 0.5);
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

      // Front wall + front roof slope fade for cutaway stops
      shellOpacity += ((stop.shell ? 1 : 0) - shellOpacity) * k(4.5);
      frontMat.opacity = frontRoofMat.opacity = frontDoorMat.opacity = shellOpacity;
      glassMat.opacity = 0.45 * shellOpacity;
      frontEdgeMat.opacity = 0.55 * shellOpacity;
      frontMat.depthWrite = frontRoofMat.depthWrite = shellOpacity > 0.6;
      front.visible = shellOpacity > 0.02;
      frontWall.castShadow = frontSlope.castShadow = shellOpacity > 0.6;

      // Highlights
      houseStops.forEach((s, i) => {
        weights[i] += ((i === idx ? 1 : 0) - weights[i]) * k(4.5);
        const w = weights[i];
        const glow = w * (0.55 + Math.sin(t * 3) * 0.12);
        accents.get(s.key)?.forEach((m) => (m.emissiveIntensity = glow));
        activeOnly.get(s.key)?.forEach((o) => (o.visible = w > 0.04));
      });

      // Per-stop work animations (everything rests "finished" when inactive)
      if (stop.key === "tiling") {
        const p = work(2.6);
        setTiles(p);
        tilesDone = p >= 1;
      } else if (!tilesDone) {
        setTiles(1);
        tilesDone = true;
      }
      if (stop.key === "flooring") {
        const p = work(2.4);
        setPlanks(p);
        planksDone = p >= 1;
      } else if (!planksDone) {
        setPlanks(1);
        planksDone = true;
      }

      const paintP = stop.key === "painting" ? work(3) : 1;
      paint.scale.x = Math.max(0.0001, paintP);
      roller.visible = stop.key === "painting" && paintP < 1 && paintP > 0;
      roller.position.set(LX0 + PAINT_W * paintP, FLOOR2 + PAINT_H / 2 + Math.sin(t * 5) * (PAINT_H / 2 - 0.4), zBack + 0.14);

      if (stop.key === "electrical") {
        const p = work(2.8);
        wires.forEach((w, i) => w.geometry.setDrawRange(0, Math.floor((wireCounts[i] * p) / 48) * 48));
        bulbMat.emissiveIntensity = 0.5 + smooth(p * 1.5 - 0.5) * (2.4 + Math.sin(t * 4) * 0.25);
      } else {
        bulbMat.emissiveIntensity += (0.5 - bulbMat.emissiveIntensity) * k(5);
      }

      if (stop.key === "damp") {
        // patch shows, a scan line sweeps across, the patch clears behind it
        const appear = smooth((stopT - 0.6) / 0.9);
        const sweep = smooth((stopT - 3.2) / 2.2);
        dampMat.opacity = appear * (1 - sweep) * 0.95;
        scanMat.opacity = sweep > 0 && sweep < 1 ? 0.9 : 0;
        scan.position.z = -2.8 + sweep * 2.6;
      } else {
        dampMat.opacity *= 1 - k(6);
        scanMat.opacity = 0;
      }

      pulses.forEach((ring, i) => {
        const ph = (t * 0.6 + i * 0.33) % 1;
        ring.scale.setScalar(0.7 + ph * 1.3);
      });
      pulseMat.opacity = 0.35 + (1 - ((t * 0.6) % 1)) * 0.6;

      renderer.render(scene, camera);
      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    };

    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
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
      dampTex.dispose();
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
