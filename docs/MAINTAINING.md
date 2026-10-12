# Maintaining the kit

The repository is both a public media package and a small reproducible build project. Its most important invariant is that the high-resolution original never enters the public tree or its Git history.

## Install and validate

```sh
npm ci
npm test
```

The checks verify local links, asset hashes and dimensions, image metadata, the complete portrait format matrix, and the absence of common private-file types and forbidden source-image names. They also verify version consistency, contact-directory links across the README and media guide, the npm publication block, and the absence of health fields in the machine-readable professional profile.

Automated checks reduce accidental leakage; they do not replace review of everything being committed. Always inspect `git diff --cached` and the release archive before publishing.

## Updating the writing

Start by reading the current public version and pulling any owner edits before making changes. Preserve deliberate wording, repository metadata, and the distinction between a personal account and a claim independently supported by another source.

- **Personal history:** Use facts Paul has supplied or confirmed; do not fill gaps in dates, countries, cities, or lengths of stay.
- **Country list:** Keep it non-chronological and preserve the six-month minimum without inventing a more detailed itinerary.
- **Sensitive context:** Keep the personal statement concise and do not add diagnoses or more detailed health material by inference.
- **Project descriptions:** Check current first-party material and preserve the difference between a plan, experiment, released tool, and commercial service.
- **Cross-references:** When one account changes, check the README, biographies, media guide, and relevant project documentation for contradictions.
- **Contact directory:** Mirror the links actually listed in the website's Connect section in `data/profile.json`, the README, and the media guide. Do not infer an email from a public key or private context, or invent a preferred platform.

More words are not automatically more useful. Keep the README a clear entry point, the short biographies genuinely short, and the detailed account in the document intended for it.

## Rebuild public assets

```sh
npx playwright install chromium
npm run build
npm test
npm run pack
```

The public 512 × 512 PNG is the rebuild source. Rebuilding does not require the original, an external account, or an AI service.

If Chromium is already installed in a controlled environment, `PLAYWRIGHT_CHROMIUM_EXECUTABLE` may point to that executable. Otherwise, use the browser installed by Playwright.

## Replace the approved portrait

Only do this after Paul's explicit approval of the exact new image and the intended publication. Keep its original outside the repository and outside any public hosting directory.

```sh
node scripts/build.mjs --portrait /absolute/path/outside-this-repository/approved-image.png
```

The importer refuses a source file inside the repository, rotates it according to orientation if needed, strips metadata, downsamples it to a 512 × 512 square, and generates the public derivatives only from that downsampled source. It does not copy or preserve the original in the kit.

Review the canonical square, circle, and 4:5 crop visually before a release. Do not replace the portrait silently or add alternative pictures "for choice".

## Release checklist

- **Approval:** Reconfirm any changed portrait, sensitive statement, or rights grant before publication.
- **Publication gate:** Publish only explicitly approved personal copy and portraits with confirmed reuse rights. Keep unapproved replacements outside the public repository and its history until they are cleared for release.
- **Facts:** Recheck LinkedIn, the public portfolio, the campaign, and affected project pages. Do not promote launch plans or draft metrics to verified facts.
- **Privacy:** Review all staged paths, metadata, image dimensions, archives, and commits. Never commit credentials, private communications, internal documents, or the original attachment.
- **Version:** Keep `package.json`, `data/profile.json`, the lockfile, and `CHANGELOG.md` in sync. Rebuild the artwork labels; the README's release badge reads the latest GitHub release.
- **Assets:** Run `npm run build`, `npm test`, and `npm run pack`. The graphics build checks card overflow, footer clearance, and portrait sizing; still inspect the artwork at its intended display size.
- **Package:** Inspect the ZIP listing; it must contain public files only. Publish the ZIP and its SHA-256 checksum together.
- **Website:** Keep the desktop menu, mobile drawer, and Connect entry pointed at the approved short link, `https://paulf.xyz/media`. The Connect label is `Mediakit`; the navigation can retain its existing visual treatment.
- **Owner metadata:** Preserve Paul's manual edits to the repository title, About description, homepage, and topics unless he requests a change. If About includes a kit version, synchronise that version with the release while retaining the rest of his wording.
- **Publication:** Push the approved release, check CI, and verify the public image and document links.

## Scope of the license

Original JavaScript in `scripts/` and the workflow in `.github/workflows/` are MIT-licensed. The assets and biographical copy remain under the root `LICENSE`, even though software generated some of their formats.

The project is not published to npm. `private: true` is intentional; `npm run pack` creates a media ZIP, not an npm package release.

## Public entry points

The shareable address is [paulf.xyz/media](https://paulf.xyz/media), with [paulfleury.com/pr](https://paulfleury.com/pr), [paulfleury.com/media](https://paulfleury.com/media), and [paulfleury.com/mediakit](https://paulfleury.com/mediakit) as additional entry points. Their destination is the public repository, not a particular release ZIP.

Treat redirect configuration and social-preview metadata as separate things to verify. A link can work in a browser while a preview crawler behaves differently, so check the redirect chain and the destination's title, description, and image after changing an entry point.

Keep hosting credentials, server configuration backups, and internal deployment notes outside this public repository. A reader should be able to rebuild the approved media assets without access to any of those materials.
