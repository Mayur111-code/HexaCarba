const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const config = require('../config/env');
const { FILE_LIMITS, ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPES } = require('../utils/constants');

const uploadDir = path.join(__dirname, '..', config.uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const pdfFileFilter = (req, file, cb) => {
  if (ALLOWED_PDF_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF files are allowed'), false);
  }
};

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: FILE_LIMITS.IMAGE_MAX_SIZE },
});

const uploadPDF = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: FILE_LIMITS.PDF_MAX_SIZE },
});

const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: FILE_LIMITS.IMAGE_MAX_SIZE, files: FILE_LIMITS.IMAGE_MAX_COUNT },
});

module.exports = { uploadImage, uploadPDF, uploadMultipleImages };