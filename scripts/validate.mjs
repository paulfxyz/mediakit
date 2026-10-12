// SPDX-License-Identifier: MIT
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (name) => fs.readFile(path.join(root, name), "utf8");
const pkg = JSON.parse(await read("package.json"));
const lock = JSON.parse(await read("package-lock.json"));
const manifest = JSON.parse(await read("assets/manifest.json"));
const profile = JSON.parse(await read("data/profile.json"));
assert.equal(pkg.private, true, "Do not publish a personal media kit to npm.");
assert.equal(pkg.license, "SEE LICENSE IN LICENSE");
assert.equal(lock.version, pkg.version, "Lockfile version differs.");
assert.equal(lock.packages[""].version, pkg.version, "Root lockfile package version differs.");
assert.equal(manifest.kitVersion, pkg.version);
assert.equal(profile.kitVersion, pkg.version);
assert.equal(pkg.mediakitStatus, "public");
assert.equal(manifest.publicationStatus, pkg.mediakitStatus);
assert.equal(profile.publicationStatus, pkg.mediakitStatus);
assert.equal(profile.portrait.reuseRights, "owner-confirmed");
assert((await read("LICENSE")).startsWith("Paul Fleury Media Permission 1.0"), "The media permission must be explicit.");
assert.equal(manifest.sourceImageCount, 1);
assert.equal(manifest.maximumPortraitDimension, 512);
assert(!/agoraphobi|claustrophobi|medical|diagnos|health/i.test(JSON.stringify(profile)), "Do not put health fields in the professional data.");
assert.equal(profile.contact.url, `${profile.links.website}/#connect`);
assert(profile.contact.channels.length > 0, "The official contact directory must not be empty.");
const channelUrls = profile.contact.channels.map(channel => channel.url);
assert.equal(new Set(channelUrls).size, channelUrls.length, "Duplicate contact route.");
for (const channel of profile.contact.channels) {
  assert.equal(new URL(channel.url).protocol, "https:", "Contact routes must use HTTPS.");
  for (const doc of ["README.md", "docs/MEDIA-GUIDE.md"])
    assert((await read(doc)).includes(`(${channel.url})`), `${doc} omits ${channel.name}.`);
}
assert((await read(".github/ISSUE_TEMPLATE/config.yml")).includes(profile.contact.url), "Issue form contact directory differs.");

const expectedPortraits = [];
for (const size of [128, 256, 512]) for (const ext of ["png", "jpg", "webp"])
  expectedPortraits.push(`paul-fleury-square-${size}.${ext}`);
for (const size of [256, 512]) for (const ext of ["png", "webp"])
  expectedPortraits.push(`paul-fleury-circle-${size}.${ext}`);
for (const ext of ["png", "jpg", "webp"])
  expectedPortraits.push(`paul-fleury-editorial-400x500.${ext}`);
assert.deepEqual((await fs.readdir(path.join(root, "assets/portrait"))).sort(), expectedPortraits.sort(), "Unexpected portrait or missing export.");

