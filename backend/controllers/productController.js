const productService = require('../services/productService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Product = require('../models/Product');
const {
  uploadImage,
  uploadPdf,
  deleteImage: deleteImagekitImage,
  deletePdf: deleteImagekitPdf,
  deleteFile: deleteFileById,
} = require('../services/imagekitService');
const {
  resolveImages,
  resolveProductSheet,
} = require('../utils/assetUrl');

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    ApiResponse.success(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getPublicProducts = async (req, res, next) => {
  try {
    const result = await productService.getPublicProducts(req.query);
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.params.id);
    product.images = resolveImages(product.images);
    product.productSheet = resolveProductSheet(product.productSheet);
    ApiResponse.success(res, product);
  } catch (error) {
    next(error);
  }
};

const getPublicProductBySlug = async (req, res, next) => {
  try {
    const { product, relatedProducts } = await productService.getPublicProductBySlug(req.params.slug);
    product.images = resolveImages(product.images);
    product.productSheet = resolveProductSheet(product.productSheet);
    relatedProducts.forEach((rp) => {
      rp.images = resolveImages(rp.images);
    });
    ApiResponse.success(res, { product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    product.images = resolveImages(product.images);
    product.productSheet = resolveProductSheet(product.productSheet);
    ApiResponse.success(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    ApiResponse.success(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await productService.toggleProductStatus(req.params.id);
    ApiResponse.success(res, product, `Product ${product.status === 'active' ? 'activated' : 'deactivated'}`);
  } catch (error) {
    next(error);
  }
};

const uploadImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw ApiError.notFound('Product not found');

    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest('No images uploaded');
    }

    const uploadedImages = [];
    try {
      for (const file of req.files) {
        const result = await uploadImage(file.buffer, file.originalname);
        uploadedImages.push({
          fileId: result.fileId,
          url: result.url,
          name: result.name,
          isMain: uploadedImages.length === 0 && product.images.length === 0,
          order: product.images.length + uploadedImages.length,
        });
      }
} catch (uploadErr) {
      // Roll back any images already pushed to ImageKit so no orphans remain.
      for (const img of uploadedImages) {
        await deleteFileById(img.fileId);
      }
      console.error('ImageKit Upload Error (full SDK error):');
      console.error(uploadErr);
      console.error('ImageKit Upload Error message:', uploadErr && uploadErr.message);
      throw ApiError.badRequest(`Image upload failed: ${uploadErr && uploadErr.message}`);
    }
    product.images.push(...uploadedImages);
    await product.save();

    product.images = resolveImages(product.images);
    ApiResponse.success(res, product, 'Images uploaded successfully');
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    const product = await Product.findById(id);
    if (!product) throw ApiError.notFound('Product not found');

    const image = product.images.id(imageId);
    if (!image) throw ApiError.notFound('Image not found');

    await deleteImagekitImage(image);

    product.images.pull(imageId);
    await product.save();

    product.images = resolveImages(product.images);
    ApiResponse.success(res, product, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
};

const setMainImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    const product = await Product.findById(id);
    if (!product) throw ApiError.notFound('Product not found');

    const image = product.images.id(imageId);
    if (!image) throw ApiError.notFound('Image not found');

    product.images.forEach((img) => {
      img.isMain = img._id.toString() === imageId;
    });
    await product.save();

    product.images = resolveImages(product.images);
    ApiResponse.success(res, product, 'Main image updated');
  } catch (error) {
    next(error);
  }
};

const uploadProductSheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw ApiError.notFound('Product not found');

    if (!req.file) throw ApiError.badRequest('No PDF file uploaded');

    // Replace semantics — upload the new asset first, then delete the old one
    // from ImageKit, then persist. A failed upload therefore never leaves
    // the product without a working sheet.
    let result;
    try {
      result = await uploadPdf(req.file.buffer, req.file.originalname);
    } catch (uploadErr) {
      console.error('ImageKit Sheet Upload Error (full SDK error):');
      console.error(uploadErr);
      console.error('ImageKit Sheet Upload Error message:', uploadErr && uploadErr.message);
      throw ApiError.badRequest(
        `PDF upload failed: ${uploadErr && uploadErr.message}`
      );
    }

    await deleteImagekitPdf(product.productSheet);

    product.productSheet = {
      fileId: result.fileId,
      url: result.url,
      name: result.name,
    };

    await product.save();
    product.productSheet = resolveProductSheet(product.productSheet);
    ApiResponse.success(res, product, 'Product sheet uploaded');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getPublicProducts,
  getProduct,
  getPublicProductBySlug,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  uploadImages,
  deleteImage,
  setMainImage,
  uploadProductSheet,
};