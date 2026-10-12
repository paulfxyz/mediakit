// SPDX-License-Identifier: MIT
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../", import.meta.url));
execFileSync(process.execPath, [path.join(root, "scripts/validate.mjs")], { stdio: "inherit" });
const pkg = JSON.parse(await fs.readFile(path.join(root, "package.json")));
const dist = path.join(root, "dist");
await fs.mkdir(dist, { recursive: true });
const name = `paul-fleury-mediakit-v${pkg.version}`;
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "mediakit-release-"));
const folder = path.join(temp, name);
await fs.mkdir(folder);
const allowed = [
  "README.md", "LICENSE", "LICENSES", "CHANGELOG.md", "CONTRIBUTING.md",
  "docs", "assets", "data", "scripts", ".github", ".gitignore", ".gitattributes",
  "package.json", "package-lock.json",
];
try {
  for (const item of allowed) {
    await fs.cp(path.join(root, item), path.join(folder, item), { recursive: true });
  }
  const archive = path.join(dist, `${name}.zip`);
  await fs.rm(archive, { force: true });
  execFileSync("zip", ["-q", "-r", "-X", archive, name], { cwd: temp });
  const sha = createHash("sha256").update(await fs.readFile(archive)).digest("hex");
  await fs.writeFile(path.join(dist, `${name}.sha256`), `${sha}  ${name}.zip\n`);
  console.log(`Created ${path.basename(archive)} and SHA-256 checksum.`);
} finally {
  await fs.rm(temp, { recursive: true, force: true });
}
