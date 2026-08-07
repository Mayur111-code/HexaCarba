const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { FILE_LIMITS, ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPES } = require('../utils/constants');

// Memory storage only — files are streamed straight to ImageKit and never
// touch the server filesystem (ephemeral on Render).
const storage = multer.memoryStorage();

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