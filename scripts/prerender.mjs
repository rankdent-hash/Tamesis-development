// Runs after `vite build` and `vite build --ssr`. Writes the home page's
// first screen (header, hero, call-to-actions, mobile call bar) into
// dist/index.html as real HTML, so phones paint it before any JavaScript
// arrives. Other routes are served the untouched template (dist/spa.html)
// via the rewrite in vercel.json, so they never flash home-page content.
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const template = await readFile(path.join(dist, "index.html"), "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error("prerender: #root placeholder not found in dist/index.html");

await writeFile(path.join(dist, "spa.html"), template);

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const html = render("/");
if (!html || html.length < 500) throw new Error("prerender: home page rendered suspiciously little HTML");

// Inline the stylesheet: it is the only render-blocking request, and on a
// phone it otherwise queues behind the JavaScript. With it inline, the hero
// paints as soon as the HTML arrives. (Other routes keep the cached file.)
const cssLink = template.match(/<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/);
if (!cssLink) throw new Error("prerender: main stylesheet link not found");
const css = await readFile(path.join(dist, cssLink[1]), "utf8");
if (/url\((?!["']?(data:|https?:|#))/.test(css)) throw new Error("prerender: CSS has relative url()s; inlining would break them");

const page = template
  .replace(cssLink[0], () => `<style>${css}</style>`)
  .replace(marker, () => `<div id="root">${html}</div>`);
await writeFile(path.join(dist, "index.html"), page);
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: home page HTML ${(html.length / 1024).toFixed(1)} KB written to dist/index.html`);
