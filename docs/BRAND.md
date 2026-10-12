# Marks and graphics

The visual package is intentionally restrained: monochrome portraiture, high-contrast type, quiet technical labels, and a small warm accent. The PF media-kit mark identifies this package; it does not replace the identities of Openline or any other project.

## Downloadable graphics

| Asset | Dimensions | Formats |
|---|---|---|
| README header | 1600 × 600 | [PNG](../assets/graphics/paul-fleury-mediakit-header.png) · [WebP](../assets/graphics/paul-fleury-mediakit-header.webp) |
| Project map | 1600 × 1120 | [PNG](../assets/graphics/paul-fleury-project-map.png) · [WebP](../assets/graphics/paul-fleury-project-map.webp) |
| Social / editorial card | 1200 × 630 | [PNG](../assets/graphics/paul-fleury-social-card.png) · [WebP](../assets/graphics/paul-fleury-social-card.webp) |

The large dimensions of a layout do not mean a high-resolution portrait is included. Graphics use the same approved 512-pixel-or-smaller source, placed at or below its native size.

## Mark and icon files

- **Dark tile:** [SVG](../assets/brand/mediakit-mark-dark.svg), suitable for a light page or a standalone identity tile.
- **Light tile:** [SVG](../assets/brand/mediakit-mark-light.svg), suitable for a dark page.
- **Transparent black mark:** [SVG](../assets/brand/mediakit-mark-black.svg).
- **Transparent white mark:** [SVG](../assets/brand/mediakit-mark-white.svg).
- **Raster icons:** [32 px](../assets/brand/mediakit-icon-32.png), [64 px](../assets/brand/mediakit-icon-64.png), [128 px](../assets/brand/mediakit-icon-128.png), and [256 px](../assets/brand/mediakit-icon-256.png).
- **Application-style favicon:** [ICO](../assets/brand/favicon.ico).

## Reuse

Keep sufficient clear space around the mark, preserve its proportions, and use the supplied light or dark version rather than recolouring it. Do not imply that the mark certifies, endorses, or sponsors a third-party service.

For a graphic, credit `Paul Fleury / mediakit` and link to the kit where practical. All marks and graphics are covered by the [limited media permission](../LICENSE), not by the MIT license for the build scripts.

## Build notes

The graphics are rendered deterministically from HTML/CSS in the build tooling, using Manrope and IBM Plex Mono from development dependencies. No new face or AI-generated scene is produced by the build.

Run `npm run build` to regenerate them. The [manifest](../assets/manifest.json) records actual dimensions, file sizes, and hashes for the exported files.
