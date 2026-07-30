const categoryService = require('../services/categoryService');
const ApiResponse = require('../utils/ApiResponse');

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    ApiResponse.success(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategories(req.query);
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    ApiResponse.success(res, categories);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategory(req.params.id);
    ApiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    ApiResponse.success(res, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    ApiResponse.success(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createCategory, getCategories, getAllCategories, getCategory, updateCategory, deleteCategory };
