const productService = require('../services/productService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Product = require('../models/Product');
const {
  uploadToCloudinary,
  uploadPdfToCloudinary,
  deleteAsset,
  deletePdfAsset,
} = require('../utils/cloudinaryUpload');
const {
  resolveAssetUrl,
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
    for (const file of req.files) {
      try {
        const result = await uploadToCloudinary(file.path, 'hexacarb/products');
        uploadedImages.push({
          public_id: result.public_id,
          url: resolveAssetUrl(result.url),
          isMain: uploadedImages.length === 0 && product.images.length === 0,
          order: product.images.length + uploadedImages.length,
        });
      } catch (uploadErr) {
        // If Cloudinary fails, store locally (file is kept on disk)
        const localUrl = `/uploads/${file.filename}`;
        uploadedImages.push({
          public_id: `local-${file.filename}`,
          url: localUrl,
          isMain: uploadedImages.length === 0 && product.images.length === 0,
          order: product.images.length + uploadedImages.length,
        });
      }
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

    await deleteAsset(image);

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

    await deletePdfAsset(product.productSheet);

    try {
      const result = await uploadPdfToCloudinary(req.file.path, req.file.originalname, 'hexacarb/product-sheets');
      product.productSheet = {
        public_id: result.public_id,
        url: resolveAssetUrl(result.url),
        fileName: result.fileName,
      };
    } catch {
      product.productSheet = {
        public_id: `local-${req.file.filename}`,
        url: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
      };
    }

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