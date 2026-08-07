const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

const uploadDir = path.join(__dirname, '..', config.uploadDir);

const safeUnlink = (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    // ignore — file may already be gone
  }
};

/**
 * Remove a file that was stored locally under backend/<uploadDir>.
 * Used for the 'local-' fallback uploads so disk storage never leaks.
 */
const deleteLocalFile = (storedName) => {
  if (!storedName) return;
  const base = path.basename(storedName);
  safeUnlink(path.join(uploadDir, base));
};

const uploadToCloudinary = async (filePath, folder = 'hexacarb/products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    safeUnlink(filePath);
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    // keep the local file on failure so the caller can fall back to it
    throw error;
  }
};

const uploadPdfToCloudinary = async (filePath, fileName, folder = 'hexacarb/product-sheets') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'raw',
      public_id: `sheet-${Date.now()}`,
    });
    safeUnlink(filePath);
    return {
      public_id: result.public_id,
      url: result.secure_url,
      fileName,
    };
  } catch (error) {
    throw error;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId || publicId.startsWith('local-')) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch {
    // ignore if already deleted
  }
};

/**
 * Delete an asset regardless of where it lives.
 * - Cloudinary assets are destroyed via the API.
 * - Local fallback assets (public_id starting with 'local-') are removed
 *   from the uploads directory using the stored url/filename.
 */
const deleteAsset = async (asset) => {
  if (!asset) return;
  if (asset.public_id && !asset.public_id.startsWith('local-')) {
    await deleteFromCloudinary(asset.public_id, 'image');
  } else if (asset.url && asset.url.startsWith('/uploads/')) {
    deleteLocalFile(asset.url);
  }
};

const deletePdfAsset = async (asset) => {
  if (!asset) return;
  if (asset.public_id && !asset.public_id.startsWith('local-')) {
    await deleteFromCloudinary(asset.public_id, 'raw');
  } else if (asset.url && asset.url.startsWith('/uploads/')) {
    deleteLocalFile(asset.url);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadPdfToCloudinary,
  deleteFromCloudinary,
  deleteAsset,
  deletePdfAsset,
  deleteLocalFile,
  safeUnlink,
};
