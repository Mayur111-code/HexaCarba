/**
 * Resolve a stored asset URL.
 *
 * Every asset lives in ImageKit, so stored URLs are always absolute
 * https URLs and pass through unchanged. Relative paths can only exist on
 * legacy records — they are returned as-is and fall back to the placeholder
 * UI since no local file server exists.
 */
export const resolveAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  return url;
};

export const resolveImages = (images = []) =>
  images.map((img) => ({ ...img, url: resolveAssetUrl(img.url) }));

export const resolveProductSheet = (sheet) =>
  sheet ? { ...sheet, url: resolveAssetUrl(sheet.url) } : sheet;