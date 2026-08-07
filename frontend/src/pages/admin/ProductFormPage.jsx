import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineUpload,
  HiOutlineDocumentText,
  HiOutlineStar,
} from 'react-icons/hi';
import Loader from '../../components/common/Loader';
import { resolveAssetUrl } from '../../utils/assets';

const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [stateImages, setStateImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [productSheet, setProductSheet] = useState(null);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const { register, handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      category: '',
      shortDescription: '',
      longDescription: '',
      applications: [],
      industries: [],
      features: [],
      specifications: [{ label: '', value: '' }],
      status: 'active',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
    },
  });

  const { fields: specFields, append: addSpec, remove: removeSpec } = useFieldArray({
    control, name: 'specifications',
  });

  useEffect(() => {
    categoryService.getPublic().then(({ data }) => setCategories(data.data)).catch(() => {});

    if (isEdit) {
      productService.getById(id).then(({ data }) => {
        const p = data.data;
        reset({
          name: p.name || '',
          category: p.category?._id || p.category || '',
          shortDescription: p.shortDescription || '',
          longDescription: p.longDescription || '',
          applications: p.applications || [],
          industries: p.industries || [],
          features: p.features || [],
          specifications: p.specifications?.length ? p.specifications : [{ label: '', value: '' }],
          status: p.status || 'active',
          seoTitle: p.seoTitle || '',
          seoDescription: p.seoDescription || '',
          seoKeywords: p.seoKeywords || [],
        });
        setStateImages(p.images || []);
        setProductSheet(p.productSheet || null);
      }).finally(() => setPageLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        specifications: formData.specifications.filter((s) => s.label && s.value),
      };
      if (isEdit) {
        await productService.update(id, payload);
        toast.success('Product updated');
      } else {
        const { data } = await productService.create(payload);
        const newId = data.data._id;
        if (stateImages.length > 0) {
          await uploadImagesToProduct(newId);
        }
        if (productSheet?.file) {
          await uploadSheetToProduct(newId);
        }
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (field, e) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      const newItem = value.slice(0, -1).trim();
      if (newItem) {
        const current = watch(field) || [];
        setValue(field, [...current, newItem]);
        e.target.value = '';
      }
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));
    if (isEdit) {
      uploadImagesToProduct(id, files);
    } else {
      setStateImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = '';
  };

  const uploadImagesToProduct = async (productId, files) => {
    const filesToUpload = files || stateImages.filter((img) => img.isNew).map((img) => img.file);
    if (filesToUpload.length === 0) return;
    setImageUploading(true);
    try {
      const { data } = await productService.uploadImages(productId, filesToUpload);
      setStateImages(data.data.images || []);
      toast.success('Images uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const uploadSheetToProduct = async (productId) => {
    if (!productSheet?.file) return;
    setPdfUploading(true);
    try {
      const { data } = await productService.uploadSheet(productId, productSheet.file);
      setProductSheet(data.data.productSheet || null);
      toast.success('Product sheet uploaded');
    } catch {
      toast.error('PDF upload failed');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleRemoveImage = async (img, idx) => {
    if (img.isNew) {
      URL.revokeObjectURL(img.preview);
      setStateImages((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    if (img._id && isEdit) {
      try {
        await productService.deleteImage(id, img._id);
        toast.success('Image removed');
      } catch {
        toast.error('Failed to remove image');
      }
    }
    setStateImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSetMainImage = async (img, idx) => {
    if (img.isNew) {
      setStateImages((prev) =>
        prev.map((im, i) => ({ ...im, isMain: i === idx }))
      );
      return;
    }
    if (img._id && isEdit) {
      try {
        await productService.setMainImage(id, img._id);
        setStateImages((prev) =>
          prev.map((im) => ({
            ...im,
            isMain: im._id === img._id,
          }))
        );
        toast.success('Main image set');
      } catch {
        toast.error('Failed to set main image');
      }
    }
  };

  const handlePdfSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductSheet({ file, fileName: file.name });
    if (isEdit) uploadSheetToProduct(id);
    e.target.value = '';
  };

  const handleRemoveSheet = async () => {
    if (productSheet?.file && !isEdit) {
      setProductSheet(null);
      return;
    }
    if (isEdit) {
      try {
        await productService.update(id, { productSheet: null });
        setProductSheet(null);
        toast.success('Sheet removed');
      } catch {
        toast.error('Failed to remove sheet');
      }
    } else {
      setProductSheet(null);
    }
  };

  if (pageLoading) return <Loader />;

  return (
    <div>
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input {...register('name', { required: 'Name is required' })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select {...register('category', { required: 'Category is required' })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
            <textarea {...register('shortDescription', { required: 'Required', maxLength: 300 })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
            <textarea {...register('longDescription')} rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Product Images</h2>
              <p className="text-sm text-gray-500">Upload up to 10 images. First image or starred image is the main display image.</p>
            </div>
            <div className="flex gap-2">
              {isEdit && stateImages.some((i) => i.isNew) && (
                <button
                  type="button"
                  onClick={() => uploadImagesToProduct(id)}
                  disabled={imageUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                >
                  {imageUploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
                  ) : (
                    <><HiOutlineUpload className="w-4 h-4" /> Save Images</>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={stateImages.length >= 10}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                <HiOutlinePhotograph className="w-4 h-4" /> Add Images
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {stateImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {stateImages.map((img, idx) => (
                <div
                  key={img._id || img.preview}
                  className={`relative group rounded-lg overflow-hidden border-2 ${
                    img.isMain ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img.isNew ? img.preview : resolveAssetUrl(img.url)}
                    alt={`Product ${idx + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(img, idx)}
                      className={`p-1.5 rounded-full ${
                        img.isMain ? 'bg-yellow-400 text-yellow-900' : 'bg-white text-gray-600 hover:text-yellow-600'
                      }`}
                      title="Set as main image"
                    >
                      <HiOutlineStar className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img, idx)}
                      className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Remove image"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                  {img.isMain && (
                    <span className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      MAIN
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400">
              <HiOutlinePhotograph className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">No images uploaded yet. Click "Add Images" to upload.</p>
            </div>
          )}
        </div>

        {/* Product Sheet PDF */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Product Sheet (PDF)</h2>
              <p className="text-sm text-gray-500">Upload a product specification sheet / brochure in PDF format.</p>
            </div>
            <div className="flex gap-2">
              {productSheet?.file && !isEdit && (
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-500"
                >
                  Will save with product
                </button>
              )}
              {isEdit && productSheet?.file && (
                <button
                  type="button"
                  onClick={() => uploadSheetToProduct(id)}
                  disabled={pdfUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                >
                  {pdfUploading ? 'Uploading...' : 'Save PDF'}
                </button>
              )}
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <HiOutlineDocumentText className="w-4 h-4" />
                {productSheet ? 'Change PDF' : 'Upload PDF'}
              </button>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfSelect}
                className="hidden"
              />
            </div>
          </div>

          {productSheet ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <HiOutlineDocumentText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{productSheet.fileName || 'Product Sheet'}</p>
                  <p className="text-xs text-gray-400">
                    {productSheet.url ? (
                      <a href={resolveAssetUrl(productSheet.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View PDF
                      </a>
                    ) : (
                      'Will be uploaded on save'
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveSheet}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                title="Remove PDF"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400">
              <HiOutlineDocumentText className="w-8 h-8 mx-auto mb-1" />
              <p className="text-sm">No product sheet uploaded</p>
            </div>
          )}
        </div>

        {/* Arrays: applications, industries, features */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Tags & Lists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['applications', 'industries', 'features']).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <div>
                  <input
                    type="text"
                    placeholder="Type and add comma..."
                    onKeyUp={(e) => handleArrayInput(field, e)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                  />
                  <div className="flex flex-wrap gap-1">
                    {(watch(field) || []).map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {item}
                        <button type="button" onClick={() => {
                          const current = watch(field) || [];
                          setValue(field, current.filter((_, idx) => idx !== i));
                        }}><HiOutlineX className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <input type="hidden" {...register(field)} />
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Specifications</h2>
            <button type="button" onClick={() => addSpec({ label: '', value: '' })} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
              <HiOutlinePlus className="w-4 h-4" /> Add Row
            </button>
          </div>
          <div className="space-y-2">
            {specFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  {...register(`specifications.${index}.label`)}
                  placeholder="Label (e.g., Material)"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  {...register(`specifications.${index}.value`)}
                  placeholder="Value (e.g., Impervious Graphite)"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button type="button" onClick={() => removeSpec(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SEO & Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">SEO & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input {...register('seoTitle')} maxLength={70} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <input {...register('seoDescription')} maxLength={160} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
