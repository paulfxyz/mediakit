# Maintaining the kit

The repository is both a public media package and a small reproducible build project. Its most important invariant is that the high-resolution original never enters the public tree or its Git history.

## Install and validate

```sh
npm ci
npm test
```

The checks verify local links, asset hashes and dimensions, image metadata, the complete portrait format matrix, and the absence of common private-file types and forbidden source-image names. They also verify that the package stays private and the machine-readable professional profile has no health fields.

Automated checks reduce accidental leakage; they do not replace review of everything being committed. Always inspect `git diff --cached` and the release archive before publishing.

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
- **Version:** Update `package.json`, the README release label, the artwork's release label, and `CHANGELOG.md` together; refresh the lockfile.
- **Assets:** Run `npm run build`, `npm test`, and `npm run pack`.
- **Package:** Inspect the ZIP listing; it must contain public files only. Publish the ZIP and its SHA-256 checksum together.
- **Website:** Keep the main site's media-kit link pointed at the canonical repository.
- **Publication:** Push the approved release, check CI, and verify the public image and document links.

## Scope of the license

Original JavaScript in `scripts/` and the workflow in `.github/workflows/` are MIT-licensed. The assets and biographical copy remain under the root `LICENSE`, even though software generated some of their formats.

The project is not published to npm. `private: true` is intentional; `npm run pack` creates a media ZIP, not an npm package release.
