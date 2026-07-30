const slugify = require('slugify');

const generateSlug = (text) => {
  return slugify(text, { lower: true, strict: true, trim: true });
};

const generateUniqueSlug = async (Model, text, existingId = null) => {
  let slug = generateSlug(text);
  let counter = 1;
  let query = { slug };

  while (true) {
    if (existingId) {
      query._id = { $ne: existingId };
    }
    const exists = await Model.findOne(query);
    if (!exists) break;
    slug = `${generateSlug(text)}-${counter}`;
    counter++;
    query = { slug };
    if (existingId) {
      query._id = { $ne: existingId };
    }
  }
  return slug;
};

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSearchFilter = (searchFields, searchTerm) => {
  if (!searchTerm) return {};
  const regex = new RegExp(escapeRegex(searchTerm), 'i');
  return {
    $or: searchFields.map((field) => ({ [field]: regex })),
  };
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  parsePagination,
  buildPaginationMeta,
  buildSearchFilter,
};
