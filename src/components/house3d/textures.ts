import * as THREE from "three";

/**
 * Procedural textures drawn to a canvas at runtime, then used as three.js
 * maps. This is what lifts the house from "flat coloured boxes" to
 * something that reads as actual brick and slate — without shipping any
 * image files, and without the licensing questions that come with using
 * downloaded texture packs.
 *
 * Each generator returns { map, bumpMap } so surfaces catch light with
 * real relief rather than looking painted on.
 */

function canvas(size = 512) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return { c, ctx: c.getContext("2d")! };
}

function toTexture(c: HTMLCanvasElement, repeat: [number, number]) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}

/** Grayscale copy of a canvas, used as a bump map. */
function bumpFrom(src: HTMLCanvasElement, repeat: [number, number]) {
  const { c, ctx } = canvas(src.width);
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, repeat);
}

/** Coursed natural stone, as on the reference elevation. */
export function stoneTexture(repeat: [number, number] = [3, 2]) {
  const { c, ctx } = canvas(512);
  // Mortar bed
  ctx.fillStyle = "#8d8274";
  ctx.fillRect(0, 0, 512, 512);

  const courseH = 34;
  let y = 0;
  let row = 0;
  while (y < 512) {
    let x = row % 2 ? -18 : 0;
    while (x < 512) {
      // Irregular block widths read as natural stone rather than brick
      const w = 40 + Math.random() * 52;
      const h = courseH - 4;
      const base = 150 + Math.random() * 45;
      const warm = 12 + Math.random() * 18;
      ctx.fillStyle = `rgb(${(base + warm) | 0}, ${(base + warm * 0.72) | 0}, ${(base * 0.82) | 0})`;
      ctx.fillRect(x + 2, y + 2, w, h);

      // Subtle top highlight / bottom shade for relief
      ctx.fillStyle = "rgba(255,255,255,0.13)";
      ctx.fillRect(x + 2, y + 2, w, 2.5);
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      ctx.fillRect(x + 2, y + h - 1, w, 3);

      // Speckle
      for (let s = 0; s < 10; s++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.09})`;
        ctx.fillRect(x + 2 + Math.random() * w, y + 2 + Math.random() * h, 2, 2);
      }
      x += w + 4;
    }
    y += courseH;
    row++;
  }
  return { map: toTexture(c, repeat), bumpMap: bumpFrom(c, repeat) };
}

/** Red/brown stock brick with mortar joints. */
export function brickTexture(repeat: [number, number] = [4, 3]) {
  const { c, ctx } = canvas(512);
  ctx.fillStyle = "#b3a89a";
  ctx.fillRect(0, 0, 512, 512);

  const bw = 62, bh = 26, gap = 4;
  for (let row = 0; row * (bh + gap) < 512; row++) {
    const yy = row * (bh + gap);
    const offset = row % 2 ? -(bw / 2) : 0;
    for (let col = -1; col * (bw + gap) + offset < 512; col++) {
      const xx = col * (bw + gap) + offset;
      const r = 120 + Math.random() * 46;
      ctx.fillStyle = `rgb(${r | 0}, ${(r * 0.52 + 12) | 0}, ${(r * 0.42 + 8) | 0})`;
      ctx.fillRect(xx, yy, bw, bh);
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.fillRect(xx, yy, bw, 2);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(xx, yy + bh - 2, bw, 2);
      for (let s = 0; s < 6; s++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
        ctx.fillRect(xx + Math.random() * bw, yy + Math.random() * bh, 2, 2);
      }
    }
  }
  return { map: toTexture(c, repeat), bumpMap: bumpFrom(c, repeat) };
}

/** Overlapping slate roof tiles. */
export function slateTexture(repeat: [number, number] = [4, 5]) {
  const { c, ctx } = canvas(512);
  ctx.fillStyle = "#39404a";
  ctx.fillRect(0, 0, 512, 512);

  const tw = 56, th = 40;
  for (let row = 0; row * (th * 0.62) < 512 + th; row++) {
    const yy = row * (th * 0.62);
    const offset = row % 2 ? -(tw / 2) : 0;
    for (let col = -1; col * tw + offset < 512; col++) {
      const xx = col * tw + offset;
      const g = 62 + Math.random() * 34;
      ctx.fillStyle = `rgb(${g | 0}, ${(g + 5) | 0}, ${(g + 13) | 0})`;
      // Slightly rounded tile foot
      ctx.beginPath();
      ctx.moveTo(xx + 1, yy);
      ctx.lineTo(xx + tw - 1, yy);
      ctx.lineTo(xx + tw - 1, yy + th - 6);
      ctx.quadraticCurveTo(xx + tw / 2, yy + th + 2, xx + 1, yy + th - 6);
      ctx.closePath();
      ctx.fill();
      // Shadow under the overlapping course
      ctx.fillStyle = "rgba(0,0,0,0.34)";
      ctx.fillRect(xx + 1, yy + th - 5, tw - 2, 4);
    }
  }
  return { map: toTexture(c, repeat), bumpMap: bumpFrom(c, repeat) };
}

/** Lawn / ground. */
export function grassTexture(repeat: [number, number] = [10, 10]) {
  const { c, ctx } = canvas(256);
  ctx.fillStyle = "#6f8451";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5200; i++) {
    const g = 78 + Math.random() * 62;
    ctx.fillStyle = `rgba(${(g * 0.66) | 0}, ${g | 0}, ${(g * 0.48) | 0}, 0.75)`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 3);
  }
  return { map: toTexture(c, repeat), bumpMap: bumpFrom(c, repeat) };
}

/** Paving slabs for the path and doorstep. */
export function pavingTexture(repeat: [number, number] = [3, 3]) {
  const { c, ctx } = canvas(256);
  ctx.fillStyle = "#8e8b85";
  ctx.fillRect(0, 0, 256, 256);
  const s = 64;
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 4; col++) {
      const v = 150 + Math.random() * 30;
      ctx.fillStyle = `rgb(${v | 0}, ${(v - 3) | 0}, ${(v - 9) | 0})`;
      ctx.fillRect(col * s + 2, r * s + 2, s - 4, s - 4);
      for (let k = 0; k < 26; k++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.07})`;
        ctx.fillRect(col * s + 2 + Math.random() * (s - 4), r * s + 2 + Math.random() * (s - 4), 2, 2);
      }
    }
  }
  return { map: toTexture(c, repeat), bumpMap: bumpFrom(c, repeat) };
}
