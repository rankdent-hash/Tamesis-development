import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { houseServices } from "./houseServices";
import { stoneTexture, brickTexture, slateTexture, grassTexture, pavingTexture } from "./textures";

/**
 * Procedural British-style house, modelled on the stone-and-slate
 * reference: two storeys, pitched slate roof with dormers, multi-pane
 * timber windows, chimney stack, stone quoins, garden wall.
 *
 * Everything is generated in code (geometry + canvas textures) rather than
 * loaded from a model file — no binary assets, no licensing questions, and
 * the whole thing stays editable. The trade-off is that it reads as a good
 * architectural render rather than a photograph; genuine photorealism
 * needs a modelled-and-textured asset.
 *
 * ONLY ever dynamically imported once the section is in view — see
 * ServiceShowcase.tsx. three.js must not sit in the initial bundle.
 */

const TRIM = 0xf2f0ea;
const DOOR_COL = 0x5a3825;

export function HouseScene({
  activeIndex,
  onReady,
}: {
  activeIndex: number;
  onReady?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  const [failed, setFailed] = useState(false);
  activeRef.current = activeIndex;

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

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcddcea, 24, 50);
    // 45deg vertical FOV - camera positions in houseServices.ts are framed
    // against this. Changing it will crop the house.
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });
    setSize();

    // ---- Textures ----
    const stone = stoneTexture([2.4, 1.8]);
    const brick = brickTexture([3, 2.4]);
    const slate = slateTexture([3, 3.5]);
    const grass = grassTexture([14, 14]);
    const paving = pavingTexture([2, 2]);

    // ---- Lighting: warm sun + cool sky bounce reads as bright UK daylight ----
    const sun = new THREE.DirectionalLight(0xfff1dc, 2.9);
    sun.position.set(7, 11, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -12; sc.right = 12; sc.top = 12; sc.bottom = -12; sc.near = 0.5; sc.far = 40;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xc9dcf5, 0x5d6b45, 1.25));
    scene.add(new THREE.AmbientLight(0xffffff, 0.28));
    // Soft fill so the shaded elevation doesn't go black
    const fill = new THREE.DirectionalLight(0xd6e4ff, 0.5);
    fill.position.set(-8, 5, -4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const stdMat = (t: { map: THREE.Texture; bumpMap: THREE.Texture }, bump = 0.35, rough = 0.92) =>
      new THREE.MeshStandardMaterial({ map: t.map, bumpMap: t.bumpMap, bumpScale: bump, roughness: rough });
    const flat = (color: number, roughness = 0.8, metalness = 0.0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    // ---- Dimensions ----
    const W = 5.4, D = 4.0, H = 3.2;
    const halfW = W / 2, halfD = D / 2;
    const RISE = 1.75;
    const apex = H + RISE;

    // ---- Ground ----
    const ground = new THREE.Mesh(new THREE.CircleGeometry(20, 56), stdMat(grass, 0.12, 1));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);

    // ---- Main body ----
    const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), stdMat(stone, 0.42));
    body.position.y = H / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Stone quoins at the corners (a strong cue in the reference)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const q = new THREE.Mesh(new THREE.BoxGeometry(0.42, H, 0.42), stdMat(stone, 0.5));
        q.position.set(sx * (halfW - 0.14), H / 2, sz * (halfD - 0.14));
        q.castShadow = true;
        group.add(q);
      }
    }

    // ---- Roof ----
    const slopeLen = Math.hypot(halfW, RISE);
    const angle = Math.atan2(RISE, halfW);
    const OVER = 0.3;
    const roofMat = stdMat(slate, 0.5, 0.85);

    for (const dir of [-1, 1]) {
      const slope = new THREE.Mesh(new THREE.BoxGeometry(slopeLen + OVER, 0.14, D + OVER * 2), roofMat);
      slope.position.set(dir * (halfW / 2), H + RISE / 2, 0);
      slope.rotation.z = -dir * angle;
      slope.castShadow = true;
      slope.receiveShadow = true;
      group.add(slope);
    }

    // Ridge capping
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, D + OVER * 2), flat(0x2f353d, 0.85));
    ridge.position.set(0, apex + 0.03, 0);
    ridge.castShadow = true;
    group.add(ridge);

    // Gable ends
    const gableShape = new THREE.Shape();
    gableShape.moveTo(-halfW, 0);
    gableShape.lineTo(halfW, 0);
    gableShape.lineTo(0, RISE);
    gableShape.closePath();
    for (const z of [halfD, -halfD]) {
      const g = new THREE.Mesh(new THREE.ShapeGeometry(gableShape), stdMat(stone, 0.42));
      g.position.set(0, H, z + (z > 0 ? 0.002 : -0.002));
      if (z < 0) g.rotation.y = Math.PI;
      g.castShadow = true;
      g.receiveShadow = true;
      group.add(g);
    }

    // ---- Chimney stack with pots ----
    const stack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 2.0, 0.52), stdMat(brick, 0.35));
    stack.position.set(halfW - 0.9, H + 1.25, -1.2);
    stack.castShadow = true;
    group.add(stack);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.1, 0.64), flat(0x9a958c, 0.9));
    cap.position.set(halfW - 0.9, H + 2.28, -1.2);
    group.add(cap);
    for (const dx of [-0.14, 0.14]) {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.34, 12), flat(0xa46a4a, 0.9));
      pot.position.set(halfW - 0.9 + dx, H + 2.5, -1.2);
      pot.castShadow = true;
      group.add(pot);
    }

    // ---- Multi-pane window builder (British timber-sash look) ----
    const makeWindow = (w: number, h: number, cols: number, rows: number) => {
      const g = new THREE.Group();
      const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.1), flat(TRIM, 0.55));
      g.add(frame);
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x2c4356, roughness: 0.08, metalness: 0.72 })
      );
      glass.position.z = 0.045;
      g.add(glass);
      const barMat = flat(TRIM, 0.55);
      for (let i = 1; i < cols; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.028, h, 0.05), barMat);
        b.position.set(-w / 2 + (w / cols) * i, 0, 0.06);
        g.add(b);
      }
      for (let i = 1; i < rows; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.028, 0.05), barMat);
        b.position.set(0, -h / 2 + (h / rows) * i, 0.06);
        g.add(b);
      }
      const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.34, 0.1, 0.2), flat(0xc9c1b2, 0.9));
      sill.position.set(0, -h / 2 - 0.11, 0.06);
      sill.castShadow = true;
      g.add(sill);
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.13, 0.14), flat(0xc9c1b2, 0.9));
      lintel.position.set(0, h / 2 + 0.12, 0.04);
      lintel.castShadow = true;
      g.add(lintel);
      return g;
    };

    const placeWindow = (
      x: number, y: number, z: number,
      w: number, h: number, cols: number, rows: number, ry = 0
    ) => {
      const win = makeWindow(w, h, cols, rows);
      win.position.set(x, y, z);
      win.rotation.y = ry;
      group.add(win);
      return win;
    };

    // Front elevation - ground floor
    placeWindow(-1.72, 1.15, halfD + 0.05, 0.95, 1.15, 3, 4);
    placeWindow(1.72, 1.15, halfD + 0.05, 0.95, 1.15, 3, 4);
    // Front elevation - first floor
    placeWindow(-1.72, 2.55, halfD + 0.05, 0.85, 1.0, 3, 3);
    placeWindow(0, 2.55, halfD + 0.05, 0.85, 1.0, 3, 3);
    placeWindow(1.72, 2.55, halfD + 0.05, 0.85, 1.0, 3, 3);
    // Side elevation
    placeWindow(-halfW - 0.05, 1.15, -1.0, 0.8, 1.1, 2, 4, -Math.PI / 2);
    placeWindow(-halfW - 0.05, 2.55, -1.0, 0.8, 1.0, 2, 3, -Math.PI / 2);
    placeWindow(-halfW - 0.05, 1.15, 1.0, 0.8, 1.1, 2, 4, -Math.PI / 2);

    // ---- Dormer windows in the front roof slope ----
    const makeDormer = (x: number) => {
      const d = new THREE.Group();
      const cheekW = 0.75, cheekH = 0.8, cheekD = 0.85;
      const face = new THREE.Mesh(new THREE.BoxGeometry(cheekW, cheekH, cheekD), stdMat(slate, 0.35, 0.9));
      face.castShadow = true;
      d.add(face);
      const dRise = 0.3, dHalf = (cheekW + 0.16) / 2;
      const dSlope = Math.hypot(dHalf, dRise);
      const dAng = Math.atan2(dRise, dHalf);
      for (const dir of [-1, 1]) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(dSlope + 0.06, 0.08, cheekD + 0.16), roofMat);
        s.position.set(dir * (dHalf / 2), cheekH / 2 + dRise / 2, 0);
        s.rotation.z = -dir * dAng;
        s.castShadow = true;
        d.add(s);
      }
      const w = makeWindow(0.5, 0.55, 2, 2);
      w.position.set(0, 0.03, cheekD / 2 + 0.03);
      d.add(w);
      d.position.set(x, H + 0.72, halfD - 0.72);
      group.add(d);
      return d;
    };
    makeDormer(-1.3);
    makeDormer(1.3);

    // ---- Front door with stone surround ----
    const doorX = 0;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.05, 0.1), flat(DOOR_COL, 0.55));
    door.position.set(doorX, 1.03, halfD + 0.04);
    door.castShadow = true;
    group.add(door);
    for (const py of [0.55, 1.45]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.6, 0.02), flat(0x4a2d1d, 0.6));
      p.position.set(doorX, py, halfD + 0.1);
      group.add(p);
    }
    const surroundMat = flat(0xc9c1b2, 0.9);
    for (const sx of [-0.62, 0.62]) {
      const j = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.3, 0.22), surroundMat);
      j.position.set(doorX + sx, 1.15, halfD + 0.06);
      j.castShadow = true;
      group.add(j);
    }
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.24, 0.24), surroundMat);
    head.position.set(doorX, 2.36, halfD + 0.06);
    head.castShadow = true;
    group.add(head);
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.25, metalness: 0.95 })
    );
    knob.position.set(doorX + 0.34, 1.03, halfD + 0.11);
    group.add(knob);

    // ---- Doorstep + path ----
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.6), stdMat(paving, 0.12, 0.95));
    step.position.set(doorX, 0.06, halfD + 0.36);
    step.receiveShadow = true;
    group.add(step);
    const path = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 3.4), stdMat(paving, 0.12, 0.95));
    path.position.set(doorX, 0.025, halfD + 2.35);
    path.receiveShadow = true;
    group.add(path);

    // ---- Rainwater goods (plumbing / drainage anchor) ----
    const dpMat = flat(0x3b4048, 0.7);
    const downpipe = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, H, 14), dpMat);
    downpipe.position.set(halfW + 0.12, H / 2, halfD - 0.35);
    downpipe.castShadow = true;
    group.add(downpipe);
    const shoe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.34, 12), dpMat);
    shoe.position.set(halfW + 0.12, 0.2, halfD - 0.55);
    shoe.rotation.x = Math.PI / 5;
    group.add(shoe);
    for (const dir of [-1, 1]) {
      const gutter = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.13, D + OVER * 2), dpMat);
      gutter.position.set(dir * (halfW + 0.14), H + 0.03, 0);
      gutter.castShadow = true;
      group.add(gutter);
    }

    // ---- Garden wall + railings (fencing anchor) ----
    const gwZ = halfD + 4.4;
    const gwall = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.62, 0.34), stdMat(stone, 0.4));
    gwall.position.set(-0.4, 0.31, gwZ);
    gwall.castShadow = true;
    gwall.receiveShadow = true;
    group.add(gwall);
    const coping = new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.09, 0.44), flat(0xbdb5a6, 0.9));
    coping.position.set(-0.4, 0.66, gwZ);
    coping.castShadow = true;
    group.add(coping);
    const railMat = flat(0x24282d, 0.5, 0.6);
    for (let i = 0; i <= 26; i++) {
      const x = -5.1 + i * 0.36;
      if (Math.abs(x - doorX) < 0.8) continue; // gateway gap
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.62, 8), railMat);
      bar.position.set(x, 1.02, gwZ);
      group.add(bar);
    }
    for (const yy of [1.3, 0.78]) {
      for (const seg of [[-5.2, -0.85], [0.85, 4.4]]) {
        const len = seg[1] - seg[0];
        const r = new THREE.Mesh(new THREE.BoxGeometry(len, 0.04, 0.04), railMat);
        r.position.set(seg[0] + len / 2, yy, gwZ);
        group.add(r);
      }
    }

    // ---- Hedge + trees for context ----
    const hedge = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.7, 0.6), flat(0x46603a, 0.98));
    hedge.position.set(-3.2, 0.35, halfD + 1.5);
    hedge.castShadow = true;
    group.add(hedge);

    const makeTree = (x: number, z: number, s: number) => {
      const t = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.16 * s, 1.5 * s, 10), flat(0x5b4634, 0.95));
      trunk.position.y = 0.75 * s;
      trunk.castShadow = true;
      t.add(trunk);
      const blobs: [number, number][] = [[1.7, 0.95], [2.35, 0.78], [2.85, 0.52]];
      for (const [oy, r] of blobs) {
        const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), flat(0x3f5c33, 0.99));
        b.position.y = oy * s;
        b.castShadow = true;
        t.add(b);
      }
      t.position.set(x, 0, z);
      group.add(t);
    };
    makeTree(-6.2, 1.0, 1.15);
    makeTree(6.4, -0.5, 1.0);

    // ---- Hotspot markers ----
    const markers: THREE.Mesh[] = [];
    const rings: THREE.Mesh[] = [];
    houseServices.forEach((svc) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0, depthTest: false })
      );
      m.position.set(...svc.marker);
      m.renderOrder = 999;
      group.add(m);
      markers.push(m);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.26, 28),
        new THREE.MeshBasicMaterial({
          color: 0xf97316, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false,
        })
      );
      ring.position.copy(m.position);
      ring.renderOrder = 998;
      group.add(ring);
      rings.push(ring);
    });

    // ---- Camera ----
    const camPos = new THREE.Vector3(...houseServices[0].camera);
    const camTarget = new THREE.Vector3(...houseServices[0].target);
    const desiredPos = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3();
    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    const projected = new THREE.Vector3();
    let raf = 0, t = 0, disposed = false, readyFired = false;

    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    const animate = () => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      t += 0.016;

      const idx = activeRef.current;
      const svc = houseServices[idx] ?? houseServices[0];
      desiredPos.set(...svc.camera);
      desiredTarget.set(...svc.target);

      if (!reduceMotion) {
        desiredPos.x += Math.sin(t * 0.3) * 0.35;
        desiredPos.y += Math.sin(t * 0.23) * 0.16;
      }

      const ease = reduceMotion ? 1 : 0.03;
      camPos.lerp(desiredPos, ease);
      camTarget.lerp(desiredTarget, ease);
      camera.position.copy(camPos);
      camera.lookAt(camTarget);

      markers.forEach((m, i) => {
        const isActive = i === idx;
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.opacity += ((isActive ? 0.95 : 0) - mat.opacity) * 0.1;
        m.scale.setScalar(isActive && !reduceMotion ? 1 + Math.sin(t * 3.2) * 0.2 : 1);

        const ring = rings[i];
        ring.quaternion.copy(camera.quaternion);
        const phase = (t * 0.7) % 1;
        ring.scale.setScalar(reduceMotion ? 1 : 1 + phase * 1.5);
        (ring.material as THREE.MeshBasicMaterial).opacity = isActive
          ? Math.max(0, 0.7 - phase * 0.7)
          : 0;
      });

      renderer.render(scene, camera);

      // Position the HTML label beside the active hotspot, in screen space
      const label = labelRef.current;
      if (label) {
        projected.set(...svc.marker).project(camera);
        const w = mount.clientWidth, h = mount.clientHeight;
        const sx = (projected.x * 0.5 + 0.5) * w;
        const sy = (-projected.y * 0.5 + 0.5) * h;
        const flip = sx > w * 0.56;
        label.style.transform = `translate(${flip ? "-100%" : "0"}, -50%)`;
        label.style.left = `${flip ? sx - 20 : sx + 20}px`;
        label.style.top = `${Math.max(28, Math.min(h - 28, sy))}px`;
      }

      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      [stone, brick, slate, grass, paving].forEach((tx) => {
        tx.map.dispose();
        tx.bumpMap.dispose();
      });
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onReady]);

  if (failed) return null;

  const svc = houseServices[activeIndex] ?? houseServices[0];

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      <div
        ref={labelRef}
        className="absolute pointer-events-none z-10"
        style={{ left: 0, top: 0 }}
        aria-hidden="true"
      >
        <div className="whitespace-nowrap rounded-lg bg-navy-950/90 backdrop-blur-sm px-3 py-2 shadow-lg border-l-[3px] border-orange-500">
          <div className="text-[9px] font-accent uppercase tracking-widest text-orange-400 font-semibold leading-none">
            {svc.location}
          </div>
          <div className="mt-1 font-display font-bold text-white text-[13px] leading-tight">{svc.name}</div>
        </div>
      </div>
    </>
  );
}

export default HouseScene;
