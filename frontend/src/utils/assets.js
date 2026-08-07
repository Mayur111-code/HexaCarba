import { API_BASE_URL } from '../constants';

/**
 * Resolve a stored asset URL so it works from any frontend origin.
 * - Absolute URLs (Cloudinary / full http/https) pass through unchanged.
 * - Relative `/uploads/...` paths are prefixed with the API base URL,
 *   because the browser would otherwise resolve them against the
 *   frontend origin (Vercel / localhost:5173) where they don't exist.
 */
export const resolveAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  const base = API_BASE_URL.replace(/\/+$/, '');
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

export const resolveImages = (images = []) =>
  images.map((img) => ({ ...img, url: resolveAssetUrl(img.url) }));

export const resolveProductSheet = (sheet) =>
  sheet ? { ...sheet, url: resolveAssetUrl(sheet.url) } : sheet;
