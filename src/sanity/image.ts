/**
 * Images from Sanity, served by Sanity's image CDN as WebP in several widths.
 * The site never downloads them at build time: the CDN resizes on request,
 * so a `srcset` is just a list of URLs.
 *
 * An editor's crop is applied by the URL builder; their hotspot becomes the
 * CSS object-position, so a cover-fitted image keeps its subject in frame.
 * Adapted from the drgeoffcashion site so the two render images the same way.
 */
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "sanity:client";

const { projectId, dataset } = sanityClient.config();
const builder = createImageUrlBuilder({ projectId: projectId!, dataset: dataset! });

export interface SanityImage {
  asset: { _ref: string };
  alt?: string;
  hotspot?: { x: number; y: number; width?: number; height?: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

/** Pixel size of the (cropped) image, read from the asset id: image-<hash>-<w>x<h>-<ext>. */
export function dimensions(img: SanityImage): { width: number; height: number } {
  const m = img.asset._ref.match(/-(\d+)x(\d+)-[a-z]+$/);
  if (!m) throw new Error(`Sanity: unexpected image reference ${img.asset._ref}`);
  const c = img.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  return {
    width: Math.round(Number(m[1]) * (1 - c.left - c.right)),
    height: Math.round(Number(m[2]) * (1 - c.top - c.bottom)),
  };
}

/** One WebP URL at the given width. */
export function imageUrl(img: SanityImage, width: number, quality = 80): string {
  return builder.image(img).width(width).quality(quality).format("webp").fit("max").url();
}

/** src, srcset and intrinsic size for an <img>. */
export function responsive(img: SanityImage, widths: number[], quality = 80) {
  const { width, height } = dimensions(img);
  const usable = [...new Set(widths.map((w) => Math.min(w, width)))].sort((a, b) => a - b);
  return {
    src: imageUrl(img, usable[usable.length - 1], quality),
    srcset: usable.map((w) => `${imageUrl(img, w, quality)} ${w}w`).join(", "),
    width,
    height,
  };
}

/**
 * The editor's hotspot as a CSS object-position, or undefined when none is
 * set, so the page's own CSS positioning stays in charge.
 */
export function focus(img: SanityImage | undefined): string | undefined {
  const h = img?.hotspot;
  if (!h) return undefined;
  const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
  return `${pct(h.x)} ${pct(h.y)}`;
}
