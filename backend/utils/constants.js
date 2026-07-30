module.exports = {
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EDITOR: 'editor',
  },

  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DRAFT: 'draft',
  },

  CONTACT_STATUS: {
    UNREAD: 'unread',
    READ: 'read',
    REPLIED: 'replied',
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  FILE_LIMITS: {
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    PDF_MAX_SIZE: 20 * 1024 * 1024, // 20MB
    IMAGE_MAX_COUNT: 10,
  },

  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
};
