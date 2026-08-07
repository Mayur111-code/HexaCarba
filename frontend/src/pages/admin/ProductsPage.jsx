import { useState, useEffect, useCallback } from 'react';
import { productService } from '../../services/productService';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCube, HiOutlineEye, HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { resolveAssetUrl } from '../../utils/assets';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { page, limit, goToPage, setPage } = usePagination();
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productService.getAll({ page, limit, search: debouncedSearch });
      setProducts(data.data);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [debouncedSearch, setPage]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await productService.delete(deleteConfirm._id);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (product) => {
    try {
      await productService.toggleStatus(product._id);
      toast.success(`Product ${product.status === 'active' ? 'deactivated' : 'activated'}`);
      fetchProducts();
    } catch {
      // handled
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-xs">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Image', 'Name', 'Category', 'Short Description', 'Status', 'Views', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7}><Loader /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No products found" icon={HiOutlineCube} /></td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {product.images?.[0]?.url ? (
                        <img src={resolveAssetUrl(product.images[0].url)} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                          <HiOutlineCube className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.category?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{product.shortDescription}</td>
                    <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                    <td className="px-4 py-3 text-sm">{product.viewCount || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/products/${product.slug}`)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="View">
                          <HiOutlineEye className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate(`/admin/products/${product._id}/edit`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggle(product)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Toggle Status">
                          <HiOutlineSwitchHorizontal className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(product)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination && <div className="p-4"><Pagination pagination={pagination} onPageChange={goToPage} /></div>}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"?`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProductsPage;
