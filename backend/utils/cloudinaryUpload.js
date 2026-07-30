const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const uploadToCloudinary = async (filePath, folder = 'hexacarb/products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    fs.unlink(filePath, () => {});
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
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
    fs.unlink(filePath, () => {});
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
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch {
    // ignore if already deleted
  }
};

module.exports = { uploadToCloudinary, uploadPdfToCloudinary, deleteFromCloudinary };
