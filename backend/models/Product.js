const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 300,
    },
    longDescription: {
      type: String,
      maxlength: 5000,
    },
    applications: [String],
    industries: [String],
    features: [String],
    specifications: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    images: [
      {
        public_id: String,
        url: String,
        isMain: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],
    productSheet: {
      public_id: String,
      url: String,
      fileName: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    seoTitle: {
      type: String,
      maxlength: 70,
    },
    seoDescription: {
      type: String,
      maxlength: 160,
    },
    seoKeywords: [String],
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', shortDescription: 'text', longDescription: 'text' });

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
