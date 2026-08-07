const config = require('../config/env');

/**
 * Returns an absolute URL for a stored asset.
 * - Absolute URLs (Cloudinary, full http) are returned unchanged.
 * - Relative /uploads/... paths are prefixed with SERVER_URL so they work
 *   from any frontend origin (Vercel, Render, localhost).
 */
const resolveAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;
  if (config.serverUrl) return `${config.serverUrl}${url.startsWith('/') ? url : `/${url}`}`;
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
