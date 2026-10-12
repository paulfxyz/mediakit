// SPDX-License-Identifier: MIT
// The code is MIT; the personal copy, marks and exported artwork are not.
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

export async function renderGraphics(root) {
  const read = (p) => fs.readFile(path.join(root, p));
  const pkg = JSON.parse(await read("package.json"));
  const mono = (await read("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2")).toString("base64");
  const regular = (await read("node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2")).toString("base64");
  const bold = (await read("node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff2")).toString("base64");
  const portrait = (await read("assets/portrait/paul-fleury-square-512.jpg")).toString("base64");
  const brandMark = (await read("assets/brand/mediakit-mark-white.svg")).toString("base64");
  const face = `<img class="face" src="data:image/jpeg;base64,${portrait}" alt="Approved portrait of Paul Fleury">`;
  const mark = `<img class="mark" src="data:image/svg+xml;base64,${brandMark}" alt="PF">`;
  const common = `
    @font-face{font-family:Manrope;src:url(data:font/woff2;base64,${regular});font-weight:400}
    @font-face{font-family:Manrope;src:url(data:font/woff2;base64,${bold});font-weight:700}
    @font-face{font-family:IBM;src:url(data:font/woff2;base64,${mono});font-weight:400}
    *{box-sizing:border-box}html,body{margin:0;padding:0}
    body{font-family:Manrope,sans-serif}h1,h2,h3,p{margin:0}
    .canvas{overflow:hidden;position:relative}
    .mono{font-family:IBM,monospace;font-size:16px;letter-spacing:1.3px;text-transform:uppercase}
    .rule{height:1px;background:#494744}
    .mark{width:48px;height:48px}
    .small{font-family:IBM,monospace;font-size:15px}
    .accent{color:#e6764e}
    .face{display:block;object-fit:cover}
  `;
  const layouts = [
    {
      name: "paul-fleury-mediakit-header", width: 1600, height: 600,
      css: `
        .canvas{background:#151515;color:#f5f2ec;padding:42px 58px}
        .top,.bottom{display:flex;align-items:center;justify-content:space-between}
        .brand{display:flex;gap:18px;align-items:center}
        .tag{color:#bdb8af}
        .middle{display:grid;grid-template-columns:1fr 336px;gap:90px;align-items:center;margin-top:38px}
        h1{font-size:100px;line-height:1.02;letter-spacing:-6px;font-weight:700}
        .intro{font-size:30px;line-height:1.45;letter-spacing:-.6px;margin-top:27px;color:#d5d0c8;max-width:890px}
        .photo{position:relative;width:306px;height:306px;padding:10px;border:1px solid #676058;transform:rotate(3deg)}
        .face{width:284px;height:284px}
        .photo-label{position:absolute;bottom:-15px;left:25px;background:#e6764e;color:#151515;padding:9px 14px;font:13px IBM;letter-spacing:1px;transform:rotate(-3deg)}
        .bottom{position:absolute;bottom:36px;left:58px;right:58px;padding-top:22px;border-top:1px solid #494744;color:#bdb8af}
      `,
      body: `
        <div class="top"><div class="brand">${mark}<span class="mono">mediakit / official reference</span></div><span class="mono tag">v${pkg.version} · Lisbon, Portugal</span></div>
        <div class="middle"><div><h1>Paul Fleury.</h1><p class="intro">Internet entrepreneur.<br>Building things. Keeping some things private.</p></div><div class="photo">${face}<span class="photo-label">ONE APPROVED PORTRAIT</span></div></div>
        <div class="bottom small"><span>Portraits / biographies / projects / permissions</span><span>paulfleury.com <span class="accent">↗</span></span></div>
      `,
    },
    {
      name: "paul-fleury-project-map", width: 1600, height: 1120,
      css: `
        .canvas{background:#f3f0e9;color:#191919;padding:52px 58px}
        .top{display:flex;justify-content:space-between;align-items:center;color:#736e65}
        h1{font-size:62px;line-height:1.07;letter-spacing:-3px;margin-top:17px}
        .sub{font-size:24px;color:#666157;margin-top:14px}
        .lead-grid{display:grid;grid-template-columns:1fr 1fr;gap:25px;margin-top:37px}
        .lead{padding:29px 32px;background:#171717;color:#f3f0e9;height:173px}
        .lead.secondary{background:#e8e2d7;color:#191919}
        .lead .mono{font-size:14px;color:#bcb5aa}
        .lead.secondary .mono{color:#6c6559}
        .lead h2{font-size:35px;font-weight:700;letter-spacing:-1px;margin-top:16px}
        .lead p{font-size:19px;margin-top:7px;color:#c6c0b7}
        .lead.secondary p{color:#676052}
        .services{display:flex;align-items:center;gap:31px;padding:28px 0 30px;border-bottom:1px solid #c8c1b5}
        .services .mono{font-size:14px;color:#736e65;width:253px}
        .services span:not(.mono){font-size:23px;font-weight:700}
        .services i{font-style:normal;font-size:20px;color:#70685c}
        .tools-header{display:flex;justify-content:space-between;align-items:center;margin-top:30px;margin-bottom:22px}
        .tools-header h2{font-size:27px;font-weight:700;letter-spacing:-.7px}
        .tools-header .mono{font-size:13px;color:#736e65}
        .tools{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .tool{border:1px solid #c8c1b5;background:#faf8f2;padding:23px 22px;height:155px;position:relative}
        .tool h3{font-size:27px;font-weight:700;letter-spacing:-.8px;margin-bottom:12px}
        .tool p{font-size:17px;line-height:1.45;color:#6e675c}
        .tool .id{position:absolute;right:16px;top:14px;font:13px IBM;color:#70685c}
        .bottom{position:absolute;bottom:42px;left:58px;right:58px;display:flex;justify-content:space-between;color:#736e65;font-size:13px}
        .dot{width:8px;height:8px;background:#ce633f;display:inline-block;margin-right:9px}
      `,
      body: `
        <div class="top mono"><span>Paul Fleury / selected work</span><span>Reference map · October 2026</span></div>
        <h1>Different kinds of work.<br>A common instinct to build.</h1>
        <p class="sub">A company, a public-good direction, and room for useful experiments.</p>
        <div class="lead-grid"><div class="lead"><div class="mono">Main business</div><h2>Openline</h2><p>eSIM connectivity.</p></div><div class="lead secondary"><div class="mono">Public-good initiative</div><h2>Enki</h2><p>Decentralised, local-first AI.</p></div></div>
        <div class="services"><span class="mono">Services &amp; advisory</span><span>Megastack</span><i>/</i><span>Calliope Agency</span><i>/</i><span>Asymptote Ventures</span></div>
        <div class="tools-header"><h2>Independent software</h2><span class="mono"><span class="dot"></span>Seven Weekathon projects + infrastructure</span></div>
        <div class="tools">
          <div class="tool"><span class="id">01</span><h3>Junk</h3><p>A thought, captured.<br>A floating scratchpad.</p></div>
          <div class="tool"><span class="id">02</span><h3>ASE</h3><p>Uptime, DNS &amp; SSL.<br>Keep an eye on it.</p></div>
          <div class="tool"><span class="id">03</span><h3>Mang</h3><p>Plain language.<br>Terminal commands.</p></div>
          <div class="tool"><span class="id">04</span><h3>Hollr</h3><p>Encrypted messages.<br>A shareable handle.</p></div>
          <div class="tool"><span class="id">05</span><h3>Clippy</h3><p>AI-assisted<br>contract analysis.</p></div>
          <div class="tool"><span class="id">06</span><h3>Mercury</h3><p>Research &amp; debate.<br>More than one model.</p></div>
          <div class="tool"><span class="id">07</span><h3>Cup of News</h3><p>An AI-assisted<br>news digest.</p></div>
          <div class="tool"><span class="id">08</span><h3>xnftables</h3><p>Explicit access.<br>Deny by default.</p></div>
        </div>
        <div class="bottom small"><span>Curated portfolio, not a live availability or release-status feed.</span><span>Details + primary references: docs/PROJECTS.md</span></div>
      `,
    },
    {
      name: "paul-fleury-social-card", width: 1200, height: 630,
      css: `
        .canvas{background:#151515;color:#f5f2ec;padding:41px 48px}
        .top{display:flex;align-items:center;gap:15px}.top .mono{color:#c6c0b7}
        .main{display:grid;grid-template-columns:1fr 280px;gap:37px;align-items:center;margin-top:44px}
        h1{font-size:82px;line-height:1.05;letter-spacing:-4px;font-weight:700}
        .intro{margin-top:20px;font-size:26px;line-height:1.4;color:#c6c0b7}
        .face{width:280px;height:280px;border-radius:50%;border:1px solid #6a6258}
        .label{display:inline-block;border:1px solid #625b51;margin-top:28px;padding:9px 12px;font:13px IBM;color:#d2cbc0}
        .bottom{position:absolute;bottom:38px;left:48px;right:48px;border-top:1px solid #494744;padding-top:22px;display:flex;justify-content:space-between;color:#bcb5aa;font-size:14px}
      `,
      body: `
        <div class="top">${mark}<span class="mono">Official media kit</span></div>
        <div class="main"><div><h1>Paul Fleury.</h1><p class="intro">Internet entrepreneur.<br>Building from Lisbon.</p><span class="label">PORTRAIT · BIOGRAPHIES · PROJECTS</span></div>${face}</div>
        <div class="bottom small"><span>github.com/paulfxyz/mediakit</span><span>paulfleury.com <span class="accent">↗</span></span></div>
      `,
    },
  ];
  const options = { headless: true, channel: "chromium" };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) {
    options.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
    delete options.channel;
  }
  const browser = await chromium.launch(options);
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    for (const art of layouts) {
      await page.setViewportSize({ width: art.width, height: art.height });
      await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${common}${art.css}.canvas{width:${art.width}px;height:${art.height}px}</style></head><body><div class="canvas">${art.body}</div></body></html>`);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("img").evaluateAll(images => Promise.all(images.map(img => img.decode())));
      const canvas = page.locator(".canvas");
      const png = await canvas.screenshot({ type: "png" });
      await fs.writeFile(path.join(root, `assets/graphics/${art.name}.png`), png);
      await sharp(png).webp({ quality: 88 }).toFile(path.join(root, `assets/graphics/${art.name}.webp`));
      console.log(`Rendered ${art.name}: ${art.width}x${art.height}`);
    }
  } finally {
    await browser.close();
  }
}
