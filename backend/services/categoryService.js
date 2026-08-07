const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta, buildSearchFilter, generateUniqueSlug } = require('../utils/helpers');

const createCategory = async (data) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) throw ApiError.conflict('A category with this name already exists');

  data.slug = await generateUniqueSlug(Category, data.name);
  return Category.create(data);
};

const getCategories = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.search) {
    Object.assign(filter, buildSearchFilter(['name', 'description'], query.search));
  }
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const sort = query.sort || 'displayOrder name';

  const [categories, total] = await Promise.all([
    Category.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Category.countDocuments(filter),
  ]);

  return {
    data: categories,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getAllCategories = async () => {
  return Category.find({ isActive: true }).sort('displayOrder name').lean();
};

const getCategory = async (idOrSlug) => {
  const category =
    (await Category.findById(idOrSlug)) ||
    (await Category.findOne({ slug: idOrSlug }));
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

const updateCategory = async (id, data) => {
  if (data.name) {
    const existing = await Category.findOne({ name: data.name, _id: { $ne: id } });
    if (existing) throw ApiError.conflict('A category with this name already exists');
    data.slug = await generateUniqueSlug(Category, data.name, id);
  }

  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound('Category not found');

  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw ApiError.badRequest(
      `Cannot delete category "${category.name}" because ${productCount} product(s) are assigned to it`
    );
  }

  await Category.findByIdAndDelete(id);
  return category;
};

module.exports = { createCategory, getCategories, getAllCategories, getCategory, updateCategory, deleteCategory };
