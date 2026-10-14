// Resolve from the module rather than the current page URL. Vite rewrites these
// literal URLs for production; native modules resolve them in the source checkout.
const urls = {
  "video/to-breathe-walkthrough.mp4": new URL(
    "../public/video/to-breathe-walkthrough.mp4",
    import.meta.url,
  ).href,
  "video/poster.webp": new URL("../public/video/poster.webp", import.meta.url)
    .href,
  "video/captions.vtt": new URL("../public/video/captions.vtt", import.meta.url)
    .href,
  "assets/industrial.webp": new URL(
    "../public/assets/industrial.webp",
    import.meta.url,
  ).href,
  "assets/luxury.webp": new URL("../public/assets/luxury.webp", import.meta.url)
    .href,
  "assets/mediterranean.webp": new URL(
    "../public/assets/mediterranean.webp",
    import.meta.url,
  ).href,
  "assets/natural.webp": new URL(
    "../public/assets/natural.webp",
    import.meta.url,
  ).href,
  "assets/page-1.webp": new URL("../public/assets/page-1.webp", import.meta.url)
    .href,
  "assets/page-10.webp": new URL(
    "../public/assets/page-10.webp",
    import.meta.url,
  ).href,
  "assets/page-11.webp": new URL(
    "../public/assets/page-11.webp",
    import.meta.url,
  ).href,
  "assets/page-12.webp": new URL(
    "../public/assets/page-12.webp",
    import.meta.url,
  ).href,
  "assets/page-13.webp": new URL(
    "../public/assets/page-13.webp",
    import.meta.url,
  ).href,
  "assets/page-14.webp": new URL(
    "../public/assets/page-14.webp",
    import.meta.url,
  ).href,
  "assets/page-15.webp": new URL(
    "../public/assets/page-15.webp",
    import.meta.url,
  ).href,
  "assets/page-16.webp": new URL(
    "../public/assets/page-16.webp",
    import.meta.url,
  ).href,
  "assets/page-17.webp": new URL(
    "../public/assets/page-17.webp",
    import.meta.url,
  ).href,
  "assets/page-18.webp": new URL(
    "../public/assets/page-18.webp",
    import.meta.url,
  ).href,
  "assets/page-19.webp": new URL(
    "../public/assets/page-19.webp",
    import.meta.url,
  ).href,
  "assets/page-2.webp": new URL("../public/assets/page-2.webp", import.meta.url)
    .href,
  "assets/page-20.webp": new URL(
    "../public/assets/page-20.webp",
    import.meta.url,
  ).href,
  "assets/page-21.webp": new URL(
    "../public/assets/page-21.webp",
    import.meta.url,
  ).href,
  "assets/page-22.webp": new URL(
    "../public/assets/page-22.webp",
    import.meta.url,
  ).href,
  "assets/page-23.webp": new URL(
    "../public/assets/page-23.webp",
    import.meta.url,
  ).href,
  "assets/page-3.webp": new URL("../public/assets/page-3.webp", import.meta.url)
    .href,
  "assets/page-4.webp": new URL("../public/assets/page-4.webp", import.meta.url)
    .href,
  "assets/page-5.webp": new URL("../public/assets/page-5.webp", import.meta.url)
    .href,
  "assets/page-6.webp": new URL("../public/assets/page-6.webp", import.meta.url)
    .href,
  "assets/page-7.webp": new URL("../public/assets/page-7.webp", import.meta.url)
    .href,
  "assets/page-8.webp": new URL("../public/assets/page-8.webp", import.meta.url)
    .href,
  "assets/page-9.webp": new URL("../public/assets/page-9.webp", import.meta.url)
    .href,
  "assets/scandi.webp": new URL("../public/assets/scandi.webp", import.meta.url)
    .href,
  "assets/shelter.webp": new URL(
    "../public/assets/shelter.webp",
    import.meta.url,
  ).href,
  "assets/tropical.webp": new URL(
    "../public/assets/tropical.webp",
    import.meta.url,
  ).href,
  "assets/veil-industrial.webp": new URL(
    "../public/assets/veil-industrial.webp",
    import.meta.url,
  ).href,
  "assets/veil-med.webp": new URL(
    "../public/assets/veil-med.webp",
    import.meta.url,
  ).href,
  "assets/veil-scandi.webp": new URL(
    "../public/assets/veil-scandi.webp",
    import.meta.url,
  ).href,
  "assets/veil-tropical.webp": new URL(
    "../public/assets/veil-tropical.webp",
    import.meta.url,
  ).href,
  "assets/veil.webp": new URL("../public/assets/veil.webp", import.meta.url)
    .href,
  "catalogue.pdf": new URL("../public/catalogue.pdf", import.meta.url).href,
};

export function publicAsset(path) {
  const key = path.replace(/^\/+/, "");
  if (!Object.hasOwn(urls, key))
    throw new Error(`Unknown catalogue asset: ${key}`);
  return urls[key];
}

export const assetPaths = Object.freeze(Object.keys(urls));
