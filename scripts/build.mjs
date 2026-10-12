// SPDX-License-Identifier: MIT
// Media assets read or produced by this script are NOT MIT-licensed.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import sharp from "sharp";
import { renderGraphics } from "./render-graphics.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(await fs.readFile(path.join(root, "package.json")));
const portraitDir = path.join(root, "assets/portrait");
const brandDir = path.join(root, "assets/brand");
const canonical = path.join(portraitDir, "paul-fleury-square-512.png");
const args = process.argv.slice(2);

for (const dir of [portraitDir, brandDir, path.join(root, "assets/graphics")]) {
  await fs.mkdir(dir, { recursive: true });
}
if (args.length) {
  assert.equal(args[0], "--portrait", "Only --portrait is supported.");
  assert.equal(args.length, 2, "Provide exactly one external portrait path.");
  const source = await fs.realpath(args[1]);
  const realRoot = await fs.realpath(root);
  assert(!source.startsWith(`${realRoot}${path.sep}`), "Original must be outside the repository.");
  const metadata = await sharp(source).metadata();
  assert(metadata.width >= 512 && metadata.height >= 512, "Never upscale a smaller portrait.");
  // Sharp strips EXIF, XMP, IPTC and profiles unless explicitly retained.
  await sharp(source).rotate().resize(512, 512, { fit: "cover", position: "centre" })
    .toColourspace("srgb").png({ compressionLevel: 9 }).toFile(canonical);
  console.log("Imported only the downsampled 512px public portrait.");
}
assert(await fs.stat(canonical).catch(() => false), "Missing public portrait. Import an approved external image first.");
const base = await fs.readFile(canonical);
const baseMeta = await sharp(base).metadata();
assert.equal(baseMeta.width, 512);
assert.equal(baseMeta.height, 512);

async function exportFormats(image, stem, formats = ["png", "jpg", "webp"]) {
  for (const ext of formats) {
    const target = path.join(portraitDir, `${stem}.${ext}`);
    let output = image.clone();
    if (ext === "png") output = output.png({ compressionLevel: 9 });
    if (ext === "jpg") output = output.jpeg({ quality: 84, mozjpeg: true });
    if (ext === "webp") output = output.webp({ quality: 82, alphaQuality: 100 });
    await output.toFile(target);
  }
}
for (const size of [128, 256, 512]) {
  await exportFormats(sharp(base).resize(size, size), `paul-fleury-square-${size}`);
}
for (const size of [256, 512]) {
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`);
  await exportFormats(
    sharp(base).resize(size, size).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]),
    `paul-fleury-circle-${size}`, ["png", "webp"]
  );
}
await exportFormats(sharp(base).resize(400, 500, { fit: "cover", position: "centre" }), "paul-fleury-editorial-400x500");

const pf = '<path d="M26 93V35h23c14 0 22 8 22 21S63 77 49 77H38v16H26zm12-28h11c7 0 10-3 10-9s-3-9-10-9H38v18zM79 35h31v12H91v14h17v12H91v20H79V35z"/>';
for (const [name, background, foreground] of [
  ["dark", "#141414", "#f5f2ec"],
  ["light", "#f5f2ec", "#141414"],
  ["black", null, "#141414"],
  ["white", null, "#ffffff"],
]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-labelledby="title"><title id="title">PF media-kit mark</title>${background ? `<rect width="128" height="128" rx="20" fill="${background}"/>` : ""}<g fill="${foreground}" transform="translate(-4 0)">${pf}</g></svg>\n`;
  await fs.writeFile(path.join(brandDir, `mediakit-mark-${name}.svg`), svg);
}
const darkSvg = await fs.readFile(path.join(brandDir, "mediakit-mark-dark.svg"));
const iconBuffers = [];
for (const size of [16, 32, 64, 128, 256]) {
  const png = await sharp(darkSvg).resize(size, size).png().toBuffer();
  await fs.writeFile(path.join(brandDir, `mediakit-icon-${size}.png`), png);
  iconBuffers.push({ size, png });
}
// Standard ICO container with PNG-compressed frames, including a 256px frame.
const header = Buffer.alloc(6 + iconBuffers.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(iconBuffers.length, 4);
let offset = header.length;
iconBuffers.forEach(({ size, png }, index) => {
  const entry = 6 + index * 16;
  header[entry] = size === 256 ? 0 : size;
  header[entry + 1] = size === 256 ? 0 : size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
await fs.writeFile(path.join(brandDir, "favicon.ico"), Buffer.concat([header, ...iconBuffers.map(i => i.png)]));

await renderGraphics(root);

const files = [];
for (const group of ["portrait", "brand", "graphics"]) {
  const entries = (await fs.readdir(path.join(root, "assets", group))).sort();
  for (const name of entries) {
    const relative = `assets/${group}/${name}`;
    const buffer = await fs.readFile(path.join(root, relative));
    const ext = path.extname(name).slice(1);
    const meta = ext === "ico" ? { width: 256, height: 256 } : await sharp(buffer).metadata();
    files.push({
      path: relative,
      category: group,
      format: ext === "jpg" ? "jpeg" : ext,
      width: meta.width,
      height: meta.height,
      bytes: buffer.length,
      sha256: createHash("sha256").update(buffer).digest("hex"),
      license: "Paul Fleury Media Permission 1.0",
      ...(group === "portrait" ? { approvedImage: "portrait-01", maximumDimension: 512 } : {}),
    });
  }
}
await fs.writeFile(path.join(root, "assets/manifest.json"), JSON.stringify({
  schemaVersion: "1.0",
  kitVersion: pkg.version,
  publicationStatus: pkg.mediakitStatus,
  sourceImageCount: 1,
  maximumPortraitDimension: 512,
  files,
}, null, 2) + "\n");
console.log(`Built ${files.length} public assets. The original was not copied into the repository.`);
