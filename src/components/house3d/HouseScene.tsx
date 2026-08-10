import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { houseServices } from "./houseServices";

/**
 * Procedural 3D house used in the homepage About section. Built from
 * geometry rather than a loaded model file deliberately — it keeps the
 * payload to the three.js runtime alone (no extra MB of GLTF/textures to
 * download) and means the whole thing is version-controlled code rather
 * than a binary asset nobody can edit later.
 *
 * This component is ONLY ever dynamically imported, and only once the
 * section scrolls into view — see ServiceShowcase.tsx. three.js is a
 * substantial dependency and must never sit in the initial bundle.
 */

const WALL = 0xd8cfc4;
const WALL_DARK = 0xc4b8aa;
const ROOF = 0x4a5568;
const TRIM = 0xf8fafc;
const GLASS = 0x8fb6d1;
const DOOR = 0x1e3a5f;
const GROUND = 0x9db088;
const ACCENT = 0xf97316;

export function HouseScene({
  activeIndex,
  onReady,
}: {
  activeIndex: number;
  onReady?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  const [failed, setFailed] = useState(false);
  activeRef.current = activeIndex;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // WebGL isn't universally available — bail out cleanly rather than
    // throwing, so the static fallback stays on screen.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    // 45° vertical FOV — camera positions in houseServices.ts were framed
    // against this value for a portrait (4:5) container. Changing it will
    // crop the house.
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    const setSize = () => {
      // Guard against a not-yet-laid-out container — a zero height would
      // make camera.aspect NaN and the scene would never render.
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
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    setSize();

    // ---- Lighting: warm key light + cool sky fill reads as daylight ----
    const sun = new THREE.DirectionalLight(0xfff4e6, 2.6);
    sun.position.set(6, 9, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 30;
    sun.shadow.bias = -0.0008;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x6b7a52, 1.1));
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const group = new THREE.Group();
    scene.add(group);

    const mat = (color: number, roughness = 0.85, metalness = 0.0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    // ---- Ground ----
    const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 48), mat(GROUND, 0.95));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);

    // ---- Main body ----
    const W = 4.2, D = 3.2, H = 2.4;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, mat(WALL, 0.9));
    body.position.y = H / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Slight tonal shift on the side wall so the form reads in 3D
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.02, H, D), mat(WALL_DARK, 0.9));
    sideWall.position.set(-W / 2 - 0.005, H / 2, 0);
    group.add(sideWall);

    // ---- Pitched roof ----
    const RISE = 1.25;
    const halfW = W / 2;
    const slopeLen = Math.hypot(halfW, RISE);
    const angle = Math.atan2(RISE, halfW);
    const OVER = 0.22; // overhang

    for (const dir of [-1, 1]) {
      const slope = new THREE.Mesh(
        new THREE.BoxGeometry(slopeLen + OVER, 0.1, D + OVER * 2),
        mat(ROOF, 0.75)
      );
      slope.position.set(dir * (halfW / 2), H + RISE / 2, 0);
      slope.rotation.z = -dir * angle;
      slope.castShadow = true;
      slope.receiveShadow = true;
      group.add(slope);
    }

    // Gable triangles (front + back)
    const gable = new THREE.Shape();
    gable.moveTo(-halfW, 0);
    gable.lineTo(halfW, 0);
    gable.lineTo(0, RISE);
    gable.closePath();
    for (const z of [D / 2, -D / 2]) {
      const g = new THREE.Mesh(new THREE.ShapeGeometry(gable), mat(WALL, 0.9));
      g.position.set(0, H, z);
      if (z < 0) g.rotation.y = Math.PI;
      g.castShadow = true;
      group.add(g);
    }

    // ---- Chimney ----
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 0.42), mat(0xb5a294, 0.95));
    chimney.position.set(1.2, H + 0.85, -0.7);
    chimney.castShadow = true;
    group.add(chimney);

    // ---- Windows (reusable) ----
    const addWindow = (x: number, y: number, z: number, w = 0.68, h = 0.86, ry = 0) => {
      const win = new THREE.Group();
      const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.09), mat(TRIM, 0.6));
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(w - 0.13, h - 0.13, 0.04),
        new THREE.MeshStandardMaterial({ color: GLASS, roughness: 0.15, metalness: 0.55 })
      );
      glass.position.z = 0.04;
      // Glazing bar
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.035, h - 0.13, 0.05), mat(TRIM, 0.6));
      bar.position.z = 0.06;
      win.add(frame, glass, bar);
      win.position.set(x, y, z);
      win.rotation.y = ry;
      win.castShadow = true;
      group.add(win);
      return win;
    };

    // Front elevation
    addWindow(-1.25, 1.72, D / 2 + 0.02);
    addWindow(1.25, 1.72, D / 2 + 0.02);
    addWindow(-1.25, 0.82, D / 2 + 0.02);
    // Side elevation
    addWindow(-W / 2 - 0.02, 1.72, -0.7, 0.6, 0.8, -Math.PI / 2);
    addWindow(-W / 2 - 0.02, 0.82, -0.7, 0.6, 0.8, -Math.PI / 2);

    // ---- Front door + step ----
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.5, 0.1), mat(DOOR, 0.5));
    door.position.set(1.25, 0.75, D / 2 + 0.02);
    door.castShadow = true;
    group.add(door);
    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.9 })
    );
    handle.position.set(1.53, 0.75, D / 2 + 0.09);
    group.add(handle);
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.45), mat(0xcfcac2, 0.95));
    step.position.set(1.25, 0.05, D / 2 + 0.24);
    step.receiveShadow = true;
    group.add(step);

    // ---- Soil / drainage pipe (plumbing hotspot anchor) ----
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 2.3, 12), mat(0xe8e4dd, 0.7));
    pipe.position.set(W / 2 + 0.1, 1.15, -0.55);
    pipe.castShadow = true;
    group.add(pipe);

    // ---- Guttering ----
    for (const dir of [-1, 1]) {
      const gutter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, D + OVER * 2), mat(0xe8e4dd, 0.7));
      gutter.position.set(dir * (halfW + 0.12), H + 0.02, 0);
      group.add(gutter);
    }

    // ---- Garden fence (fencing hotspot anchor) ----
    const fence = new THREE.Group();
    for (let i = 0; i <= 9; i++) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.78, 0.06), mat(0xa9825c, 0.95));
      post.position.set(-3.4 + i * 0.6, 0.39, 0);
      post.castShadow = true;
      fence.add(post);
    }
    for (const y of [0.28, 0.6]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.075, 0.045), mat(0x9a744f, 0.95));
      rail.position.set(-0.7, y, 0);
      fence.add(rail);
    }
    fence.position.set(0, 0, D / 2 + 2.5);
    group.add(fence);

    // ---- Hotspot markers ----
    const markerGroup = new THREE.Group();
    group.add(markerGroup);
    const markers: THREE.Mesh[] = [];
    houseServices.forEach((svc) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 16, 16),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0 })
      );
      m.position.set(...svc.marker);
      markerGroup.add(m);
      markers.push(m);
    });

    // ---- Camera animation between service viewpoints ----
    const camPos = new THREE.Vector3(9, 6, 10);
    const camTarget = new THREE.Vector3(0, 1.3, 0);
    const desiredPos = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3();
    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    let raf = 0;
    let t = 0;
    let disposed = false;
    let readyFired = false;

    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    const animate = () => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      t += 0.016;

      const svc = houseServices[activeRef.current] ?? houseServices[0];
      desiredPos.set(...svc.camera);
      desiredTarget.set(...svc.target);

      // Gentle idle drift so the scene never looks frozen
      if (!reduceMotion) {
        desiredPos.x += Math.sin(t * 0.35) * 0.28;
        desiredPos.y += Math.sin(t * 0.27) * 0.14;
      }

      const ease = reduceMotion ? 1 : 0.032;
      camPos.lerp(desiredPos, ease);
      camTarget.lerp(desiredTarget, ease);
      camera.position.copy(camPos);
      camera.lookAt(camTarget);

      // Pulse only the active marker
      markers.forEach((m, i) => {
        const isActive = i === activeRef.current;
        const target = isActive ? 0.9 : 0;
        const matr = m.material as THREE.MeshBasicMaterial;
        matr.opacity += (target - matr.opacity) * 0.09;
        const pulse = isActive && !reduceMotion ? 1 + Math.sin(t * 3.4) * 0.22 : 1;
        m.scale.setScalar(pulse);
      });

      renderer.render(scene, camera);

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
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [onReady]);

  if (failed) return null;
  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

export default HouseScene;