const listed = new Set();
let totalBytes = 0;
for (const asset of manifest.files) {
  assert(!listed.has(asset.path), `Duplicate asset ${asset.path}`);
  assert(/^assets\/(portrait|brand|graphics)\/[^/]+$/.test(asset.path), "Unsafe asset path.");
  listed.add(asset.path);
  const data = await fs.readFile(path.join(root, asset.path));
  assert.equal(asset.bytes, data.length, asset.path);
  assert.equal(asset.sha256, createHash("sha256").update(data).digest("hex"), `${asset.path} hash differs.`);
  totalBytes += data.length;
  if (asset.format === "ico") {
    assert.equal(data.readUInt16LE(2), 1);
    assert.equal(data.readUInt16LE(4), 5);
    for (let index = 0; index < 5; index++) {
      const entry = 6 + index * 16;
      const size = data[entry] || 256;
      const length = data.readUInt32LE(entry + 8);
      const offset = data.readUInt32LE(entry + 12);
      assert.equal(size, [16, 32, 64, 128, 256][index]);
      const png = await fs.readFile(path.join(root, `assets/brand/mediakit-icon-${size}.png`));
      assert(data.subarray(offset, offset + length).equals(png), "ICO frame differs from its approved icon.");
    }
    continue;
  }
  const meta = await sharp(data).metadata();
  assert.equal(meta.width, asset.width, asset.path);
  assert.equal(meta.height, asset.height, asset.path);
  assert(!meta.exif && !meta.xmp && !meta.iptc && !meta.icc, `Embedded metadata: ${asset.path}`);
  if (asset.category === "portrait") {
    assert(Math.max(meta.width, meta.height) <= 512, `Oversized portrait: ${asset.path}`);
    assert.equal(asset.approvedImage, "portrait-01");
    if (asset.path.includes("-circle-")) {
      assert(meta.hasAlpha, `Missing circle transparency: ${asset.path}`);
      const { data: pixels, info } = await sharp(data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(pixels[info.channels - 1], 0, "Circle corner must be transparent.");
    }
  }
  if (asset.format === "svg") {
    assert(!/<script|<foreignObject|<image|data:image|https?:\/\//i.test(data.toString().replace("http://www.w3.org/2000/svg", "")), "Unexpected active or embedded SVG content.");
  }
}
for (const group of ["portrait", "brand", "graphics"]) {
  for (const filename of await fs.readdir(path.join(root, "assets", group))) {
    assert(listed.has(`assets/${group}/${filename}`), `Unmanifested asset: ${filename}`);
  }
}
assert.equal(listed.size, 32, "Expected 16 portraits, 10 brand assets, and 6 graphics.");

async function walk(folder) {
  const files = [];
  for (const ent of await fs.readdir(folder, { withFileTypes: true })) {
    if (["node_modules", ".git", "dist"].includes(ent.name)) continue;
    const name = path.join(folder, ent.name);
    assert(!ent.isSymbolicLink(), `Do not package symlinks: ${name}`);
    if (ent.isDirectory()) files.push(...await walk(name));
    else files.push(name);
  }
  return files;
}
let links = 0;
const files = await walk(root);
for (const file of files) {
  const rel = path.relative(root, file);
  assert(!/(^|\/)(private|originals|\.env)(\/|$|\.)|(?:\.pem|\.key|\.p12|\.pfx)$/i.test(rel), `Private file in public tree: ${rel}`);
  if (/\.(?:png|jpe?g|webp|ico|svg|avif|gif|heic|tiff?|mp4|mov|webm)$/i.test(rel))
    assert(listed.has(rel), `Media file outside the approved manifest: ${rel}`);
  if (!/\.(md|mjs|json|yml|txt)$/.test(file) && path.basename(file) !== "LICENSE") continue;
  const text = await fs.readFile(file, "utf8");
  assert(!/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|github_pat_[A-Za-z0-9_]{30,}|ghp_[A-Za-z0-9]{30,}|sk-or-v1-[a-f0-9]{32,}/.test(text), `Potential secret: ${rel}`);
  assert(!/\/(?:home|Users|tmp|private)\/|[A-Za-z]:\\Users\\|\/\.[\w.-]+\/(?:attachments|credentials|sessions)\/|[a-z][a-z0-9-]*-cred[:]/i.test(text), `Private workspace reference: ${rel}`);
  if (!file.endsWith(".md")) continue;
  const localLinks = [
    ...[...text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(m => m[1]),
    ...[...text.matchAll(/(?:src|href|srcset)="([^"]+)"/g)].map(m => m[1]),
  ];
  for (const link of localLinks) {
    if (/^[a-z]+:|^#|^\//i.test(link)) continue;
    const clean = decodeURIComponent(link.split("#")[0]);
    const target = path.resolve(path.dirname(file), clean);
    assert(target.startsWith(root), `Local link escaped repository: ${link}`);
    assert(await fs.stat(target).catch(() => false), `Broken local link in ${rel}: ${link}`);
    links++;
  }
}
assert((await read("LICENSE")).includes("GitHub"));
assert((await read("LICENSE")).includes("Criticism is permitted"));
console.log(`PASS: ${listed.size} assets; ${expectedPortraits.length} portrait exports; ${links} local links; ${(totalBytes / 1024).toFixed(0)} KiB of public assets.`);
console.log("PASS: portrait dimensions, transparency, metadata, hashes, license boundaries, package privacy, and private-file scan.");
