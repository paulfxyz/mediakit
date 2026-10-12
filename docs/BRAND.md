# Marks and graphics

The visual package is intentionally restrained: monochrome portraiture, high-contrast type, quiet technical labels, and a small warm accent. The PF media-kit mark identifies this package; it does not replace the identities of Openline or any other project.

## The visual idea

The kit is presented like a small, maintained technical project because it is meant to be easy to navigate, reuse correctly, and keep current. Version labels, file formats, and a manifest make it practical for both editors and maintainers.

The portrait is the human anchor, while the typography and marks provide structure around it. The treatment is deliberately modest rather than cinematic, promotional, or dependent on a collection of personal photographs.

## Downloadable graphics

| Asset | Dimensions | Formats |
|---|---|---|
| README header | 1600 × 600 | [PNG](../assets/graphics/paul-fleury-mediakit-header.png) · [WebP](../assets/graphics/paul-fleury-mediakit-header.webp) |
| Project map | 1600 × 1120 | [PNG](../assets/graphics/paul-fleury-project-map.png) · [WebP](../assets/graphics/paul-fleury-project-map.webp) |
| Social / editorial card | 1200 × 630 | [PNG](../assets/graphics/paul-fleury-social-card.png) · [WebP](../assets/graphics/paul-fleury-social-card.webp) |

The large dimensions of a layout do not mean a high-resolution portrait is included. Graphics use the same approved 512-pixel-or-smaller source, placed at or below its native size.

## Choosing a graphic

- **README header:** Use it for a broad introduction to the kit, where its wide format has enough room to remain legible.
- **Project map:** Use it when the distinction between the main business, advisory work, public-good work, and independent software is relevant.
- **Social card:** Use it for a compact link preview or editorial introduction; avoid placing additional text over the portrait or the existing title.

The project map is a reference illustration, not a live dashboard. Check the linked documentation before describing a project as available, launched, funded, or complete.

## Mark and icon files

- **Dark tile:** [SVG](../assets/brand/mediakit-mark-dark.svg), suitable for a light page or a standalone identity tile.
- **Light tile:** [SVG](../assets/brand/mediakit-mark-light.svg), suitable for a dark page.
- **Transparent black mark:** [SVG](../assets/brand/mediakit-mark-black.svg), for a light background.
- **Transparent white mark:** [SVG](../assets/brand/mediakit-mark-white.svg), for a dark background.
- **Raster icons:** [16 px](../assets/brand/mediakit-icon-16.png), [32 px](../assets/brand/mediakit-icon-32.png), [64 px](../assets/brand/mediakit-icon-64.png), [128 px](../assets/brand/mediakit-icon-128.png), and [256 px](../assets/brand/mediakit-icon-256.png).
- **Application-style favicon:** [ICO](../assets/brand/favicon.ico), containing all five icon sizes.

## Reuse

Keep sufficient clear space around the mark, preserve its proportions, and use the supplied light or dark version rather than recolouring it. Do not imply that the mark certifies, endorses, or sponsors a third-party service.

For a graphic, credit `Paul Fleury / mediakit` and link to the kit where practical. All marks and graphics are covered by the [limited media permission](../LICENSE), not by the MIT license for the build scripts.

## Voice and naming

Use `Media Kit` in the repository and release title, `media kit` in ordinary prose, and `Mediakit` for the website's Connect label. The repository slug, short link, and prescribed graphic credit retain `mediakit`; use the exact credit in [LICENSE](../LICENSE).

Use Paul Fleury's name plainly, and describe the relevant work rather than turning the entire portfolio into a job title. “Internet entrepreneur”, “founder”, “product builder”, and “consultant” are more useful starting points than unsupported superlatives.

The life story can be warm and personal without becoming a sequence of lifestyle claims. Keep the international background in its stated form, avoid national stereotypes, and do not use the personal statement as a branding slogan.

## Layout and accessibility

- **Contrast:** Choose the light or dark mark for the background instead of adding effects to make an unsuitable version visible.
- **Proportions:** Reduce a complete graphic proportionally; do not enlarge its portrait, stretch the face, crop away the context, or use it as an oversized background texture.
- **Text size:** If a layout becomes too small to read, use the portrait and ordinary live text instead of shrinking a detailed graphic further.
- **Descriptions:** Use factual alt text, such as “Approved black-and-white portrait of Paul Fleury”. Do not add inferred emotions, conditions, credentials, or locations.
- **Project identities:** Do not recolour a company mark to make it look like part of this kit, or imply that the PF mark endorses another service.

## Build notes

The graphics are rendered deterministically from HTML/CSS in the build tooling, using Manrope and IBM Plex Mono from development dependencies. No new face or AI-generated scene is produced by the build.

Run `npm run build` to regenerate them. The [manifest](../assets/manifest.json) records actual dimensions, file sizes, and hashes for the exported files.
