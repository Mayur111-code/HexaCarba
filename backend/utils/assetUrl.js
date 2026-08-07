/**
 * Asset URL helpers.
 *
 * All assets are stored in ImageKit, so every stored URL is an absolute
 * https URL. Relative paths may only exist on legacy records — they are
 * returned unchanged (no local file server exists anymore) so the frontend
 * can show its fallback gracefully.
 */
const resolveAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;
  return url;
};

const resolveImage = (img) => {
  if (!img || typeof img !== 'object') return img;
  return { ...img, url: resolveAssetUrl(img.url) };
};

const resolveImages = (images = []) => images.map(resolveImage);

const resolveProductSheet = (sheet) => {
  if (!sheet || typeof sheet !== 'object') return sheet;
  return { ...sheet, url: resolveAssetUrl(sheet.url) };
};

module.exports = { resolveAssetUrl, resolveImage, resolveImages, resolveProductSheet };