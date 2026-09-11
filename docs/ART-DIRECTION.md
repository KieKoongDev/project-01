# Launch card art contract

Preserve the original visual direction: stylized flat papercraft, parchment-texture board, minimalist elemental silhouettes, clean pastel category borders, tactile layered paper edges and subtle slot depth. Cards stay front-facing and readable in portrait mobile layouts. Avoid photorealism, glossy 3D, busy backgrounds, baked-in text, and inconsistent camera angles.

## Word-first concept testing

Name, properties, era, VP and invention status are UI fields, not pixels embedded in an image. The v0.2 prototype starts in word mode. Art can be turned on without affecting recipe behavior or scoring. Validate whether players understand new possibilities before commissioning the launch set.

## 1,000+ item scale

- Every definition has a stable `id` and `artKey`. A single shared frame handles era/category/locked/discovered state.
- `art-manifest.json` maps keys to versioned local URLs, alt text, and optional future metadata. An empty manifest is supported.
- A derived invention reuses its root artwork and rendered property labels. Do not generate a separate raster for every adjective permutation.
- Add actual files to `public/art/` and matching manifest entries. Never invent image URLs or ship missing files.
- Use 256px thumbnails and 512px detail artwork in WebP/AVIF; target 15–40KB per thumbnail after visual review.
- Only a 48-card page is mounted. Image loading is lazy with reserved dimensions and icon fallback on error. Loading 1,000 images at startup is prohibited.
- Future era packs may split into lazy-loaded manifests when the measured payload warrants it. v0.2 ships one small data catalog; it does not pretend to have a CDN/image pipeline already deployed.

## Art prompt

Create a single isolated [ITEM] icon for a civilization card-crafting game, refined flat papercraft, subtle cut-paper layers, readable silhouette at 64 pixels, limited palette, front-facing view, soft restrained shadow, transparent background, consistent proportions, no letters, no numbers, no card frame, no UI, no watermark. Material accent: [CATEGORY COLOR]. Era context: [ERA].

Use the same references and camera treatment across batches. Store approved images by stable ID and version, not by player-facing display name.
