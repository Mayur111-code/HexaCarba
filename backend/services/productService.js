const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta, buildSearchFilter, generateUniqueSlug } = require('../utils/helpers');
const { resolveImages, resolveProductSheet } = require('../utils/assetUrl');
const { deletePdfAsset, deleteAsset } = require('../utils/cloudinaryUpload');

const applyAssetUrls = (products) => {
  if (!products) return products;
  const list = Array.isArray(products) ? products : [products];
  list.forEach((p) => {
    if (p.images) p.images = resolveImages(p.images);
    if (p.productSheet) p.productSheet = resolveProductSheet(p.productSheet);
  });
  return products;
};

const createProduct = async (data) => {
  data.slug = await generateUniqueSlug(Product, data.name);
  return Product.create(data);
};

const getProducts = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.search) {
    Object.assign(
      filter,
      buildSearchFilter(['name', 'shortDescription', 'longDescription'], query.search)
    );
  }
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;

  const sort = query.sort || '-createdAt';

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    data: applyAssetUrls(products),
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getPublicProducts = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { status: 'active' };

  if (query.search) {
    Object.assign(
      filter,
      buildSearchFilter(['name', 'shortDescription', 'longDescription'], query.search)
    );
  }
  if (query.category) filter.category = query.category;

  const sort = query.sort || '-createdAt';

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select('name slug shortDescription images productSheet category createdAt')
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    data: applyAssetUrls(products),
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getProduct = async (idOrSlug) => {
  const product =
    (await Product.findById(idOrSlug).populate('category', 'name slug')) ||
    (await Product.findOne({ slug: idOrSlug }).populate('category', 'name slug'));
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

const getPublicProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, status: 'active' }).populate(
    'category',
    'name slug'
  );
  if (!product) throw ApiError.notFound('Product not found');

  product.viewCount += 1;
  await product.save({ validateBeforeSave: false });

  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    status: 'active',
  })
    .select('name slug shortDescription images')
    .limit(4)
    .lean();

  return { product, relatedProducts };
};

const updateProduct = async (id, data) => {
  if (data.name) {
    data.slug = await generateUniqueSlug(Product, data.name, id);
  }

  // Removing the sheet from the admin UI: clean up the stored file too.
  if (data.productSheet === null) {
    const existing = await Product.findById(id);
    if (existing && existing.productSheet) {
      await deletePdfAsset(existing.productSheet);
    }
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  for (const image of product.images || []) {
    await deleteAsset(image);
  }
  await deletePdfAsset(product.productSheet);

  await Product.findByIdAndDelete(id);
  return product;
};

const toggleProductStatus = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');
  product.status = product.status === 'active' ? 'inactive' : 'active';
  await product.save();
  return product;
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
};
